import { describe, expect, it } from 'vitest';
import meta from './meta';
import { TreeNode } from './solutions/recursive';
import { solutions } from './solutions';

const cases = [
  {
    name: 'matches identical sample trees',
    p: new TreeNode(1, new TreeNode(2), new TreeNode(3)),
    q: new TreeNode(1, new TreeNode(2), new TreeNode(3)),
    expected: true,
  },
  {
    name: 'rejects trees with the same values but different structure',
    p: new TreeNode(1, new TreeNode(2)),
    q: new TreeNode(1, null, new TreeNode(2)),
    expected: false,
  },
  {
    name: 'rejects trees with mirrored child values',
    p: new TreeNode(1, new TreeNode(2), new TreeNode(1)),
    q: new TreeNode(1, new TreeNode(1), new TreeNode(2)),
    expected: false,
  },
  {
    name: 'matches two empty trees',
    p: null,
    q: null,
    expected: true,
  },
  {
    name: 'rejects one empty tree',
    p: null,
    q: new TreeNode(0),
    expected: false,
  },
  {
    name: 'matches identical deeper trees with negative values',
    p: new TreeNode(
      5,
      new TreeNode(-3, new TreeNode(-10), new TreeNode(0)),
      new TreeNode(8, null, new TreeNode(9)),
    ),
    q: new TreeNode(
      5,
      new TreeNode(-3, new TreeNode(-10), new TreeNode(0)),
      new TreeNode(8, null, new TreeNode(9)),
    ),
    expected: true,
  },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    for (const testCase of cases) {
      it(`${solution.name} ${testCase.name}`, () => {
        const implementation = solutions[solution.id];
        expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

        expect(implementation(testCase.p, testCase.q)).toBe(testCase.expected);
      });
    }
  }
});
