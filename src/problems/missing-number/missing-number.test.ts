import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { nums: [3, 0, 1], expected: 2 },
  { nums: [0, 1], expected: 2 },
  { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1], expected: 8 },
  { nums: [1], expected: 0 },
  { nums: [0], expected: 1 },
  { nums: [1, 2], expected: 0 },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} returns the missing value across shared cases`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation([...testCase.nums])).toBe(testCase.expected);
      }
    });
  }
});
