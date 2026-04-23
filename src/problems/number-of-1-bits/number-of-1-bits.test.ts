import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { n: 11, expected: 3 },
  { n: 128, expected: 1 },
  { n: 2147483645, expected: 30 },
  { n: 0, expected: 0 },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} handles every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation(testCase.n)).toBe(testCase.expected);
      }
    });
  }
});
