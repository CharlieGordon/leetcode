# CSS Design System Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor CSS tokens, standardize repeated visual values, and remove unused Prism code while keeping the current LeetCode catalog UI recognizably the same.

**Architecture:** Keep CSS Modules as the ownership boundary and keep `src/index.css` as the single source for cross-component design tokens. Replace repeated literals with semantic CSS custom properties in small passes, and keep component-specific values local when globalizing them would force visual drift.

**Tech Stack:** React 19, Vite 7, TypeScript, CSS Modules, CodeMirror, Lezer highlighting, Vitest.

---

## File Structure

- Modify: `src/index.css`
  - Owns global resets, root design tokens, reduced-motion behavior, and global code/syntax token values.
- Modify: `src/components/EditableSolutionRunner.tsx`
  - Owns CodeMirror theme constants and editor highlight style. Keep CodeMirror active; remove no runner behavior.
- Modify: `src/components/EditableSolutionRunner.module.css`
  - Uses code, terminal, spacing, focus, and runner control tokens.
- Modify: `src/components/ProblemDescription.module.css`
  - Uses shared markdown panel and code-block tokens.
- Modify: `src/components/SolutionViewer.module.css`
  - Uses shared overview, markdown, and code-block tokens.
- Modify: `src/components/ui/IconButton.module.css`
  - Uses runner-control tokens because icon buttons currently live in the dark runner toolbar.
- Modify: `src/components/ui/Button.module.css`
  - Uses shared focus, motion, shadow, and surface tokens for existing button variants.
- Modify: `src/components/ui/Input.module.css`
  - Uses shared focus, motion, shadow, and surface tokens.
- Modify: `src/components/ui/Tabs.module.css`
  - Uses shared surface gradient tokens.
- Modify: `src/components/ui/Tag.module.css`
  - Uses shared spacing, surface, topic accent, and difficulty tokens.
- Modify: `src/components/ui/TagList.module.css`
  - Uses shared spacing tokens.
- Modify: `src/components/AppLogo.module.css`
  - Uses shared shadow token.
- Modify: `src/components/App.module.css`
  - Uses shared app background tokens only where values already match global concepts.
- Modify: `src/components/ProblemSidebar.module.css`
  - Uses shared spacing, surface, shadow, focus, and interaction tokens where low risk.
- Delete: `src/lib/highlight.tsx`
  - Dead Prism helper.
- Modify: `src/vite-env.d.ts`
  - Remove Prism module declarations.
- Modify: `package.json`
  - Remove `prismjs` and `@types/prismjs`.
- Modify: `package-lock.json`
  - Remove Prism lock entries via `npm uninstall`.

---

### Task 1: Capture Baseline And Add Token Groups

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Confirm current worktree state**

Run:

```bash
git status --short
```

Expected: only planned work should be present. If unrelated user changes exist, leave them untouched and account for them before committing.

- [ ] **Step 2: Start the local app for visual baseline**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/leetcode/` or the next free port. Keep this server running for browser screenshots.

- [ ] **Step 3: Capture baseline views**

Open the local URL in the in-app browser and capture or inspect:

```text
Desktop: problem detail view with sidebar expanded
Desktop: selected solution with runner terminal closed
Desktop: selected solution with terminal open
Mobile: 390px wide problem detail view
```

Expected: screenshots or visual observations are available before CSS edits, with special attention to runner controls.

- [ ] **Step 4: Replace the current root token block with organized groups**

In `src/index.css`, keep the existing `@property --sidebar-width` block and replace only the `:root` custom-property section with:

```css
:root {
  /* Base palette */
  --color-paper-50: #fffffb;
  --color-paper-100: #fbfcf5;
  --color-paper-200: #f4f8f1;
  --color-paper-300: #e8f0e7;
  --color-ink-900: #141610;
  --color-ink-700: #343a31;
  --color-ink-500: #626c61;
  --color-ink-300: #9aa397;
  --color-rule-200: #ced9cf;
  --color-accent-green: #0b7457;
  --color-accent-red: #c84634;
  --color-accent-red-quiet: rgba(200, 70, 52, 0.13);
  --color-accent-blue: #2d66a5;
  --color-accent-amber: #c98516;

  /* Semantic surfaces and text */
  --paper: var(--color-paper-200);
  --paper-warm: var(--color-paper-100);
  --paper-quiet: var(--color-paper-300);
  --surface: var(--color-paper-50);
  --surface-translucent: rgba(255, 255, 251, 0.72);
  --surface-raised: rgba(255, 255, 251, 0.78);
  --surface-subtle: rgba(255, 255, 251, 0.58);
  --ink: var(--color-ink-900);
  --ink-soft: var(--color-ink-700);
  --muted: var(--color-ink-500);
  --muted-light: var(--color-ink-300);

  /* Borders, focus, and shadows */
  --rule: var(--color-rule-200);
  --rule-strong: var(--color-ink-900);
  --focus-ring: rgba(11, 116, 87, 0.24);
  --focus-ring-code: rgba(159, 214, 255, 0.18);
  --shadow-hard: 7px 7px 0 rgba(20, 22, 16, 0.12);
  --shadow-interactive: 3px 3px 0 rgba(20, 22, 16, 0.12);
  --shadow-interactive-strong: 3px 3px 0 var(--ink);
  --shadow-logo: 4px 4px 0 rgba(20, 22, 16, 0.09);
  --shadow-sidebar: 8px 0 24px rgba(20, 22, 16, 0.045);

  /* Accents and states */
  --accent: var(--color-accent-green);
  --accent-soft: #d8eee4;
  --accent-hot: var(--color-accent-red);
  --accent-hot-soft: #f4d2ca;
  --accent-hot-quiet: var(--color-accent-red-quiet);
  --accent-blue: var(--color-accent-blue);
  --accent-amber: var(--color-accent-amber);
  --easy: var(--color-accent-green);
  --medium: #a96b0c;
  --hard: #be463b;

  /* Code, editor, and terminal */
  --code-bg: #10140f;
  --code-bg-deep: #070b08;
  --code-bg-panel: #0f140f;
  --code-bg-toolbar: #111810;
  --code-bg-control: #0b100b;
  --code-border: #242a22;
  --code-border-soft: #293128;
  --code-border-muted: #334333;
  --code-text: #f4f7ed;
  --code-text-soft: #eef3e8;
  --code-muted: #9fb1a0;
  --code-muted-soft: #8d998b;
  --code-scrollbar: #5c655c;
  --code-selection: rgba(159, 214, 255, 0.24);
  --syntax-comment: #7f8b7c;
  --syntax-string: #a7d79b;
  --syntax-number: #f0c46f;
  --syntax-keyword: #9fd6ff;
  --syntax-function: #f2e58f;
  --syntax-punctuation: #dfe7da;

  /* Spacing */
  --space-1: 4px;
  --space-2: 6px;
  --space-3: 8px;
  --space-4: 10px;
  --space-5: 12px;
  --space-6: 14px;
  --space-7: 16px;
  --space-8: 18px;
  --space-9: 20px;
  --space-10: 22px;
  --space-11: 24px;
  --space-12: 28px;
  --space-13: 30px;
  --space-14: 32px;

  /* Shape and motion */
  --radius: 6px;
  --radius-control: 7px;
  --radius-pill: 999px;
  --motion-fast: 140ms ease;
  --sidebar-expanded-width: 348px;
  --sidebar-collapsed-width: 86px;
  --sidebar-width: var(--sidebar-expanded-width);
  --sidebar-motion-duration: 520ms;
  --sidebar-motion-short: 170ms;
  --sidebar-motion-ease: cubic-bezier(0.19, 1, 0.22, 1);

  /* Fonts */
  --serif:
    "Charter", "Bitstream Charter", "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  --mono:
    "JetBrains Mono", "Fira Code", "SFMono-Regular", Consolas, "Liberation Mono", monospace;

  color: var(--ink);
  background: var(--paper);
  font-family:
    "Avenir Next", "Gill Sans", "Trebuchet MS", Verdana, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 5: Run build after token insertion**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm run build
```

Expected: `tsc -b && vite build` completes successfully.

- [ ] **Step 6: Commit token groups**

Run:

```bash
git add src/index.css
git commit -m "Organize CSS design tokens"
```

Expected: a focused commit containing only `src/index.css`.

---

### Task 2: Standardize Code, Markdown, Editor, And Terminal Surfaces

**Files:**
- Modify: `src/components/ProblemDescription.module.css`
- Modify: `src/components/SolutionViewer.module.css`
- Modify: `src/components/EditableSolutionRunner.module.css`
- Modify: `src/components/EditableSolutionRunner.tsx`
- Modify: `src/components/ui/IconButton.module.css`

- [ ] **Step 1: Replace markdown code-block literals**

In both `src/components/ProblemDescription.module.css` and `src/components/SolutionViewer.module.css`, update `.markdownCode` and `.markdownCode::before` to use shared code tokens:

```css
.markdownCode {
  position: relative;
  overflow: auto;
  margin: 20px 0;
  padding: 38px 16px 16px;
  border: 1px solid var(--code-border);
  border-radius: var(--radius);
  background: var(--code-bg);
  color: var(--code-text);
  line-height: 1.7;
  scrollbar-color: var(--code-scrollbar) var(--code-bg);
}

.markdownCode::before {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 7px 12px;
  border-bottom: 1px solid var(--code-border-soft);
  color: var(--code-muted);
  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
  content: attr(data-language);
}
```

For `SolutionViewer.module.css`, keep its existing `margin: 16px 0` if changing it would alter overview density.

- [ ] **Step 2: Replace runner CSS code palette literals**

In `src/components/EditableSolutionRunner.module.css`, replace matching dark literals with these token equivalents:

```text
#10140f -> var(--code-bg)
#0f140f -> var(--code-bg-panel)
#111810 -> var(--code-bg-toolbar)
#0b100b -> var(--code-bg-control)
#070b08 -> var(--code-bg-deep)
#242a22 -> var(--code-border)
#293128 -> var(--code-border-soft)
#334333 -> var(--code-border-muted)
#f4f7ed -> var(--code-text)
#eef3e8 -> var(--code-text-soft)
#9fb1a0 -> var(--code-muted)
#8d998b -> var(--code-muted-soft)
#5c655c -> var(--code-scrollbar)
#f0c46f -> var(--syntax-number)
```

Do not replace values that are intentionally distinct until they are visually checked, such as `#52624f`, `#dce8d5`, `#1b2519`, and `#c8d3c0`.

- [ ] **Step 3: Add CodeMirror theme constants**

In `src/components/EditableSolutionRunner.tsx`, add this object above `codeEditorTheme`:

```ts
const editorColors = {
  background: '#10140f',
  text: '#eef3e8',
  selection: 'rgba(159, 214, 255, 0.24)',
  keyword: '#9fd6ff',
  function: '#f2e58f',
  number: '#f0c46f',
  punctuation: '#dfe7da',
  string: '#a7d79b',
  comment: '#7f8b7c',
} as const;
```

Then replace hard-coded CodeMirror theme and `HighlightStyle.define` colors with `editorColors.*`. Example:

```ts
const codeEditorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: editorColors.background,
      color: editorColors.text,
    },
    '.cm-content': {
      caretColor: editorColors.text,
    },
    '.cm-cursor': {
      borderLeftColor: editorColors.text,
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: editorColors.selection,
    },
  },
  { dark: true },
);
```

Expected: CodeMirror behavior remains unchanged while literals are centralized.

- [ ] **Step 4: Tokenize dark icon button styling**

In `src/components/ui/IconButton.module.css`, replace the runner-control colors with code tokens where values match:

```css
.iconButton {
  border-radius: var(--radius-control);
  color: #d9e5d3;
  transition:
    background var(--motion-fast),
    border-color var(--motion-fast),
    box-shadow var(--motion-fast),
    color var(--motion-fast),
    opacity var(--motion-fast),
    transform var(--motion-fast);
}

.iconButton:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 3px var(--focus-ring-code);
}
```

Keep `#d9e5d3`, `#60725c`, `#182317`, and `#f7fbf1` local unless they are promoted after visual review.

- [ ] **Step 5: Run focused tests and build**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test -- SolutionViewer
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm run build
```

Expected: `SolutionViewer` tests pass and build succeeds.

- [ ] **Step 6: Browser-check runner surfaces**

Inspect the local app:

```text
Desktop runner terminal closed
Desktop runner terminal open
AI overview markdown code block, if present
Problem description markdown code block, if present
```

Expected: these areas look consistent but not redesigned. Runner controls must not look like a new control system.

- [ ] **Step 7: Commit code-surface standardization**

Run:

```bash
git add src/components/ProblemDescription.module.css src/components/SolutionViewer.module.css src/components/EditableSolutionRunner.module.css src/components/EditableSolutionRunner.tsx src/components/ui/IconButton.module.css
git commit -m "Standardize code surface styling"
```

Expected: a focused commit containing code, editor, markdown, terminal, and icon-button styling only.

---

### Task 3: Standardize Shared UI Interaction Tokens

**Files:**
- Modify: `src/components/ui/Button.module.css`
- Modify: `src/components/ui/Input.module.css`
- Modify: `src/components/ui/Tabs.module.css`
- Modify: `src/components/ui/Tag.module.css`
- Modify: `src/components/ui/TagList.module.css`
- Modify: `src/components/AppLogo.module.css`

- [ ] **Step 1: Replace repeated motion values in shared controls**

In `src/components/ui/Button.module.css`, replace repeated `140ms ease` transition parts with `var(--motion-fast)`:

```css
transition:
  background var(--motion-fast),
  box-shadow var(--motion-fast),
  color var(--motion-fast),
  min-height var(--sidebar-motion-duration) var(--sidebar-motion-ease),
  padding var(--sidebar-motion-duration) var(--sidebar-motion-ease),
  transform var(--motion-fast),
  width var(--sidebar-motion-duration) var(--sidebar-motion-ease);
```

Also update `.tab` and `.external` transitions to use `var(--motion-fast)` for each property.

- [ ] **Step 2: Replace repeated interactive shadows in buttons and inputs**

In `Button.module.css` and `Input.module.css`, replace repeated hard-coded shadows:

```css
box-shadow: var(--shadow-interactive-strong);
```

for current `3px 3px 0 var(--ink)` cases, and:

```css
box-shadow: var(--shadow-interactive);
```

for current `3px 3px 0 rgba(20, 22, 16, 0.12)` cases.

- [ ] **Step 3: Tokenize shared surfaces**

Use these replacements where values already match:

```text
rgba(255, 255, 251, 0.72) -> var(--surface-translucent)
rgba(255, 255, 251, 0.78) -> var(--surface-raised)
rgba(255, 255, 251, 0.58) -> var(--surface-subtle)
linear-gradient(180deg, #fffffb, #f1f6ef) -> linear-gradient(180deg, var(--surface), color-mix(in srgb, var(--paper) 82%, var(--surface)))
```

Apply this to `Input.module.css`, `Tabs.module.css`, `Tag.module.css`, and `AppLogo.module.css` only where the result preserves the current look.

- [ ] **Step 4: Tokenize shared spacing in tags and tag list**

In `src/components/ui/Tag.module.css`, use:

```css
.tag {
  min-height: 26px;
  padding: 3px var(--space-3);
}
```

In `src/components/ui/TagList.module.css`, use:

```css
.tagList {
  gap: var(--space-3);
}
```

Keep tiny visual details such as `3px`, `26px`, and divider size local when they are part of the component's exact shape.

- [ ] **Step 5: Run focused tests and build**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test -- SolutionViewer
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm run build
```

Expected: tests pass and build succeeds.

- [ ] **Step 6: Browser-check shared controls**

Inspect:

```text
Sidebar toggle button hover/focus
Solution tabs
Search input
Tags and LeetCode link row
Runner icon buttons
```

Expected: interactions feel consistent with the previous UI and no control becomes visually louder than before.

- [ ] **Step 7: Commit shared UI token replacements**

Run:

```bash
git add src/components/ui/Button.module.css src/components/ui/Input.module.css src/components/ui/Tabs.module.css src/components/ui/Tag.module.css src/components/ui/TagList.module.css src/components/AppLogo.module.css
git commit -m "Standardize shared UI styling tokens"
```

Expected: a focused commit containing shared UI styling only.

---

### Task 4: Apply Low-Risk Tokens To App Shell And Sidebar

**Files:**
- Modify: `src/App.module.css`
- Modify: `src/components/ProblemSidebar.module.css`
- Modify: `src/components/ProblemDetail.module.css`
- Modify: `src/components/ProblemDescription.module.css`
- Modify: `src/components/SolutionViewer.module.css`
- Modify: `src/components/AppLogo.module.css`

- [ ] **Step 1: Tokenize app and sidebar shadows**

In `src/components/ProblemSidebar.module.css`, replace:

```css
box-shadow: 8px 0 24px rgba(20, 22, 16, 0.045);
```

with:

```css
box-shadow: var(--shadow-sidebar);
```

In `src/components/AppLogo.module.css`, replace:

```css
box-shadow: 4px 4px 0 rgba(20, 22, 16, 0.09);
```

with:

```css
box-shadow: var(--shadow-logo);
```

- [ ] **Step 2: Tokenize low-risk sidebar spacing**

In `ProblemSidebar.module.css`, use spacing tokens for repeated structural values:

```text
gap: 16px -> gap: var(--space-7)
gap: 14px -> gap: var(--space-6)
gap: 12px -> gap: var(--space-5)
gap: 8px -> gap: var(--space-3)
gap: 6px -> gap: var(--space-2)
padding: 24px 18px 18px -> padding: var(--space-11) var(--space-8) var(--space-8)
padding: 18px 14px -> padding: var(--space-8) var(--space-6)
```

Do not alter collapse dimensions, transform distances, list item minimum heights, or mobile max heights.

- [ ] **Step 3: Tokenize panel surface alpha values**

In `ProblemDescription.module.css`, `SolutionViewer.module.css`, `ProblemDetail.module.css`, and `ProblemSidebar.module.css`, replace exact matches:

```text
rgba(255, 255, 251, 0.78) -> var(--surface-raised)
rgba(255, 255, 251, 0.72) -> var(--surface-translucent)
rgba(255, 255, 251, 0.58) -> var(--surface-subtle)
```

Keep component-specific values such as `rgba(255, 255, 251, 0.9)` and `rgba(244, 248, 241, 0.92)` local because they define the sidebar wash.

- [ ] **Step 4: Run full tests and build**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm run build
```

Expected: all Vitest tests pass and build succeeds.

- [ ] **Step 5: Browser-check layout drift**

Inspect:

```text
Desktop sidebar expanded
Desktop sidebar collapsed
Desktop problem detail header and content grid
Mobile sidebar and problem detail
```

Expected: layout, collapse behavior, and hierarchy match the baseline.

- [ ] **Step 6: Commit shell/sidebar token replacements**

Run:

```bash
git add src/App.module.css src/components/ProblemSidebar.module.css src/components/ProblemDetail.module.css src/components/ProblemDescription.module.css src/components/SolutionViewer.module.css src/components/AppLogo.module.css
git commit -m "Apply layout surface styling tokens"
```

Expected: a focused commit for low-risk app-shell and panel tokenization.

---

### Task 5: Remove Unused Prism Path

**Files:**
- Delete: `src/lib/highlight.tsx`
- Modify: `src/vite-env.d.ts`
- Modify: `src/index.css`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Verify Prism helper is still unused**

Run:

```bash
rg -n "highlightTypeScript|prismjs|token\\." src package.json package-lock.json
```

Expected before cleanup: matches in `src/lib/highlight.tsx`, `src/vite-env.d.ts`, `src/index.css`, `package.json`, and `package-lock.json`; no imports of `highlightTypeScript` outside `src/lib/highlight.tsx`.

- [ ] **Step 2: Delete dead helper**

Remove:

```text
src/lib/highlight.tsx
```

Expected: no source file imports it.

- [ ] **Step 3: Remove Prism declarations**

In `src/vite-env.d.ts`, delete only the Prism declaration block:

```ts
declare module 'prismjs/components/prism-core' {
  import Prism from 'prismjs';

  export default Prism;
}

declare module 'prismjs/components/prism-clike';
declare module 'prismjs/components/prism-javascript';
declare module 'prismjs/components/prism-typescript';
```

Keep the Vite reference at the top of the file.

- [ ] **Step 4: Remove global Prism token CSS**

In `src/index.css`, delete the entire `.token.*` rules:

```css
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #899384;
}

.token.string,
.token.char,
.token.attr-value,
.token.regex {
  color: #b8e2c7;
}

.token.number,
.token.boolean {
  color: #efc37d;
}

.token.keyword,
.token.operator {
  color: #a9d9ff;
  font-weight: 700;
}

.token.function,
.token.class-name {
  color: #f0e29b;
}

.token.punctuation {
  color: #d9ded1;
}
```

Expected: markdown code blocks remain plain text and CodeMirror keeps its own active highlighting.

- [ ] **Step 5: Uninstall Prism dependencies**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm uninstall prismjs @types/prismjs
```

Expected: `package.json` and `package-lock.json` no longer list `prismjs` or `@types/prismjs`.

- [ ] **Step 6: Verify no Prism references remain**

Run:

```bash
rg -n "highlightTypeScript|prismjs|token\\." src package.json package-lock.json
```

Expected: no output, except unrelated words if a future file adds them during another task. Any remaining current Prism reference must be removed or explained.

- [ ] **Step 7: Run full tests and build**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm run build
```

Expected: all tests pass and build succeeds.

- [ ] **Step 8: Commit Prism cleanup**

Run:

```bash
git add src/lib/highlight.tsx src/vite-env.d.ts src/index.css package.json package-lock.json
git commit -m "Remove unused Prism preview code"
```

Expected: a focused commit deleting the dead Prism path.

---

### Task 6: Final Visual Verification And Cleanup

**Files:**
- Modify only files already touched by Tasks 1-5 if verification reveals small visual drift.

- [ ] **Step 1: Run final automated verification**

Run:

```bash
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm test
PATH=/Users/admin/.nvm/versions/node/v24.13.0/bin:$PATH npm run build
```

Expected: all tests pass and build succeeds.

- [ ] **Step 2: Final browser verification**

Inspect these states against the Task 1 baseline:

```text
Desktop problem detail view with sidebar expanded
Desktop problem detail view with sidebar collapsed
Desktop solution runner with terminal closed
Desktop solution runner with terminal open
AI overview with markdown content
Mobile 390px problem detail and sidebar
```

Expected:

```text
The app still reads as the same LeetCode catalog.
No major layout shift is visible.
Runner controls retain their existing feel.
Code/terminal/markdown surfaces feel more consistent.
No text overlaps or escapes its container.
```

- [ ] **Step 3: Inspect final diff**

Run:

```bash
git diff --stat
git diff -- src/index.css src/components src/lib src/vite-env.d.ts package.json package-lock.json
```

Expected: diff is limited to CSS tokenization, CodeMirror color constants, and Prism cleanup.

- [ ] **Step 4: Commit final polish adjustments**

If Step 2 required small fixes, run:

```bash
git add src/index.css src/components src/lib src/vite-env.d.ts package.json package-lock.json
git commit -m "Polish CSS token consistency"
```

Expected when fixes were made: only final adjustment files are included. Expected when no fixes were made: skip this commit step and continue to Step 5.

- [ ] **Step 5: Report completion**

Summarize:

```text
Changed token architecture.
Standardized code/editor/terminal styling.
Standardized shared UI interaction tokens.
Removed Prism dependency path.
Verification commands and browser states checked.
Any intentional tiny visual changes.
```
