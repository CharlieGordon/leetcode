import { AppLogo } from './AppLogo';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Title } from './ui/Title';
import { classNames } from '../lib/classNames';
import type { Difficulty, ProblemCatalogItem } from '../types';
import styles from './ProblemSidebar.module.css';

type ProblemSidebarProps = {
  problems: ProblemCatalogItem[];
  totalProblemCount: number;
  query: string;
  selectedSlug?: string;
  isCollapsed: boolean;
  onQueryChange: (query: string) => void;
  onProblemSelect: (slug: string) => void;
  onToggleCollapsed: () => void;
};

const difficultyClassByDifficulty: Record<Difficulty, string> = {
  Easy: styles.difficultyEasy,
  Medium: styles.difficultyMedium,
  Hard: styles.difficultyHard,
};

export function ProblemSidebar({
  problems,
  totalProblemCount,
  query,
  selectedSlug,
  isCollapsed,
  onQueryChange,
  onProblemSelect,
  onToggleCollapsed,
}: ProblemSidebarProps) {
  const browserPanelId = 'problem-browser-panel';
  const toggleLabel = isCollapsed ? 'Open problem browser' : 'Collapse problem browser';

  return (
    <aside className={classNames(styles.sidebar, isCollapsed && styles.collapsed)} aria-label="Problem browser">
      <div className={styles.topline}>
        <div className={styles.brandBlock}>
          <AppLogo className={styles.logo} />
          <div className={styles.brandCopy}>
            <p className={styles.eyebrow}>Practice Library</p>
            <Title as="h1" variant="brand">LeetCode</Title>
          </div>
        </div>

        <Button
          variant="sidebarToggle"
          iconOnly
          className={styles.toggle}
          aria-controls={browserPanelId}
          aria-expanded={!isCollapsed}
          aria-label={toggleLabel}
          onClick={onToggleCollapsed}
        >
          <svg
            className={styles.toggleIcon}
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path className={styles.toggleGrip} d="M8 7.5v9" />
            <path className={styles.toggleGrip} d="M11 7.5v9" />
            <path className={styles.toggleArrow} d="M16 8.5 12.5 12 16 15.5" />
          </svg>
        </Button>
      </div>

      <div
        id={browserPanelId}
        className={styles.browser}
        aria-hidden={isCollapsed}
      >
        <div className={styles.browserInner}>
          <Input
            id="problem-search"
            label="Search problems"
            containerClassName={styles.search}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search title, tag, difficulty"
            tabIndex={isCollapsed ? -1 : undefined}
          />

          <div className={styles.problemCount}>
            {problems.length} of {totalProblemCount} problems
          </div>

          <nav className={styles.list} aria-label="Problems">
            {problems.map((problem) => (
              <button
                key={problem.slug}
                className={classNames(
                  styles.listItem,
                  difficultyClassByDifficulty[problem.difficulty],
                  problem.slug === selectedSlug && styles.active,
                )}
                type="button"
                tabIndex={isCollapsed ? -1 : undefined}
                onClick={() => onProblemSelect(problem.slug)}
              >
                <span className={styles.problemTitle}>{problem.title}</span>
                <span className={styles.problemMeta} aria-label={`${problem.difficulty}, ${problem.tags.join(', ')}`}>
                  <span className={styles.difficultyDot} aria-hidden="true" />
                  <span>{problem.difficulty}</span>
                  <span aria-hidden="true">/</span>
                  <span>{problem.tags.join(', ')}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
