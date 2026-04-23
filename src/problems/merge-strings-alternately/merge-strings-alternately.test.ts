import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { word1: 'abc', word2: 'pqr', expected: 'apbqcr' },
  { word1: 'ab', word2: 'pqrs', expected: 'apbqrs' },
  { word1: 'abcd', word2: 'pq', expected: 'apbqcd' },
  { word1: 'a', word2: 'z', expected: 'az' },
  { word1: 'x', word2: 'yz', expected: 'xyz' },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} handles every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation(testCase.word1, testCase.word2)).toBe(testCase.expected);
      }
    });
  }
});
