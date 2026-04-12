import { recursiveAdd } from './recursive-add';

export type RecursiveAddSolution = typeof recursiveAdd;

export const solutions: Record<string, RecursiveAddSolution> = {
  'recursive-add': recursiveAdd,
};
