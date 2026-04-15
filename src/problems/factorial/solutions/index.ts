import { factorial as iterative } from './iterative';

export type FactorialSolution = (n: number) => number;

export const solutions: Record<string, FactorialSolution> = {
  iterative,
};
