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
  let slow: ListNode | null = list;
  let fast: ListNode | null = list;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast?.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}
