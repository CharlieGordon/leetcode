import { hasCycle as hashSet } from './hash-set';
import { hasCycle as fastSlowPointers } from './fast-slow-pointers';

export type ListNode = {
  val: number;
  next: ListNode | null;
};

export type LinkedListCycleSolution = (list: ListNode | null) => boolean;

export const solutions: Record<string, LinkedListCycleSolution> = {
  'hash-set': hashSet,
  'fast-slow-pointers': fastSlowPointers,
};
