import { isValid as todo } from './todo';

export type ValidParenthesesSolution = (s: string) => boolean;

export const solutions: Record<string, ValidParenthesesSolution> = {
  todo,
};
