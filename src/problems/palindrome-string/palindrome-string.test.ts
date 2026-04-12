import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { input: '', expected: true },
  { input: 'a', expected: true },
  { input: 'aa', expected: true },
  { input: 'ab', expected: false },
  { input: 'racecar', expected: true },
  { input: 'level', expected: true },
  { input: 'hello', expected: false },
  { input: 'abba', expected: true },
  { input: 'abcba', expected: true },
  { input: 'abca', expected: false },
  { input: 'Racecar', expected: false },
  { input: 'eve', expected: true },
  { input: 'radar', expected: true },
  { input: 'nurses run', expected: false },
  { input: 'nursesrun', expected: true },
  { input: 'a b a', expected: true },
  { input: 'a,b,a', expected: true },
  { input: '\u{1f642}\u{1f643}\u{1f642}', expected: true },
  { input: '\u{1f642}\u{1f643}\u{1f604}', expected: false },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} validates every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation(testCase.input), `${testCase.input} should be ${testCase.expected}`).toBe(
          testCase.expected,
        );
      }
    });
  }
});
