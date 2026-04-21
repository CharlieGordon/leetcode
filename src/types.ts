export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type SolutionMeta = {
  id: string;
  name: string;
  summary: string;
};

export type ProblemMeta = {
  title: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
  leetcodeUrl?: string;
  solutions: SolutionMeta[];
};

export type SolutionSource = SolutionMeta & {
  source: string;
  overviewMarkdown?: string;
};

export type ProblemCatalogItem = ProblemMeta & {
  description: string;
  solutionSources: SolutionSource[];
};
