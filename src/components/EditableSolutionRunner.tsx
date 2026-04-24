import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { tags } from '@lezer/highlight';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearSolutionDraft, resolveSolutionSource, saveSolutionDraft } from '../lib/solutionDrafts';
import { runSolutionScript } from '../lib/solutionRunner';
import { terminalLineToText, type TerminalLine } from '../lib/terminalOutput';
import type { SolutionSource } from '../types';
import styles from './EditableSolutionRunner.module.css';

const codeEditorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#10140f',
      color: '#eef3e8',
    },
    '.cm-content': {
      caretColor: '#eef3e8',
    },
    '.cm-cursor': {
      borderLeftColor: '#eef3e8',
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: 'rgba(159, 214, 255, 0.24)',
    },
  },
  { dark: true },
);

const codeHighlightStyle = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.definitionKeyword], color: '#9fd6ff' },
  { tag: [tags.function(tags.variableName), tags.definition(tags.variableName)], color: '#f2e58f' },
  { tag: [tags.number, tags.bool], color: '#f0c46f' },
  { tag: [tags.operator, tags.compareOperator, tags.arithmeticOperator, tags.definitionOperator], color: '#9fd6ff' },
  { tag: [tags.typeName, tags.variableName, tags.propertyName], color: '#eef3e8' },
  { tag: tags.punctuation, color: '#dfe7da' },
  { tag: tags.string, color: '#a7d79b' },
  { tag: tags.comment, color: '#7f8b7c', fontStyle: 'italic' },
]);

const editorExtensions = [
  javascript({ typescript: true }),
  syntaxHighlighting(codeHighlightStyle),
];

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
  const storage = useMemo(() => getBrowserStorage(), []);
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

  const updateSource = useCallback((nextSource: string): void => {
    setSource(nextSource);
    setHasDraft(true);
    saveSolutionDraft(storage, problemSlug, solution.id, nextSource);
  }, [problemSlug, solution.id, storage]);

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
      <CodeMirror
        id={`solution-editor-${problemSlug}-${solution.id}`}
        className={styles.editor}
        aria-label={`${solution.name} TypeScript source`}
        basicSetup={{
          bracketMatching: true,
          closeBrackets: true,
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          lineNumbers: false,
        }}
        extensions={editorExtensions}
        height="100%"
        minHeight="438px"
        theme={codeEditorTheme}
        value={source}
        onChange={updateSource}
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
