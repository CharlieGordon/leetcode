import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { a: 12, b: 6, expected: 4, label: 'example 1' },
  { a: 25, b: 30, expected: 2, label: 'example 2' },
  { a: 1, b: 1, expected: 1, label: 'minimum bounds' },
  { a: 1000, b: 1000, expected: 16, label: 'equal upper bounds' },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} returns the number of common factors for every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation(testCase.a, testCase.b), testCase.label).toBe(testCase.expected);
      }
    });
  }
});
