import type { ListNode } from './index';

/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

export function hasCycle(list: ListNode | null): boolean {
  let head = list;
  let behind: Set<ListNode> = new Set();

  while (head !== null) {
    if (behind.has(head)) {
      return true;
    }

    behind.add(head);

    head = head.next;
  }

  return false;
}
