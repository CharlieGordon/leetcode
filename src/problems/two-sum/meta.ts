import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Two Sum',
  slug: 'two-sum',
  difficulty: 'Easy',
  tags: ['Array', 'Hash Table'],
  leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
  solutions: [
    {
      id: 'brute-force',
      name: 'Brute Force',
      summary: 'Checks every pair until the target sum is found.',
    },
    {
      id: 'hash-map',
      name: 'Hash Map',
      summary: 'Stores visited numbers by value to find each complement in one pass.',
    },
  ],
};

export default meta;
