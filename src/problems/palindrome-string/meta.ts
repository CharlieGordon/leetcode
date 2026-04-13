import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Palindrome String',
  slug: 'palindrome-string',
  difficulty: 'Easy',
  tags: ['String', 'Two Pointers'],
  leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
  solutions: [
    {
      id: 'two-pointer',
      name: 'Two Pointer',
      summary: 'Compares matching characters from the beginning and end of the string.',
    },
    {
      id: 'normalized-two-pointer',
      name: 'Normalized Two Pointer',
      summary: 'Normalizes casing and punctuation before comparing characters from both ends.',
    },
  ],
};

export default meta;
