import { factorial as iterative } from './iterative';
import { factorial as recursive } from './recursive';

export type FactorialSolution = (n: number) => number;

export const solutions: Record<string, FactorialSolution> = {
  iterative,
  recursive,
};
