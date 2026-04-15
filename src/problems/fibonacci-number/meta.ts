import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Fibonacci Number',
  slug: 'fibonacci-number',
  difficulty: 'Easy',
  tags: ['Math', 'Dynamic', 'Recursion'],
  leetcodeUrl: 'https://leetcode.com/problems/fibonacci-number/',
  solutions: [
    {
      id: 'iterative',
      name: 'Iterative',
      summary: 'Builds the sequence from the base cases until it reaches n.',
    },
    {
      id: 'recursive',
      name: 'Recursive',
      summary: 'Uses the recurrence relation directly until it reaches a base case.',
    },
  ],
};

export default meta;
