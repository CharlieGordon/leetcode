import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { nums: [1, 2, 3, 1], expected: true },
  { nums: [1, 2, 3, 4], expected: false },
  { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2], expected: true },
  { nums: [0], expected: false },
  { nums: [-1, -2, -3, -1], expected: true },
  { nums: [-3, -2, -1, 0, 1, 2, 3], expected: false },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} detects duplicate values across shared cases`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation([...testCase.nums])).toBe(testCase.expected);
      }
    });
  }
});
