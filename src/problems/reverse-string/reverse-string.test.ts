import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  { input: ['h', 'e', 'l', 'l', 'o'], expected: ['o', 'l', 'l', 'e', 'h'] },
  { input: ['H', 'a', 'n', 'n', 'a', 'h'], expected: ['h', 'a', 'n', 'n', 'a', 'H'] },
  { input: ['a'], expected: ['a'] },
  { input: ['a', 'b'], expected: ['b', 'a'] },
  { input: ['1', '2', '3', '4'], expected: ['4', '3', '2', '1'] },
  { input: [' ', 'x', '!'], expected: ['!', 'x', ' '] },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} reverses every shared case in place`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        const input = [...testCase.input];
        const sameReference = input;
        const result = implementation(input);

        expect(result).toBeUndefined();
        expect(input).toBe(sameReference);
        expect(input).toEqual(testCase.expected);
      }
    });
  }
});
