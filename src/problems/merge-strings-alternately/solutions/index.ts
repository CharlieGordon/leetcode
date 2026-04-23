import { mergeAlternately as iterative } from './iterative';

export type MergeStringsAlternatelySolution = (word1: string, word2: string) => string;

export const solutions: Record<string, MergeStringsAlternatelySolution> = {
  'iterative': iterative,
};
