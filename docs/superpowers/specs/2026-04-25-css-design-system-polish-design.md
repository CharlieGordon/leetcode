# CSS Design System Polish Design

## Overview

Refactor and polish the app's CSS so repeated values become intentional design tokens, shared visual patterns stay consistent, and obsolete styling/dependencies are removed. This is a gentle consistency pass, not a redesign. The app should still look like the same LeetCode catalog: same sidebar, same problem detail structure, same paper-like editorial surface, same dark code runner, and same overall visual identity.

## Goals

- Organize global CSS custom properties into clear token groups.
- Move repeated colors, spacing, shadows, borders, radii, focus treatments, and motion values into reusable tokens where they represent shared concepts.
- Standardize the code, markdown code-block, editor, and terminal palettes.
- Align common interaction states across shared controls without changing component behavior.
- Keep CSS Modules as the component styling boundary.
- Remove PrismJS because the current editable CodeMirror runner replaced the old read-only Prism preview path and no active code imports `highlightTypeScript`.
- Preserve the existing layout, information hierarchy, and app personality.

## Non-Goals

- Do not introduce a new visual theme.
- Do not redesign the sidebar, problem detail page, runner, tabs, or catalog layout.
- Do not add new visible UI copy.
- Do not add a utility-class framework.
- Do not split every local value into a token when the value is only meaningful inside one component.
- Do not replace CSS Modules with another styling system.

## Current CSS Shape

The app already uses CSS Modules for component-local styling. `src/index.css` owns global resets, root tokens, motion preferences, and leftover Prism token rules. Shared primitives live under `src/components/ui`, with larger component modules for the app shell, sidebar, problem detail, problem description, solution viewer, and editable runner.

The biggest maintainability issues are:

- repeated dark code-surface colors across `ProblemDescription`, `SolutionViewer`, `EditableSolutionRunner`, `IconButton`, and CodeMirror theme setup,
- repeated paper/surface alpha colors and hard shadows,
- scattered spacing values such as `6px`, `8px`, `12px`, `14px`, `18px`, `24px`, and `30px`,
- duplicated interaction timing and focus-ring treatments,
- `.token.*` Prism CSS and `src/lib/highlight.tsx` still present even though the current solution view uses CodeMirror highlighting.

## Token Architecture

Keep `src/index.css` as the single source for cross-component tokens. Organize `:root` into these groups:

- base palette: raw brand-neutral colors only when needed by semantic tokens,
- surface and text tokens: page, panel, quiet paper, text, muted text,
- border and focus tokens: weak rule, strong rule, focus ring,
- accent and difficulty tokens: primary accent, warm accent, blue accent, easy, medium, hard,
- code and terminal tokens: background, elevated background, border, text, muted text, selection, scrollbar, syntax colors,
- layout tokens: sidebar widths,
- spacing tokens: small scale for recurring gaps and padding,
- radius and shadow tokens,
- motion tokens: fast interaction timing and sidebar motion timing,
- font tokens.

Use semantic names for shared concepts. For example, prefer `--code-bg`, `--code-text`, and `--control-focus-ring` over names tied to one component. Keep component-specific variables local if they only exist to support that component's internals.

## Component Styling

Apply tokens conservatively:

- `ProblemDescription.module.css` and `SolutionViewer.module.css` should share markdown code-block colors and label treatment.
- `EditableSolutionRunner.module.css` and the CodeMirror theme in `EditableSolutionRunner.tsx` should use the same code/terminal palette. If CodeMirror cannot directly consume CSS custom properties in a reliable way, keep a small typed constants object near the theme and mirror the token names.
- `IconButton.module.css` should use code/runner control tokens because it is currently used in the dark runner toolbar.
- `Button.module.css`, `Input.module.css`, `Tag.module.css`, and `Tabs.module.css` should use shared interaction, focus, surface, and spacing tokens where the values are already repeated.
- `ProblemSidebar.module.css` can keep its component-specific collapse animation/layout values, but repeated shadows, focus rings, and surface colors should use shared tokens.

This pass should not move component rules between modules unless the move clearly reduces duplication without changing ownership.

## Prism Cleanup

Prism is no longer part of the active rendering path. The implementation should remove the dead Prism path:

- delete `src/lib/highlight.tsx`,
- remove Prism component module declarations from `src/vite-env.d.ts`,
- remove `.token.*` Prism rules from `src/index.css`,
- remove `prismjs` and `@types/prismjs` from package manifests.

CodeMirror and `@lezer/highlight` should remain because the editable runner actively uses them.

## Visual Constraints

Allowed visual changes are small consistency improvements:

- slightly more consistent code block, editor, and terminal colors,
- more consistent hover, active, disabled, and focus treatments,
- more consistent spacing where neighboring components currently use near-identical values,
- removal of obsolete Prism styling that no longer affects rendered UI.

Not allowed:

- changing the app shell layout,
- moving the terminal relative to the editor,
- changing the sidebar collapse behavior,
- changing typography scale in a way that shifts visual hierarchy,
- changing the app from its current light editorial style to a different theme,
- restyling the runner controls so they look like a new control system.

## Verification

Run automated checks after implementation:

```bash
npm test
npm run build
```

Use browser verification for visual safety:

- capture or inspect the main problem detail view at desktop width,
- inspect the editable runner with terminal closed and open,
- inspect a mobile-width layout,
- compare against the current UI for significant visual drift.

The verification target is "same app, cleaner and more consistent," not a visibly redesigned app.

## Rollout Plan

Implement in small passes:

1. Add and organize global tokens in `src/index.css`.
2. Replace repeated literals in code/terminal/markdown surfaces.
3. Replace repeated interaction, focus, shadow, and spacing values in shared UI modules.
4. Apply low-risk token replacements in larger component modules.
5. Remove unused Prism code, CSS, declarations, and dependencies.
6. Run tests, build, and browser checks.

If any token replacement causes unexpected visual drift, keep the original value local instead of forcing it into the global system.
