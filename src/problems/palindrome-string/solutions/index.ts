import { isPalindrome as twoPointer } from './two-pointer';

export type PalindromeStringSolution = (str: string) => boolean;

export const solutions: Record<string, PalindromeStringSolution> = {
  'two-pointer': twoPointer,
};
