import { commonFactors as empty } from './empty';

export type NumberOfCommonFactorsSolution = (a: number, b: number) => number;

export const solutions: Record<string, NumberOfCommonFactorsSolution> = {
  empty,
};
