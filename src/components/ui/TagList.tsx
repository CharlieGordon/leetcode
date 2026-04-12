import type { Difficulty } from '../../types';
import { Tag, type TagTone } from './Tag';
import styles from './TagList.module.css';

const difficultyToneByDifficulty: Record<Difficulty, TagTone> = {
  Easy: 'difficultyEasy',
  Medium: 'difficultyMedium',
  Hard: 'difficultyHard',
};

type TagListProps = {
  difficulty: Difficulty;
  tags: string[];
  'aria-label'?: string;
};

export function TagList({ difficulty, tags, 'aria-label': ariaLabel }: TagListProps) {
  return (
    <div className={styles.tagList} aria-label={ariaLabel}>
      <Tag tone={difficultyToneByDifficulty[difficulty]}>{difficulty}</Tag>
      <span className={styles.divider} aria-hidden="true" />
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </div>
  );
}
