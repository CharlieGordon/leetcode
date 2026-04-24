# Browser Solution Runner Design

## Overview

Add a browser-only playground to the existing solution viewer so a user can edit a solution draft, run the exact script in the editor, and see terminal-like output in the page. The feature must not write back to repository files. Repository solution files remain the default source of truth until a browser draft exists for the selected problem and solution.

## Goals

- Let the user edit the selected TypeScript solution from the UI.
- Let the user execute the full editor contents exactly as written.
- Show output like a simple terminal, not a test report or structured result panel.
- Capture `console.log`, `console.warn`, `console.error`, and thrown errors in the terminal output.
- Ignore return values unless the user explicitly prints them with `console.log`.
- Save edits in browser storage per problem and solution.
- Restore the repository-loaded source when the browser draft is reset.

## Non-Goals

- Do not write edited code back to `src/problems/*/solutions/*.ts`.
- Do not add a backend service.
- Do not run Vitest from the browser.
- Do not add predefined test-case pass/fail output in the first version.
- Do not add a separate invocation input field. The editor is the script.

## Source Priority

The editor source is resolved in this order:

1. Use the `localStorage` draft for the selected problem and solution when it exists.
2. Otherwise use the repository-loaded source from the catalog.

The reset action deletes the matching browser draft and reloads the repository source for the active problem and solution.

Use a stable draft key such as:

```text
leetcode-draft:<problemSlug>:<solutionId>
```

## User Interface

The solution panel layout should be:

1. Toolbar with `Run`, `Reset draft`, and a compact draft status.
2. Full-width TypeScript editor.
3. Terminal output below the editor.
4. Optional AI Overview below the runnable area, preserving the existing overview convention.

The terminal output should be plain and chronological. For example, if the user writes:

```ts
export function twoSum(nums: number[], target: number): number[] {
  return [0, 1];
}

console.log(twoSum([2, 7, 11, 15], 9));
```

the terminal shows:

```text
[0, 1]
```

If the script evaluates a function call without logging the result, the terminal prints nothing unless the script logs internally or throws.

## Execution Model

Compile the edited TypeScript draft in the browser, then execute the compiled JavaScript in a dedicated Web Worker. The worker should receive the compiled script, patch console methods for the duration of the run, and post output lines back to the main thread.

The runner should:

- preserve log order,
- serialize common JavaScript values into readable terminal text,
- print thrown errors as terminal text,
- clear terminal output at the start of each run,
- report compile errors before attempting execution,
- terminate the worker after a fixed timeout so infinite loops do not freeze the app.

Recommended transform path: use `esbuild-wasm` because its transform API supports TypeScript strings in the browser. If implementation complexity becomes too high, TypeScript `transpileModule` is an acceptable fallback, but the worker isolation still matters.

## Component Boundaries

- `SolutionViewer` should keep owning selected-solution rendering and remain the integration point.
- A focused editor component should own draft display, edit events, run/reset controls, and terminal layout.
- A storage helper should own draft-key creation, reading, writing, and deleting.
- A runner helper should own TypeScript transform orchestration, worker lifecycle, timeout handling, and output message normalization.
- The worker script should be small and isolated from React.

This keeps catalog loading unchanged. The existing raw source strings remain sufficient input for the editor.

## Error Handling

- If compilation fails, show the compiler error text in the terminal.
- If execution throws, show the error name/message and stack when available.
- If execution times out, terminate the worker and show a timeout line in the terminal.
- If `localStorage` is unavailable, keep the editor usable in memory and show no blocking error.
- If resetting a draft fails because storage is unavailable, restore the current repo source in memory.

## Testing

Add focused tests for:

- draft-key generation and source priority,
- reset behavior restoring repo source,
- terminal formatting for logs and thrown errors,
- runner timeout handling through testable runner message logic,
- `SolutionViewer` rendering order: toolbar/editor, terminal below editor, AI Overview after the runnable area when present.

Run the standard checks after implementation:

```bash
npm test
npm run build
```

## Research Notes

- Web Workers support message passing via `postMessage`, which fits streaming terminal events from worker to React.
- Workers can be terminated immediately with `terminate()`, which is needed for timeout handling.
- `esbuild-wasm` supports browser transforms after initialization with a WebAssembly URL and can transform TypeScript strings.
