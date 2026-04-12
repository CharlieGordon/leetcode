import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Contains Duplicate',
  slug: 'contains-duplicate',
  difficulty: 'Easy',
  tags: ['Array', 'Hash Table', 'Sorting'],
  leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
  solutions: [
    {
      id: 'brute-force',
      name: 'Brute Force',
      summary: 'Compares every pair until it finds equal values.',
    },
    {
      id: 'sorting',
      name: 'Sorting',
      summary: 'Sorts the values so duplicates become adjacent.',
    },
    {
      id: 'hash-set',
      name: 'Hash Set',
      summary: 'Tracks seen values and returns as soon as a duplicate appears.',
    },
  ],
};

export default meta;
