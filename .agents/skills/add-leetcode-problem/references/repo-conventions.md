# Repo Conventions

## Required structure

Each problem lives under `src/problems/<slug>/`:

```text
src/problems/<slug>/
  meta.ts
  problem.md
  <slug>.test.ts
  solutions/
    index.ts
    <solution-id>.ts
```

`<slug>`, `meta.slug`, `<slug>.test.ts`, solution IDs, solution filenames, and `solutions/index.ts` keys must stay aligned.

## Metadata

```ts
import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Two Sum',
  slug: 'two-sum',
  difficulty: 'Easy',
  tags: ['Array', 'Hash Table'],
  leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
  solutions: [
    {
      id: 'hash-map',
      name: 'Hash Map',
      summary: 'Stores visited numbers by value to find each complement in one pass.',
    },
  ],
};

export default meta;
```

## Solution registry

Each implementation file should export the same function name. Import with aliases in the registry:

```ts
import { twoSum as hashMap } from './hash-map';

export type TwoSumSolution = (nums: number[], target: number) => number[];

export const solutions: Record<string, TwoSumSolution> = {
  'hash-map': hashMap,
};
```

## Tests

Use shared cases for every registered solution:

```ts
import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { nums: [2, 7, 11, 15], target: 9, expectedValues: [2, 7] },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} handles every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation([...testCase.nums], testCase.target)).toEqual(testCase.expectedValues);
      }
    });
  }
});
```

For in-place mutation problems, copy inputs before invoking the solution and assert the mutated copy. For results where order does not matter, normalize before comparing.
If a problem is intentionally scaffolded with an empty solution, keep the unit tests focused on the real problem outputs from the prompt. Do not replace behavior assertions with `toThrow('Not implemented')` or similar placeholder-only checks unless the user explicitly asks for that contract.
