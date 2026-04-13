import { isPalindrome as twoPointer } from './two-pointer';
import { isPalindrome as normalizedTwoPointer } from './normalized-two-pointer';

export type PalindromeStringSolution = (str: string) => boolean;

export const solutions: Record<string, PalindromeStringSolution> = {
  'two-pointer': twoPointer,
  'normalized-two-pointer': normalizedTwoPointer,
};
