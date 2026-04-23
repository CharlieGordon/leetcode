import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Merge Strings Alternately',
  slug: 'merge-strings-alternately',
  difficulty: 'Easy',
  tags: ['String', 'Two Pointers'],
  leetcodeUrl: 'https://leetcode.com/problems/merge-strings-alternately/',
  solutions: [
    {
      id: 'iterative',
      name: 'Iterative',
      summary: 'Walks both words by index up to the longer length and appends any available character from each word in turn.',
    },
  ],
};

export default meta;
