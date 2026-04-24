import { describe, expect, it } from 'vitest';
import meta from './meta';
import { TreeNode } from './solutions/recursive';
import { solutions } from './solutions';

const cases = [
  {
    name: 'matches the sample subtree',
    root: new TreeNode(
      3,
      new TreeNode(4, new TreeNode(1), new TreeNode(2)),
      new TreeNode(5),
    ),
    subRoot: new TreeNode(4, new TreeNode(1), new TreeNode(2)),
    expected: true,
  },
  {
    name: 'rejects a candidate with an extra descendant',
    root: new TreeNode(
      3,
      new TreeNode(4, new TreeNode(1), new TreeNode(2, new TreeNode(0))),
      new TreeNode(5),
    ),
    subRoot: new TreeNode(4, new TreeNode(1), new TreeNode(2)),
    expected: false,
  },
  {
    name: 'treats the whole tree as its own subtree',
    root: new TreeNode(1),
    subRoot: new TreeNode(1),
    expected: true,
  },
  {
    name: 'matches a leaf subtree',
    root: new TreeNode(1, new TreeNode(2), new TreeNode(3)),
    subRoot: new TreeNode(3),
    expected: true,
  },
  {
    name: 'rejects matching values with different structure',
    root: new TreeNode(1, new TreeNode(1)),
    subRoot: new TreeNode(1, null, new TreeNode(1)),
    expected: false,
  },
  {
    name: 'matches a deeper subtree with descendants',
    root: new TreeNode(
      3,
      new TreeNode(4, new TreeNode(1, new TreeNode(0)), new TreeNode(2)),
      new TreeNode(5),
    ),
    subRoot: new TreeNode(4, new TreeNode(1, new TreeNode(0)), new TreeNode(2)),
    expected: true,
  },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    for (const testCase of cases) {
      it(`${solution.name} ${testCase.name}`, () => {
        const implementation = solutions[solution.id];
        expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

        expect(implementation(testCase.root, testCase.subRoot)).toBe(testCase.expected);
      });
    }
  }
});
