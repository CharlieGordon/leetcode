# Browser Solution Runner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a browser-only editable TypeScript solution runner with local draft persistence and terminal-style output.

**Architecture:** Keep catalog loading unchanged and wrap the currently selected raw solution source in a focused runnable editor. Draft source resolution is `localStorage` first, then repo-loaded source. Execution compiles TypeScript in the browser with `esbuild-wasm`, runs the compiled JavaScript in a Web Worker, and streams console/error lines back to React.

**Tech Stack:** React 19, Vite 7, TypeScript, Vitest, CSS Modules, `esbuild-wasm`, Web Workers, `localStorage`.

---

## File Structure

- Create `src/lib/solutionDrafts.ts`: draft-key generation, storage-safe read/write/delete helpers, and source-priority resolution.
- Create `src/lib/solutionDrafts.test.ts`: unit tests for source priority, reset behavior, and storage failure handling.
- Create `src/lib/terminalOutput.ts`: terminal line types and value/error formatting helpers shared by runner UI and tests.
- Create `src/lib/terminalOutput.test.ts`: unit tests for terminal formatting.
- Create `src/lib/solutionRunner.ts`: browser TypeScript transform with `esbuild-wasm`, worker lifecycle, timeout, and message normalization.
- Create `src/lib/solutionRunner.test.ts`: unit tests for runner message normalization and timeout behavior with fake dependencies.
- Create `src/lib/solutionExecution.worker.ts`: worker entry that executes compiled JavaScript, captures console methods, and posts terminal lines.
- Create `src/components/EditableSolutionRunner.tsx`: toolbar, editable textarea, run/reset controls, and terminal output.
- Create `src/components/EditableSolutionRunner.module.css`: full-width editor with bottom terminal layout.
- Modify `src/components/SolutionViewer.tsx`: pass the selected solution into `EditableSolutionRunner` and keep AI Overview below the runnable area.
- Modify `src/components/SolutionViewer.module.css`: preserve panel/overview styles and remove obsolete read-only code frame styles after the new component owns runner layout.
- Modify `src/components/ProblemDetail.tsx`: pass `problem.slug` to `SolutionViewer`.
- Modify `src/components/SolutionViewer.test.ts`: assert toolbar/editor/terminal order and AI Overview order.
- Modify `package.json` and `package-lock.json`: add `esbuild-wasm`.

---

### Task 1: Add `esbuild-wasm` Dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install the browser transform dependency**

Run:

```bash
npm install esbuild-wasm
```

Expected: `package.json` gains an `esbuild-wasm` dependency and `package-lock.json` records it.

- [ ] **Step 2: Verify dependency metadata changed only as expected**

Run:

```bash
git diff -- package.json package-lock.json
```

Expected: the diff only adds `esbuild-wasm` package metadata.

- [ ] **Step 3: Commit dependency addition**

Run:

```bash
git add package.json package-lock.json
git commit -m "Add browser TypeScript transform dependency"
```

Expected: commit succeeds.

---

### Task 2: Implement Draft Storage Helpers

**Files:**
- Create: `src/lib/solutionDrafts.ts`
- Create: `src/lib/solutionDrafts.test.ts`

- [ ] **Step 1: Write failing tests for draft source priority and reset behavior**

Create `src/lib/solutionDrafts.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  clearSolutionDraft,
  getSolutionDraftKey,
  readSolutionDraft,
  resolveSolutionSource,
  saveSolutionDraft,
} from './solutionDrafts';

function createStorage(seed: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(seed));

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

describe('solution draft storage', () => {
  it('builds a stable key from problem slug and solution id', () => {
    expect(getSolutionDraftKey('two-sum', 'hash-map')).toBe('leetcode-draft:two-sum:hash-map');
  });

  it('uses repo source when no browser draft exists', () => {
    const storage = createStorage();

    expect(resolveSolutionSource(storage, 'two-sum', 'hash-map', 'repo source')).toEqual({
      source: 'repo source',
      hasDraft: false,
    });
  });

  it('uses browser draft before repo source when draft exists', () => {
    const key = getSolutionDraftKey('two-sum', 'hash-map');
    const storage = createStorage({ [key]: 'draft source' });

    expect(resolveSolutionSource(storage, 'two-sum', 'hash-map', 'repo source')).toEqual({
      source: 'draft source',
      hasDraft: true,
    });
  });

  it('saves, reads, and clears a draft', () => {
    const storage = createStorage();

    saveSolutionDraft(storage, 'two-sum', 'hash-map', 'draft source');
    expect(readSolutionDraft(storage, 'two-sum', 'hash-map')).toBe('draft source');

    clearSolutionDraft(storage, 'two-sum', 'hash-map');
    expect(readSolutionDraft(storage, 'two-sum', 'hash-map')).toBeNull();
  });

  it('falls back to repo source when storage throws', () => {
    const throwingStorage = {
      getItem: () => {
        throw new Error('storage unavailable');
      },
      removeItem: () => {
        throw new Error('storage unavailable');
      },
      setItem: () => {
        throw new Error('storage unavailable');
      },
    } as unknown as Storage;

    expect(resolveSolutionSource(throwingStorage, 'two-sum', 'hash-map', 'repo source')).toEqual({
      source: 'repo source',
      hasDraft: false,
    });
    expect(() => saveSolutionDraft(throwingStorage, 'two-sum', 'hash-map', 'draft')).not.toThrow();
    expect(() => clearSolutionDraft(throwingStorage, 'two-sum', 'hash-map')).not.toThrow();
  });
});
```

- [ ] **Step 2: Run tests and verify they fail because the module does not exist**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test -- src/lib/solutionDrafts.test.ts
```

Expected: FAIL with an import error for `./solutionDrafts`.

- [ ] **Step 3: Implement draft storage helpers**

Create `src/lib/solutionDrafts.ts`:

```ts
const SOLUTION_DRAFT_PREFIX = 'leetcode-draft';

export type ResolvedSolutionSource = {
  source: string;
  hasDraft: boolean;
};

export function getSolutionDraftKey(problemSlug: string, solutionId: string): string {
  return `${SOLUTION_DRAFT_PREFIX}:${problemSlug}:${solutionId}`;
}

export function readSolutionDraft(
  storage: Storage | undefined,
  problemSlug: string,
  solutionId: string,
): string | null {
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(getSolutionDraftKey(problemSlug, solutionId));
  } catch {
    return null;
  }
}

export function saveSolutionDraft(
  storage: Storage | undefined,
  problemSlug: string,
  solutionId: string,
  source: string,
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(getSolutionDraftKey(problemSlug, solutionId), source);
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

export function clearSolutionDraft(
  storage: Storage | undefined,
  problemSlug: string,
  solutionId: string,
): void {
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(getSolutionDraftKey(problemSlug, solutionId));
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

export function resolveSolutionSource(
  storage: Storage | undefined,
  problemSlug: string,
  solutionId: string,
  repoSource: string,
): ResolvedSolutionSource {
  const draft = readSolutionDraft(storage, problemSlug, solutionId);

  if (draft !== null) {
    return {
      source: draft,
      hasDraft: true,
    };
  }

  return {
    source: repoSource,
    hasDraft: false,
  };
}
```

- [ ] **Step 4: Run focused tests and verify they pass**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test -- src/lib/solutionDrafts.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit draft storage helpers**

Run:

```bash
git add src/lib/solutionDrafts.ts src/lib/solutionDrafts.test.ts
git commit -m "Add solution draft storage helpers"
```

Expected: commit succeeds.

---

### Task 3: Implement Terminal Output Formatting

**Files:**
- Create: `src/lib/terminalOutput.ts`
- Create: `src/lib/terminalOutput.test.ts`

- [ ] **Step 1: Write failing tests for terminal formatting**

Create `src/lib/terminalOutput.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatConsoleValue, formatThrownValue, terminalLineToText } from './terminalOutput';

describe('terminal output formatting', () => {
  it('formats primitive console values', () => {
    expect(formatConsoleValue('hello')).toBe('hello');
    expect(formatConsoleValue(42)).toBe('42');
    expect(formatConsoleValue(true)).toBe('true');
    expect(formatConsoleValue(null)).toBe('null');
    expect(formatConsoleValue(undefined)).toBe('undefined');
  });

  it('formats arrays and objects as JSON when possible', () => {
    expect(formatConsoleValue([0, 1])).toBe('[0, 1]');
    expect(formatConsoleValue({ answer: 42 })).toBe('{"answer":42}');
  });

  it('falls back for circular objects', () => {
    const value: Record<string, unknown> = {};
    value.self = value;

    expect(formatConsoleValue(value)).toBe('[object Object]');
  });

  it('formats console lines without adding result labels', () => {
    expect(
      terminalLineToText({
        kind: 'log',
        values: ['nums:', [2, 7]],
      }),
    ).toBe('nums: [2, 7]');
  });

  it('formats thrown errors as terminal text', () => {
    expect(formatThrownValue({ name: 'Error', message: 'No solution found' })).toBe(
      'Error: No solution found',
    );
    expect(formatThrownValue('bad input')).toBe('bad input');
  });
});
```

- [ ] **Step 2: Run tests and verify they fail because the module does not exist**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test -- src/lib/terminalOutput.test.ts
```

Expected: FAIL with an import error for `./terminalOutput`.

- [ ] **Step 3: Implement terminal output helpers**

Create `src/lib/terminalOutput.ts`:

```ts
export type TerminalLine =
  | {
      kind: 'log' | 'warn' | 'error';
      values: unknown[];
    }
  | {
      kind: 'exception' | 'timeout' | 'compile-error';
      message: string;
    };

export function formatConsoleValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(formatConsoleValue).join(', ')}]`;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function formatThrownValue(value: unknown): string {
  if (
    value &&
    typeof value === 'object' &&
    'message' in value &&
    typeof value.message === 'string'
  ) {
    const name = 'name' in value && typeof value.name === 'string' ? value.name : 'Error';
    return `${name}: ${value.message}`;
  }

  return formatConsoleValue(value);
}

export function terminalLineToText(line: TerminalLine): string {
  if ('values' in line) {
    return line.values.map(formatConsoleValue).join(' ');
  }

  return line.message;
}
```

- [ ] **Step 4: Run focused tests and verify they pass**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test -- src/lib/terminalOutput.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit terminal formatting helpers**

Run:

```bash
git add src/lib/terminalOutput.ts src/lib/terminalOutput.test.ts
git commit -m "Add terminal output formatting"
```

Expected: commit succeeds.

---

### Task 4: Add Worker Runner and Message Handling

**Files:**
- Create: `src/lib/solutionRunner.ts`
- Create: `src/lib/solutionRunner.test.ts`
- Create: `src/lib/solutionExecution.worker.ts`

- [ ] **Step 1: Write failing tests for runner timeout and message normalization**

Create `src/lib/solutionRunner.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { normalizeWorkerMessage, runCompiledScriptWithWorker } from './solutionRunner';

class FakeWorker {
  static instances: FakeWorker[] = [];

  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;
  postedMessages: unknown[] = [];

  constructor() {
    FakeWorker.instances.push(this);
  }

  postMessage(message: unknown): void {
    this.postedMessages.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent);
  }
}

describe('solution runner', () => {
  it('normalizes known worker messages into terminal lines', () => {
    expect(normalizeWorkerMessage({ type: 'console', method: 'log', values: ['hello'] })).toEqual({
      kind: 'log',
      values: ['hello'],
    });
    expect(normalizeWorkerMessage({ type: 'error', message: 'Error: bad input' })).toEqual({
      kind: 'exception',
      message: 'Error: bad input',
    });
    expect(normalizeWorkerMessage({ type: 'done' })).toBeNull();
  });

  it('terminates the worker and reports timeout when execution does not finish', async () => {
    vi.useFakeTimers();
    FakeWorker.instances = [];

    const onLine = vi.fn();
    const runPromise = runCompiledScriptWithWorker({
      code: 'while (true) {}',
      WorkerConstructor: FakeWorker as unknown as typeof Worker,
      timeoutMs: 25,
      onLine,
    });

    expect(FakeWorker.instances[0].postedMessages).toEqual([{ type: 'run', code: 'while (true) {}' }]);

    await vi.advanceTimersByTimeAsync(25);
    await runPromise;

    expect(FakeWorker.instances[0].terminated).toBe(true);
    expect(onLine).toHaveBeenCalledWith({
      kind: 'timeout',
      message: 'Execution timed out after 25ms',
    });

    vi.useRealTimers();
  });

  it('resolves when the worker sends done', async () => {
    FakeWorker.instances = [];
    const onLine = vi.fn();

    const runPromise = runCompiledScriptWithWorker({
      code: 'console.log("done")',
      WorkerConstructor: FakeWorker as unknown as typeof Worker,
      timeoutMs: 1000,
      onLine,
    });

    FakeWorker.instances[0].emit({ type: 'console', method: 'log', values: ['done'] });
    FakeWorker.instances[0].emit({ type: 'done' });

    await runPromise;

    expect(onLine).toHaveBeenCalledWith({ kind: 'log', values: ['done'] });
    expect(FakeWorker.instances[0].terminated).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests and verify they fail because the module does not exist**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test -- src/lib/solutionRunner.test.ts
```

Expected: FAIL with an import error for `./solutionRunner`.

- [ ] **Step 3: Implement runner and transform orchestration**

Create `src/lib/solutionRunner.ts`:

```ts
import * as esbuild from 'esbuild-wasm';
import wasmUrl from 'esbuild-wasm/esbuild.wasm?url';
import type { TerminalLine } from './terminalOutput';

const DEFAULT_TIMEOUT_MS = 2000;

type WorkerConsoleMethod = 'log' | 'warn' | 'error';

type WorkerMessage =
  | {
      type: 'console';
      method: WorkerConsoleMethod;
      values: unknown[];
    }
  | {
      type: 'error';
      message: string;
    }
  | {
      type: 'done';
    };

type TransformApi = Pick<typeof esbuild, 'initialize' | 'transform'>;

type RunCompiledScriptOptions = {
  code: string;
  WorkerConstructor?: typeof Worker;
  timeoutMs?: number;
  onLine: (line: TerminalLine) => void;
};

let initializePromise: Promise<void> | undefined;

function ensureEsbuildInitialized(transformApi: TransformApi = esbuild): Promise<void> {
  initializePromise ??= transformApi.initialize({
    wasmURL: wasmUrl,
  });

  return initializePromise;
}

export function normalizeWorkerMessage(message: unknown): TerminalLine | null {
  if (!message || typeof message !== 'object' || !('type' in message)) {
    return {
      kind: 'exception',
      message: 'Runner sent an unreadable message',
    };
  }

  if (message.type === 'done') {
    return null;
  }

  if (
    message.type === 'console' &&
    'method' in message &&
    (message.method === 'log' || message.method === 'warn' || message.method === 'error') &&
    'values' in message &&
    Array.isArray(message.values)
  ) {
    return {
      kind: message.method,
      values: message.values,
    };
  }

  if (message.type === 'error' && 'message' in message && typeof message.message === 'string') {
    return {
      kind: 'exception',
      message: message.message,
    };
  }

  return {
    kind: 'exception',
    message: 'Runner sent an unsupported message',
  };
}

export async function transformSolutionScript(
  source: string,
  transformApi: TransformApi = esbuild,
): Promise<string> {
  await ensureEsbuildInitialized(transformApi);

  const result = await transformApi.transform(source, {
    format: 'iife',
    loader: 'ts',
    platform: 'browser',
    target: 'es2020',
  });

  return result.code;
}

export function runCompiledScriptWithWorker({
  code,
  WorkerConstructor = Worker,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onLine,
}: RunCompiledScriptOptions): Promise<void> {
  return new Promise((resolve) => {
    const worker = new WorkerConstructor(new URL('./solutionExecution.worker.ts', import.meta.url), {
      type: 'module',
    });

    let finished = false;

    function finish(): void {
      if (finished) {
        return;
      }

      finished = true;
      globalThis.clearTimeout(timeoutId);
      worker.terminate();
      resolve();
    }

    const timeoutId = globalThis.setTimeout(() => {
      onLine({
        kind: 'timeout',
        message: `Execution timed out after ${timeoutMs}ms`,
      });
      finish();
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const line = normalizeWorkerMessage(event.data);

      if (line) {
        onLine(line);
        return;
      }

      finish();
    };

    worker.onerror = (event: ErrorEvent) => {
      onLine({
        kind: 'exception',
        message: event.message,
      });
      finish();
    };

    worker.postMessage({ type: 'run', code });
  });
}

export async function runSolutionScript(
  source: string,
  onLine: (line: TerminalLine) => void,
): Promise<void> {
  try {
    const code = await transformSolutionScript(source);
    await runCompiledScriptWithWorker({ code, onLine });
  } catch (error) {
    onLine({
      kind: 'compile-error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
```

- [ ] **Step 4: Implement the execution worker**

Create `src/lib/solutionExecution.worker.ts`:

```ts
type RunMessage = {
  type: 'run';
  code: string;
};

function serializeError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack || `${error.name}: ${error.message}`;
  }

  return String(error);
}

function postConsole(method: 'log' | 'warn' | 'error', values: unknown[]): void {
  self.postMessage({
    type: 'console',
    method,
    values,
  });
}

self.onmessage = (event: MessageEvent<RunMessage>) => {
  if (!event.data || event.data.type !== 'run') {
    return;
  }

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  console.log = (...values: unknown[]) => postConsole('log', values);
  console.warn = (...values: unknown[]) => postConsole('warn', values);
  console.error = (...values: unknown[]) => postConsole('error', values);

  try {
    new Function(event.data.code)();
  } catch (error) {
    self.postMessage({
      type: 'error',
      message: serializeError(error),
    });
  } finally {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    self.postMessage({ type: 'done' });
  }
};
```

- [ ] **Step 5: Run focused runner tests**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test -- src/lib/solutionRunner.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit runner and worker**

Run:

```bash
git add src/lib/solutionRunner.ts src/lib/solutionRunner.test.ts src/lib/solutionExecution.worker.ts
git commit -m "Add browser solution runner"
```

Expected: commit succeeds.

---

### Task 5: Add Editable Runner Component

**Files:**
- Create: `src/components/EditableSolutionRunner.tsx`
- Create: `src/components/EditableSolutionRunner.module.css`

- [ ] **Step 1: Create the editable runner component**

Create `src/components/EditableSolutionRunner.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react';
import { clearSolutionDraft, resolveSolutionSource, saveSolutionDraft } from '../lib/solutionDrafts';
import { runSolutionScript } from '../lib/solutionRunner';
import { terminalLineToText, type TerminalLine } from '../lib/terminalOutput';
import type { SolutionSource } from '../types';
import styles from './EditableSolutionRunner.module.css';

type EditableSolutionRunnerProps = {
  problemSlug: string;
  solution: SolutionSource;
};

function getBrowserStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function EditableSolutionRunner({ problemSlug, solution }: EditableSolutionRunnerProps) {
  const storage = getBrowserStorage();
  const resolvedSource = useMemo(
    () => resolveSolutionSource(storage, problemSlug, solution.id, solution.source),
    [problemSlug, solution.id, solution.source, storage],
  );
  const [source, setSource] = useState(resolvedSource.source);
  const [hasDraft, setHasDraft] = useState(resolvedSource.hasDraft);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSource(resolvedSource.source);
    setHasDraft(resolvedSource.hasDraft);
    setTerminalLines([]);
  }, [resolvedSource.source, resolvedSource.hasDraft]);

  function updateSource(nextSource: string): void {
    setSource(nextSource);
    setHasDraft(true);
    saveSolutionDraft(storage, problemSlug, solution.id, nextSource);
  }

  function resetDraft(): void {
    clearSolutionDraft(storage, problemSlug, solution.id);
    setSource(solution.source);
    setHasDraft(false);
    setTerminalLines([]);
  }

  async function runCurrentSource(): Promise<void> {
    setIsRunning(true);
    setTerminalLines([]);

    await runSolutionScript(source, (line) => {
      setTerminalLines((currentLines) => [...currentLines, line]);
    });

    setIsRunning(false);
  }

  return (
    <div className={styles.runner}>
      <div className={styles.toolbar}>
        <div className={styles.actions}>
          <button className={styles.runButton} type="button" onClick={runCurrentSource} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button className={styles.resetButton} type="button" onClick={resetDraft} disabled={!hasDraft || isRunning}>
            Reset draft
          </button>
        </div>
        <span className={styles.draftStatus}>{hasDraft ? 'Browser draft' : 'Repo source'}</span>
      </div>

      <label className={styles.editorLabel} htmlFor={`solution-editor-${problemSlug}-${solution.id}`}>
        <span className={styles.codeFileName}>{solution.id}.ts</span>
        <span className={styles.codeLanguage}>TypeScript</span>
      </label>
      <textarea
        id={`solution-editor-${problemSlug}-${solution.id}`}
        className={styles.editor}
        spellCheck={false}
        value={source}
        onChange={(event) => updateSource(event.currentTarget.value)}
      />

      <section className={styles.terminal} aria-label="Terminal output">
        <div className={styles.terminalToolbar}>Terminal</div>
        <pre className={styles.terminalOutput}>
          {terminalLines.map((line, index) => (
            <code key={`${line.kind}-${index}`}>{terminalLineToText(line)}</code>
          ))}
        </pre>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Create runner CSS**

Create `src/components/EditableSolutionRunner.module.css`:

```css
.runner {
  display: grid;
  background: #10140f;
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding: 8px 18px;
  border-bottom: 1px solid #273026;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.runButton,
.resetButton {
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid #41523e;
  border-radius: 6px;
  background: #e8eee1;
  color: #11160f;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
}

.resetButton {
  background: transparent;
  color: #d7dfcf;
}

.runButton:disabled,
.resetButton:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.draftStatus {
  color: #9fb1a0;
  font-size: 0.72rem;
  font-weight: 800;
}

.editorLabel {
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  padding: 8px 18px;
  border-bottom: 1px solid #273026;
  color: #8d998b;
  font-size: 0.72rem;
  font-weight: 700;
}

.codeFileName {
  margin-right: auto;
  color: #9ba79a;
}

.codeLanguage {
  color: #9db6c9;
}

.editor {
  width: 100%;
  min-height: 438px;
  resize: vertical;
  padding: 20px;
  border: 0;
  border-radius: 0;
  outline: none;
  background: #10140f;
  color: #f4f7ed;
  font: 0.92rem/1.7 var(--mono);
  scrollbar-color: #5c655c #10140f;
  white-space: pre;
}

.editor:focus {
  box-shadow: inset 0 0 0 2px rgba(157, 182, 201, 0.45);
}

.terminal {
  border-top: 1px solid #273026;
  background: #0c100c;
}

.terminalToolbar {
  padding: 8px 18px;
  border-bottom: 1px solid #273026;
  color: #9fb1a0;
  font-size: 0.72rem;
  font-weight: 800;
}

.terminalOutput {
  display: grid;
  min-height: 126px;
  max-height: 260px;
  overflow: auto;
  margin: 0;
  padding: 14px 18px;
  color: #f4f7ed;
  font: 0.88rem/1.6 var(--mono);
  scrollbar-color: #5c655c #0c100c;
}

.terminalOutput code {
  display: block;
  white-space: pre-wrap;
}

@media (max-width: 1180px) {
  .editor {
    min-height: 360px;
  }
}

@media (max-width: 560px) {
  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .actions {
    width: 100%;
  }

  .runButton,
  .resetButton {
    flex: 1;
  }

  .editor {
    min-height: 320px;
    padding: 14px;
  }
}
```

- [ ] **Step 3: Commit the component skeleton**

Run:

```bash
git add src/components/EditableSolutionRunner.tsx src/components/EditableSolutionRunner.module.css
git commit -m "Add editable solution runner component"
```

Expected: commit succeeds.

---

### Task 6: Integrate Runner Into Solution Viewer

**Files:**
- Modify: `src/components/SolutionViewer.tsx`
- Modify: `src/components/SolutionViewer.module.css`
- Modify: `src/components/ProblemDetail.tsx`
- Modify: `src/components/SolutionViewer.test.ts`

- [ ] **Step 1: Update `SolutionViewer` rendering test first**

Replace `src/components/SolutionViewer.test.ts` with:

```ts
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SolutionViewer } from './SolutionViewer';

describe('SolutionViewer', () => {
  it('renders runner controls, terminal, and AI Overview in the accepted order', () => {
    const markup = renderToStaticMarkup(
      createElement(SolutionViewer, {
        problemSlug: 'demo',
        solutions: [
          {
            id: 'iterative',
            name: 'Iterative',
            summary: 'Builds the answer with a loop.',
            source: 'export function iterative(): void {}',
            overviewMarkdown: '### Approach\nWalk the input once.',
          },
        ],
        selectedSolutionId: 'iterative',
        onSolutionSelect: () => {},
      }),
    );

    expect(markup).toContain('Run');
    expect(markup).toContain('Reset draft');
    expect(markup).toContain('Terminal');
    expect(markup).toContain('AI Overview');
    expect(markup.indexOf('Run')).toBeLessThan(markup.indexOf('iterative.ts'));
    expect(markup.indexOf('iterative.ts')).toBeLessThan(markup.indexOf('Terminal'));
    expect(markup.indexOf('Terminal')).toBeLessThan(markup.indexOf('AI Overview'));
  });

  it('renders an AI Overview section only for solutions with overview markdown', () => {
    const withOverview = renderToStaticMarkup(
      createElement(SolutionViewer, {
        problemSlug: 'demo',
        solutions: [
          {
            id: 'iterative',
            name: 'Iterative',
            summary: 'Builds the answer with a loop.',
            source: 'export function iterative(): void {}',
            overviewMarkdown: '### Approach\nWalk the input once.',
          },
          {
            id: 'recursive',
            name: 'Recursive',
            summary: 'Builds the answer with recursion.',
            source: 'export function recursive(): void {}',
          },
        ],
        selectedSolutionId: 'iterative',
        onSolutionSelect: () => {},
      }),
    );

    const withoutOverview = renderToStaticMarkup(
      createElement(SolutionViewer, {
        problemSlug: 'demo',
        solutions: [
          {
            id: 'iterative',
            name: 'Iterative',
            summary: 'Builds the answer with a loop.',
            source: 'export function iterative(): void {}',
            overviewMarkdown: '### Approach\nWalk the input once.',
          },
          {
            id: 'recursive',
            name: 'Recursive',
            summary: 'Builds the answer with recursion.',
            source: 'export function recursive(): void {}',
          },
        ],
        selectedSolutionId: 'recursive',
        onSolutionSelect: () => {},
      }),
    );

    expect(withOverview).toContain('AI Overview');
    expect(withOverview).toContain('<h3>Approach</h3>');
    expect(withOverview.indexOf('Terminal')).toBeLessThan(withOverview.indexOf('AI Overview'));
    expect(withoutOverview).not.toContain('AI Overview');
    expect(withoutOverview).not.toContain('<h3>Approach</h3>');
  });
});
```

- [ ] **Step 2: Run the updated component test and verify it fails on missing `problemSlug` support**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test -- src/components/SolutionViewer.test.ts
```

Expected: FAIL because `SolutionViewer` does not accept `problemSlug` and does not render runner controls.

- [ ] **Step 3: Integrate `EditableSolutionRunner` in `SolutionViewer`**

Replace `src/components/SolutionViewer.tsx` with:

```tsx
import { renderMarkdown } from '../lib/markdown';
import type { SolutionSource } from '../types';
import { EditableSolutionRunner } from './EditableSolutionRunner';
import { Tabs } from './ui/Tabs';
import styles from './SolutionViewer.module.css';

type SolutionViewerProps = {
  problemSlug: string;
  solutions: SolutionSource[];
  selectedSolutionId: string;
  onSolutionSelect: (solutionId: string) => void;
};

export function SolutionViewer({
  problemSlug,
  solutions,
  selectedSolutionId,
  onSolutionSelect,
}: SolutionViewerProps) {
  const selectedSolution =
    solutions.find((solution) => solution.id === selectedSolutionId) ?? solutions[0];

  return (
    <section className={styles.panel} aria-label="Solutions">
      <Tabs
        items={solutions.map((solution) => ({ id: solution.id, label: solution.name }))}
        selectedId={selectedSolution?.id}
        onSelect={onSolutionSelect}
        ariaLabel="Solution options"
      />

      {selectedSolution ? (
        <>
          <div className={styles.brief}>
            <p className={styles.summary}>{selectedSolution.summary}</p>
          </div>
          <EditableSolutionRunner problemSlug={problemSlug} solution={selectedSolution} />
          {selectedSolution.overviewMarkdown && (
            <section className={styles.overview} aria-label="AI overview">
              <h2 className={styles.overviewTitle}>AI Overview</h2>
              <div className={styles.overviewMarkdown}>
                {renderMarkdown(selectedSolution.overviewMarkdown, {
                  codeClassName: styles.markdownCode,
                })}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className={styles.emptyState}>No solution source found.</p>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Pass `problem.slug` from `ProblemDetail`**

In `src/components/ProblemDetail.tsx`, update the `SolutionViewer` call:

```tsx
        <SolutionViewer
          problemSlug={problem.slug}
          solutions={problem.solutionSources}
          selectedSolutionId={selectedSolutionId}
          onSolutionSelect={onSolutionSelect}
        />
```

- [ ] **Step 5: Remove obsolete read-only code styles from `SolutionViewer.module.css`**

Delete these selectors and their declarations from `src/components/SolutionViewer.module.css`:

```css
.codeFrame { ... }
.codeToolbar { ... }
.codeFileName { ... }
.codeLanguage { ... }
.codeViewer { ... }
.codeViewer code { ... }
```

Keep `.panel`, `.brief`, `.summary`, `.overview`, `.overviewTitle`, `.overviewMarkdown`, `.markdownCode`, and `.emptyState`.

- [ ] **Step 6: Run focused component tests**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test -- src/components/SolutionViewer.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit the UI integration**

Run:

```bash
git add src/components/SolutionViewer.tsx src/components/SolutionViewer.module.css src/components/ProblemDetail.tsx src/components/SolutionViewer.test.ts
git commit -m "Integrate editable runner into solution viewer"
```

Expected: commit succeeds.

---

### Task 7: Verify Full App Behavior

**Files:**
- No planned source edits unless verification finds a defect.

- [ ] **Step 1: Run full tests**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm run build
```

Expected: TypeScript and Vite build pass.

- [ ] **Step 3: Start the local app for browser verification**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/leetcode/`.

- [ ] **Step 4: Verify manually in the browser**

Open the Vite URL and verify:

- the selected solution displays an editable code area,
- terminal output is below the editor,
- adding `console.log('hello')` and pressing `Run` prints only `hello`,
- a bare expression such as `1 + 1` prints nothing,
- `throw new Error('bad')` prints an error line,
- editing creates `Browser draft` status,
- switching away and back restores the draft,
- `Reset draft` restores the repo-loaded solution source and clears terminal output.

- [ ] **Step 5: Stop the dev server**

Stop the running Vite command with `Ctrl-C`.

- [ ] **Step 6: Commit verification fixes only if needed**

If verification required code fixes, run:

```bash
git add <changed-files>
git commit -m "Fix browser solution runner verification issues"
```

Expected: only actual verification fixes are committed. If no fixes were needed, make no commit.
