import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { n: 0, expected: 0 },
  { n: 1, expected: 1 },
  { n: 2, expected: 1 },
  { n: 3, expected: 2 },
  { n: 4, expected: 3 },
  { n: 10, expected: 55 },
  { n: 30, expected: 832040 },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} returns the nth Fibonacci number across shared cases`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation(testCase.n)).toBe(testCase.expected);
      }
    });
  }
});
