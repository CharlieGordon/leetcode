import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { input: '()', expected: true },
  { input: '()[]{}', expected: true },
  { input: '(]', expected: false },
  { input: '([])', expected: true },
  { input: '([)]', expected: false },
  { input: '{[]}', expected: true },
  { input: ']', expected: false },
  { input: '((', expected: false },
  { input: '(){}}{', expected: false },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} documents the empty solution placeholder for every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(
          () => implementation(testCase.input),
          `${testCase.input} should eventually return ${testCase.expected}`,
        ).toThrow('Not implemented');
      }
    });
  }
});
