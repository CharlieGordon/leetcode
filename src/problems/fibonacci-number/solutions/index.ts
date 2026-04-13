import { fib as iterative } from './iterative';
import { fib as recursive } from './recursive';

export type FibonacciNumberSolution = (n: number) => number;

export const solutions: Record<string, FibonacciNumberSolution> = {
  iterative,
  recursive,
};
