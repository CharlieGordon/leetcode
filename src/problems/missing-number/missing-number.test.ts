import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} documents the empty solution placeholder`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      expect(() => implementation([3, 0, 1])).toThrow('Not implemented');
    });
  }
});
