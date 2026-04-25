export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

function isEqual(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if(!root && !subRoot) {
    return true
  }

  if(!root || !subRoot) {
    return false
  }

  return root.val === subRoot.val 
    && isEqual(root.left, subRoot.left) 
    && isEqual(root.right, subRoot.right)
}

export function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if(isEqual(root, subRoot)) {
    return true
  }

  if(!root) {
    return false
  }

  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot)
}
