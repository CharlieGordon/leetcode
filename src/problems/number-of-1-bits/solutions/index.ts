import { hammingWeight as stringCount } from './string-count';

export type NumberOf1BitsSolution = (n: number) => number;

export const solutions: Record<string, NumberOf1BitsSolution> = {
  'string-count': stringCount,
};
