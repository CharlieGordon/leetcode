import { isSubtree as recursive } from './recursive';
import type { TreeNode } from './recursive';

export type SubtreeOfAnotherTreeSolution = (root: TreeNode | null, subRoot: TreeNode | null) => boolean;

export const solutions: Record<string, SubtreeOfAnotherTreeSolution> = {
  'recursive': recursive,
};
