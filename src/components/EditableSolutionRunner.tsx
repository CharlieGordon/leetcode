import { useEffect, useMemo, useState } from 'react';
import { clearSolutionDraft, resolveSolutionSource, saveSolutionDraft } from '../lib/solutionDrafts';
import { runSolutionScript } from '../lib/solutionRunner';
import { terminalLineToText, type TerminalLine } from '../lib/terminalOutput';
import type { SolutionSource } from '../types';
import styles from './EditableSolutionRunner.module.css';

type EditableSolutionRunnerProps = {
  problemSlug: string;
  solution: SolutionSource;
};

function getBrowserStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function EditableSolutionRunner({ problemSlug, solution }: EditableSolutionRunnerProps) {
  const storage = getBrowserStorage();
  const resolvedSource = useMemo(
    () => resolveSolutionSource(storage, problemSlug, solution.id, solution.source),
    [problemSlug, solution.id, solution.source, storage],
  );
  const [source, setSource] = useState(resolvedSource.source);
  const [hasDraft, setHasDraft] = useState(resolvedSource.hasDraft);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSource(resolvedSource.source);
    setHasDraft(resolvedSource.hasDraft);
    setTerminalLines([]);
  }, [resolvedSource.source, resolvedSource.hasDraft]);

  function updateSource(nextSource: string): void {
    setSource(nextSource);
    setHasDraft(true);
    saveSolutionDraft(storage, problemSlug, solution.id, nextSource);
  }

  function resetDraft(): void {
    clearSolutionDraft(storage, problemSlug, solution.id);
    setSource(solution.source);
    setHasDraft(false);
    setTerminalLines([]);
  }

  async function runCurrentSource(): Promise<void> {
    setIsRunning(true);
    setTerminalLines([]);

    try {
      await runSolutionScript(source, (line) => {
        setTerminalLines((currentLines) => [...currentLines, line]);
      });
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div className={styles.runner}>
      <div className={styles.toolbar}>
        <div className={styles.actions}>
          <button className={styles.runButton} type="button" onClick={runCurrentSource} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button className={styles.resetButton} type="button" onClick={resetDraft} disabled={!hasDraft || isRunning}>
            Reset draft
          </button>
        </div>
        <span className={styles.draftStatus}>{hasDraft ? 'Browser draft' : 'Repo source'}</span>
      </div>

      <label className={styles.editorLabel} htmlFor={`solution-editor-${problemSlug}-${solution.id}`}>
        <span className={styles.codeFileName}>{solution.id}.ts</span>
        <span className={styles.codeLanguage}>TypeScript</span>
      </label>
      <textarea
        id={`solution-editor-${problemSlug}-${solution.id}`}
        className={styles.editor}
        spellCheck={false}
        value={source}
        onChange={(event) => updateSource(event.currentTarget.value)}
      />

      <section className={styles.terminal} aria-label="Terminal output">
        <div className={styles.terminalToolbar}>Terminal</div>
        <pre className={styles.terminalOutput}>
          {terminalLines.map((line, index) => (
            <code key={`${line.kind}-${index}`}>{terminalLineToText(line)}</code>
          ))}
        </pre>
      </section>
    </div>
  );
}
