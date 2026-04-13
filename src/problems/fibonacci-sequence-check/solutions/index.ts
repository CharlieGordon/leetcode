import { isFib } from './empty';

export type FibonacciSequenceCheckSolution = (n: number) => boolean;

export const solutions: Record<string, FibonacciSequenceCheckSolution> = {
  empty: isFib,
};
