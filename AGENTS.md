# Project Guide For Agents

This is a browsable LeetCode solution catalog built with React, Vite, TypeScript,
and Vitest. Keep changes focused on adding or improving problems, solutions,
tests, and the catalog UI.

## Problem Structure

Each problem should live under `src/problems/<slug>/` and include:

- `meta.ts` with the problem title, slug, difficulty, tags, LeetCode URL, and
  solution metadata.
- `problem.md` with the displayable problem description.
- `<slug>.test.ts` with Vitest coverage for every registered solution.
- `solutions/*.ts` for individual solution implementations.
- `solutions/index.ts` exporting the executable solution registry used by tests.

Keep the folder name, `meta.slug`, solution IDs, and solution filenames aligned.
The catalog loader reads files by convention, and the catalog diagnostics expect
metadata to match the filesystem.

## Verification

Run these checks after changes:

- `npm test`
- `npm run build`

Documentation-only changes do not need new automated tests, but the existing
catalog and build checks should still pass.
