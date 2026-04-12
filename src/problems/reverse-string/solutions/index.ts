import { reverseString as twoPointer } from './two-pointer';

export type ReverseStringSolution = (s: string[]) => void;

export const solutions: Record<string, ReverseStringSolution> = {
  'two-pointer': twoPointer,
};
