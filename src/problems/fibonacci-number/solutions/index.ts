import { fib as iterative } from './iterative';

export type FibonacciNumberSolution = (n: number) => number;

export const solutions: Record<string, FibonacciNumberSolution> = {
  iterative,
};
