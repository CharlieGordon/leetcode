import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

const cases = [
  {
    input: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'],
    expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']],
  },
  {
    input: [''],
    expected: [['']],
  },
  {
    input: ['a'],
    expected: [['a']],
  },
  {
    input: ['abc', 'bca', 'cab', 'foo', 'ofo', 'bar'],
    expected: [['abc', 'bca', 'cab'], ['foo', 'ofo'], ['bar']],
  },
  {
    input: ['ab', 'ba', 'ab'],
    expected: [['ab', 'ba', 'ab']],
  },
  {
    input: ['', '', 'b'],
    expected: [['', ''], ['b']],
  },
  {
    input: ['abc', 'def', 'ghi'],
    expected: [['abc'], ['def'], ['ghi']],
  },
  {
    input: ['listen', 'silent', 'enlist', 'google', 'gooegl', 'abc'],
    expected: [['listen', 'silent', 'enlist'], ['google', 'gooegl'], ['abc']],
  },
];

function normalizeGroups(groups: string[][]): string[][] {
  return groups
    .map((group) => [...group].sort())
    .sort((left, right) => left.join('\u0000').localeCompare(right.join('\u0000')));
}

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} handles every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(
          normalizeGroups(implementation([...testCase.input])),
          JSON.stringify(testCase.input),
        ).toEqual(normalizeGroups(testCase.expected));
      }
    });
  }
});
