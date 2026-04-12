import { missingNumber as todo } from './todo';

export type MissingNumberSolution = (nums: number[]) => number;

export const solutions: Record<string, MissingNumberSolution> = {
  todo,
};
