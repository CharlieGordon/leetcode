import type { ProblemMeta } from '../../types';

const meta: ProblemMeta = {
  title: 'Factorial',
  slug: 'factorial',
  difficulty: 'Easy',
  tags: ['Math', 'Recursion'],
  solutions: [
    {
      id: 'iterative',
      name: 'Iterative',
      summary: 'Multiplies values from n down to 2 using a running product.',
    },
    {
      id: 'recursive',
      name: 'Recursive',
      summary: 'Uses n multiplied by factorial(n - 1) until reaching the base case.',
    },
  ],
};

export default meta;
