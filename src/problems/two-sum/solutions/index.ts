import { twoSum as bruteForce } from './brute-force';
import { twoSum as hashMap } from './hash-map';

export type TwoSumSolution = (nums: number[], target: number) => number[];

export const solutions: Record<string, TwoSumSolution> = {
  'brute-force': bruteForce,
  'hash-map': hashMap,
};
