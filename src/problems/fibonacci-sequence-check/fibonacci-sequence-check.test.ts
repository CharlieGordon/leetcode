import { describe, expect, it } from 'vitest';
import meta from './meta';
import { type FibonacciSequenceCheckSolution, solutions } from './solutions';

const cases = [
  { n: 0, expected: true },
  { n: 1, expected: true },
  { n: 2, expected: true },
  { n: 3, expected: true },
  { n: 5, expected: true },
  { n: 8, expected: true },
  { n: 13, expected: true },
  { n: 21, expected: true },
  { n: 4, expected: false },
  { n: 6, expected: false },
  { n: 10, expected: false },
  { n: 14, expected: false },
  { n: 22, expected: false },
  { n: -1, expected: false },
  { n: 1.5, expected: false },
  { n: Number.NaN, expected: false },
  { n: Number.POSITIVE_INFINITY, expected: false },
  { n: Number.NEGATIVE_INFINITY, expected: false },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} identifies Fibonacci sequence membership`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation(testCase.n), `isFib(${testCase.n})`).toBe(testCase.expected);
      }
    });
  }
});
