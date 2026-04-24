import { isSameTree as recursive } from './recursive';
import type { TreeNode } from './recursive';

export type SameTreeSolution = (p: TreeNode | null, q: TreeNode | null) => boolean;

export const solutions: Record<string, SameTreeSolution> = {
  'recursive': recursive,
};
