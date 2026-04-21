import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Number of Common Factors',
  slug: 'number-of-common-factors',
  difficulty: 'Easy',
  tags: ['Math', 'Enumeration', 'Number Theory'],
  leetcodeUrl: 'https://leetcode.com/problems/number-of-common-factors/',
  solutions: [
    {
      id: 'iterative',
      name: 'Iterative',
      summary: 'Checks every candidate from the larger input down to 1 and counts shared divisors.',
    },
  ],
};

export default meta;
