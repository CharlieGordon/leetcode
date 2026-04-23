import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Linked List Cycle',
  slug: 'linked-list-cycle',
  difficulty: 'Easy',
  tags: ['Hash Table', 'Linked List', 'Two Pointers'],
  leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
  solutions: [
    {
      id: 'hash-set',
      name: 'Hash Set',
      summary: 'Tracks visited nodes and returns true when the same node is seen again.',
    },
    {
      id: 'fast-slow-pointers',
      name: 'Fast and Slow Pointers',
      summary: 'Moves two pointers at different speeds and detects a cycle when they meet.',
    },
  ],
};

export default meta;
