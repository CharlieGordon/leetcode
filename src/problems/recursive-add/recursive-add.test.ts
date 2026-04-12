import { describe, expect, it } from 'vitest';
import meta from './meta';
import { type RecursiveAddSolution, solutions } from './solutions';

const cases = [
  {
    expression: 'recursiveAdd(5)()',
    // @ts-ignore
    run: (recursiveAdd: RecursiveAddSolution) => recursiveAdd(5)(),
    expected: 5,
  },
  {
    expression: 'recursiveAdd(1)(2)(4)()',
    // @ts-ignore
    run: (recursiveAdd: RecursiveAddSolution) => recursiveAdd(1)(2)(4)(),
    expected: 7,
  },
  {
    expression: 'recursiveAdd(0)(0)(0)()',
    // @ts-ignore
    run: (recursiveAdd: RecursiveAddSolution) => recursiveAdd(0)(0)(0)(),
    expected: 0,
  },
  {
    expression: 'recursiveAdd(-3)(10)(-2)()',
    // @ts-ignore
    run: (recursiveAdd: RecursiveAddSolution) => recursiveAdd(-3)(10)(-2)(),
    expected: 5,
  },
  {
    expression: 'recursiveAdd(100)(-50)(25)(-75)()',
    // @ts-ignore
    run: (recursiveAdd: RecursiveAddSolution) => recursiveAdd(100)(-50)(25)(-75)(),
    expected: 0,
  },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} returns the accumulated sum for every shared case`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(testCase.run(implementation), testCase.expression).toBe(testCase.expected);
      }
    });
  }
});
