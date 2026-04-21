import { commonFactors as iterative } from './iterative';

export type NumberOfCommonFactorsSolution = (a: number, b: number) => number;

export const solutions: Record<string, NumberOfCommonFactorsSolution> = {
  iterative,
};
