import { groupAnagrams as sorting } from './sorting';

export type GroupAnagramsSolution = (strs: string[]) => string[][];

export const solutions: Record<string, GroupAnagramsSolution> = {
  'sorting': sorting,
};
