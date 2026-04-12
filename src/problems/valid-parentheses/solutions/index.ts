import { isValid as stack } from './stack';

export type ValidParenthesesSolution = (s: string) => boolean;

export const solutions: Record<string, ValidParenthesesSolution> = {
  stack,
};
