---
name: add-leetcode-problem
description: Add new problems to this React/Vite/TypeScript LeetCode solution catalog from pasted problem details. Use when Codex needs to scaffold or complete problem entries with meta.ts, problem.md, Vitest coverage, solution implementations, and a solutions registry that matches this repository's catalog conventions.
---

# Add LeetCode Problem

## Workflow

Use this skill when adding a new problem from pasted details: title, statement, examples, constraints, difficulty, tags, optional LeetCode URL, and intended solution approaches.

1. Inspect the repository first: read `AGENTS.md`, `src/types.ts`, `src/lib/catalog.ts`, and one similar existing problem under `src/problems/`.
2. Normalize the problem slug to lowercase hyphen-case. Verify `src/problems/<slug>/` does not already exist unless the user explicitly asks to update it.
3. Use `scripts/scaffold_problem.py` when creating a new problem folder. It creates the required file layout and keeps solution IDs, filenames, metadata, and registry keys aligned.
4. Replace all generated TODO placeholders before final verification: write the real problem statement, implementations, and meaningful tests.
5. Run `npm test` and `npm run build` after code changes.

Read `references/repo-conventions.md` when you need examples of this catalog's expected `meta.ts`, `solutions/index.ts`, and Vitest patterns.

## Scaffolding

From the repository root, preview the generated files with `--dry-run`:

```bash
python3 .agents/skills/add-leetcode-problem/scripts/scaffold_problem.py \
  --root . \
  --title "Contains Duplicate" \
  --difficulty Easy \
  --tags "Array, Hash Table, Sorting" \
  --leetcode-url "https://leetcode.com/problems/contains-duplicate/" \
  --solution "brute-force|Brute Force|Compares every pair until it finds equal values." \
  --solution "hash-set|Hash Set|Tracks seen values and returns as soon as a duplicate appears." \
  --solution-type "(nums: number[]) => boolean" \
  --function-name containsDuplicate \
  --dry-run
```

Then rerun without `--dry-run` to write files. The script refuses to overwrite an existing problem folder unless `--force` is passed.

After scaffolding:

- Fill `problem.md` from the pasted problem statement. Keep the first heading exactly `# <Title>` so catalog tests can verify the description.
- Fill each `solutions/*.ts` file with an exported function named by `--function-name`.
- Replace placeholder test cases with shared cases that every registered solution must pass.
- If the user asks for an empty or placeholder solution, still write normal behavior tests from the problem statement. Do not write unit tests that assert `Not implemented`, `toThrow`, or other stub-only behavior unless the user explicitly asks for that contract.
- Keep tests iterating over `meta.solutions`, looking up `solutions[solution.id]`, and asserting the implementation exists with a message that names the missing ID.

## Catalog Rules

- Keep `src/problems/<slug>/`, `meta.slug`, `<slug>.test.ts`, solution metadata IDs, solution filenames, and `solutions/index.ts` keys aligned.
- Use the existing `ProblemMeta` fields only: `title`, `slug`, `difficulty`, `tags`, optional `leetcodeUrl`, and `solutions`.
- Do not add unrelated catalog features while adding a problem.
- Include all registered solutions in the executable registry. Catalog diagnostics only knows a solution exists when `meta.solutions[].id` has a matching `solutions/<id>.ts` file.
- Prefer focused tests with edge cases from the prompt: empty/minimal inputs when allowed, duplicates or negatives when relevant, boundary sizes if practical, and mutation behavior for in-place problems.
- Never mock unit tests by asserting placeholder implementation details when the real contract is known. Tests should verify the problem behavior, even if an empty solution currently fails them.
