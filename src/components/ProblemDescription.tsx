import { renderMarkdown } from '../lib/markdown';

type ProblemDescriptionProps = {
  description: string;
};

export function ProblemDescription({ description }: ProblemDescriptionProps) {
  return <article className="description-panel">{renderMarkdown(description)}</article>;
}
