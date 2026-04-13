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

const normalizedCases = [
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
  { input: 'Racecar', expected: true },
  { input: 'eve', expected: true },
  { input: 'radar', expected: true },
  { input: 'nurses run', expected: true },
  { input: 'A man, a plan, a canal: Panama', expected: true },
  { input: 'race a car', expected: false },
  { input: '0P', expected: false },
];

const casesBySolution = {
  'normalized-two-pointer': normalizedCases,
};

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} validates every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      const solutionCases = casesBySolution[solution.id as keyof typeof casesBySolution] ?? cases;

      for (const testCase of solutionCases) {
        expect(implementation(testCase.input), `${testCase.input} should be ${testCase.expected}`).toBe(
          testCase.expected,
        );
      }
    });
  }
});
