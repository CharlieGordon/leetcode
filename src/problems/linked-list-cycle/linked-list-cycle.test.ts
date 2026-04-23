import { describe, expect, it } from 'vitest';
import meta from './meta';
import { solutions } from './solutions';

class TestListNode {
  constructor(
    public val: number,
    public next: TestListNode | null = null,
  ) {}
}

function createLinkedList(values: number[], pos: number): TestListNode | null {
  if (values.length === 0) {
    return null;
  }

  const nodes = values.map((value) => new TestListNode(value));

  for (let index = 0; index < nodes.length - 1; index += 1) {
    nodes[index].next = nodes[index + 1];
  }

  if (pos >= 0) {
    nodes.at(-1)!.next = nodes[pos];
  }

  return nodes[0];
}

const cases = [
  {
    values: [3, 2, 0, -4],
    pos: 1,
    expected: true,
  },
  {
    values: [1, 2],
    pos: 0,
    expected: true,
  },
  {
    values: [1],
    pos: -1,
    expected: false,
  },
  {
    values: [],
    pos: -1,
    expected: false,
  },
  {
    values: [1, 2, 3, 4],
    pos: -1,
    expected: false,
  },
  {
    values: [7, 7],
    pos: -1,
    expected: false,
  },
  {
    values: [-21, 10, 17, 8, 4, 26, 5, 35, 33, -7, -16, 27, -12, 6, 29, -12, 5, 9, 20, 14, 14, 2, 13, -24, 21, 23, -21, 5],
    pos: -1,
    expected: false,
  },
  {
    values: [1, 2, 3],
    pos: 2,
    expected: true,
  },
  {
    values: [5, 1, 5, 1],
    pos: 1,
    expected: true,
  },
];

describe(meta.title, () => {
  for (const solution of meta.solutions) {
    it(`${solution.name} detects cycles across shared cases`, () => {
      const implementation = solutions[solution.id];
      expect(implementation, `${solution.id} is missing from the executable registry`).toBeDefined();

      for (const testCase of cases) {
        expect(implementation(createLinkedList(testCase.values, testCase.pos))).toBe(testCase.expected);
      }
    });
  }
});
