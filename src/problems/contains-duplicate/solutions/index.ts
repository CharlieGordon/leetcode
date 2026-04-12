import { containsDuplicate as bruteForce } from './brute-force';
import { containsDuplicate as hashSet } from './hash-set';
import { containsDuplicate as sorting } from './sorting';

export type ContainsDuplicateSolution = (nums: number[]) => boolean;

export const solutions: Record<string, ContainsDuplicateSolution> = {
  'brute-force': bruteForce,
  'hash-set': hashSet,
  sorting,
};
