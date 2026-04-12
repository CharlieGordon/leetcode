import { missingNumber as sorting } from './sorting';

export type MissingNumberSolution = (nums: number[]) => number;

export const solutions: Record<string, MissingNumberSolution> = {
  sorting,
};
