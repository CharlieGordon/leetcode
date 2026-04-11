import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { nums: [2, 7, 11, 15], target: 9, expectedValues: [2, 7] },
  { nums: [3, 2, 4], target: 6, expectedValues: [2, 4] },
  { nums: [3, 3], target: 6, expectedValues: [3, 3] },
  { nums: [-1, -2, -3, -4, -5], target: -8, expectedValues: [-3, -5] },
];

function valuesAt(nums: number[], indices: number[]): number[] {
  return indices.map((index) => nums[index]).sort((a, b) => a - b);
}

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} returns valid indices for every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        const result = implementation([...testCase.nums], testCase.target);

        expect(result).toHaveLength(2);
        expect(new Set(result).size).toBe(2);
        expect(result.every((index) => index >= 0 && index < testCase.nums.length)).toBe(true);
        expect(valuesAt(testCase.nums, result)).toEqual([...testCase.expectedValues].sort((a, b) => a - b));
      }
    });
  }
});
