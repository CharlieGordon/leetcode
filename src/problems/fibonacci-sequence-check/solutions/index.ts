import { isFib } from './iterative';

export type FibonacciSequenceCheckSolution = (n: number) => boolean;

export const solutions: Record<string, FibonacciSequenceCheckSolution> = {
  iterative: isFib,
};
