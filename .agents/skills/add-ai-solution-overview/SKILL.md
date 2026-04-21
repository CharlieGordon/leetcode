---
name: add-ai-solution-overview
description: Create or refresh per-solution AI overview markdown files for this LeetCode catalog using the repo's sibling solutions/*.md convention.
---

# Add AI Solution Overview

Use this skill when the user wants an AI overview for one existing solution in this repository.

## Workflow

1. Inspect the repository context first: read `AGENTS.md`, `src/types.ts`, `src/lib/catalog.ts`, the target problem `meta.ts`, `problem.md`, and the target `solutions/<id>.ts`.
2. Confirm the target solution exists in both `meta.solutions` and `solutions/index.ts`.
3. Write or update the sibling markdown file at `src/problems/<slug>/solutions/<solution-id>.md`.
4. Keep the overview as section body content only. Do not start with `#` or repeat the problem title or solution name as a document heading.
5. If the markdown file already exists, ask before replacing it unless the user explicitly asked for a refresh or overwrite.
6. After changes, run `npm test` and `npm run build`.

Read `references/overview-template.md` for the expected structure and file convention.

## Content Rules

- Focus on the concrete implementation in `solutions/<id>.ts`, not a generic textbook explanation.
- Keep the overview concise and readable in the UI.
- Use plain markdown supported by the repo renderer: paragraphs, `###` headings, bullet lists, and fenced code blocks only when they materially help.
- Prefer this section order when it fits:
  `### Approach`, `### Complexity`, `### Tradeoffs`
- State time and space complexity only when they are clear from the implementation.
- Call out notable constraints or edge-case behavior if the solution depends on them.
- Do not invent claims that are not supported by the code or the problem statement.

## Guardrails

- Keep the file path aligned with the solution id exactly.
- Do not create overview files for missing or unregistered solutions.
- Do not add overview placeholders for every solution unless the user asked for that batch work.
- Do not change the TypeScript solution logic while writing the overview unless the user explicitly asks for code changes too.
