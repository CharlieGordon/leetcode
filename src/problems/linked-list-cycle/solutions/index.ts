import { hasCycle as hashSet } from './hash-set';

export type ListNode = {
  val: number;
  next: ListNode | null;
};

export type LinkedListCycleSolution = (list: ListNode | null) => boolean;

export const solutions: Record<string, LinkedListCycleSolution> = {
  'hash-set': hashSet,
};
