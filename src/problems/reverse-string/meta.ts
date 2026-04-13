import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Reverse String',
  slug: 'reverse-string',
  difficulty: 'Easy',
  tags: ['String', 'Two Pointers'],
  leetcodeUrl: 'https://leetcode.com/problems/reverse-string/',
  solutions: [
    {
      id: 'two-pointer-1',
      name: 'Two Pointer 1',
      summary: 'Stores one side in a temporary variable while swapping each mirrored pair.',
    },
    {
      id: 'two-pointer-2',
      name: 'Two Pointer 2',
      summary: 'Swaps matching characters from the outside inward until the array is reversed.',
    },
  ],
};

export default meta;
