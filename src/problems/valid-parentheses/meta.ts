import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Valid Parentheses',
  slug: 'valid-parentheses',
  difficulty: 'Easy',
  tags: ['String', 'Stack'],
  leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
  solutions: [
    {
      id: 'stack',
      name: 'Stack',
      summary: 'Tracks opening brackets and matches each closing bracket against the latest opener.',
    },
  ],
};

export default meta;
