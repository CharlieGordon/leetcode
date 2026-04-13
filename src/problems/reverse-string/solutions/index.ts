import { reverseString as twoPointer1 } from './two-pointer-2';
import { reverseString as twoPointer2 } from './two-pointer-1';

export type ReverseStringSolution = (s: string[]) => void;

export const solutions: Record<string, ReverseStringSolution> = {
  'two-pointer-1': twoPointer1,
  'two-pointer-2': twoPointer2,
};
