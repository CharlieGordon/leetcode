import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { n: 0, expected: 1 },
  { n: 1, expected: 1 },
  { n: 2, expected: 2 },
  { n: 3, expected: 6 },
  { n: 5, expected: 120 },
  { n: 10, expected: 3628800 },
  { n: 12, expected: 479001600 },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} returns n factorial for every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation(testCase.n)).toBe(testCase.expected);
      }
    });
  }
});
