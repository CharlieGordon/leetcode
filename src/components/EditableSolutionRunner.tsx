import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { tags } from '@lezer/highlight';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearSolutionDraft, resolveSolutionSource, saveSolutionDraft } from '../lib/solutionDrafts';
import { runSolutionScript } from '../lib/solutionRunner';
import { terminalLineToText, type TerminalLine } from '../lib/terminalOutput';
import type { SolutionSource } from '../types';
import { IconButton } from './ui/IconButton';
import { CloseIcon, PlayIcon, ResetIcon, SpinnerIcon, TerminalIcon } from './ui/icons';
import styles from './EditableSolutionRunner.module.css';

const editorColors = {
  background: 'var(--code-bg)',
  text: 'var(--code-text-soft)',
  selection: 'var(--code-selection)',
  keyword: 'var(--syntax-keyword)',
  function: 'var(--syntax-function)',
  number: 'var(--syntax-number)',
  punctuation: 'var(--syntax-punctuation)',
  string: 'var(--syntax-string)',
  comment: 'var(--syntax-comment)',
} as const;

const codeEditorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: editorColors.background,
      color: editorColors.text,
    },
    '.cm-content': {
      caretColor: editorColors.text,
    },
    '.cm-cursor': {
      borderLeftColor: editorColors.text,
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: editorColors.selection,
    },
  },
  { dark: true },
);

const codeHighlightStyle = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.definitionKeyword], color: editorColors.keyword },
  { tag: [tags.function(tags.variableName), tags.definition(tags.variableName)], color: editorColors.function },
  { tag: [tags.number, tags.bool], color: editorColors.number },
  { tag: [tags.operator, tags.compareOperator, tags.arithmeticOperator, tags.definitionOperator], color: editorColors.keyword },
  { tag: [tags.typeName, tags.variableName, tags.propertyName], color: editorColors.text },
  { tag: tags.punctuation, color: editorColors.punctuation },
  { tag: tags.string, color: editorColors.string },
  { tag: tags.comment, color: editorColors.comment, fontStyle: 'italic' },
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
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setSource(resolvedSource.source);
    setHasDraft(resolvedSource.hasDraft);
    setTerminalLines([]);
    setIsTerminalOpen(false);
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
    setIsTerminalOpen(false);
  }

  async function runCurrentSource(): Promise<void> {
    setIsTerminalOpen(true);
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

  const runLabel = isRunning ? 'Running solution' : 'Run solution';
  const terminalToggleLabel = isTerminalOpen ? 'Hide terminal' : 'Show terminal';
  const draftStatusLabel = hasDraft ? 'Browser draft' : 'Repo source';

  return (
    <div className={styles.runner}>
      <div className={styles.toolbar}>
        <div className={styles.actions}>
          <IconButton
            className={styles.runButton}
            onClick={runCurrentSource}
            disabled={isRunning}
            label={runLabel}
          >
            {isRunning ? <SpinnerIcon /> : <PlayIcon />}
          </IconButton>
          <IconButton
            className={styles.terminalToggleButton}
            onClick={() => setIsTerminalOpen((currentValue) => !currentValue)}
            aria-pressed={isTerminalOpen}
            label={terminalToggleLabel}
          >
            <TerminalIcon className={styles.terminalIcon} />
          </IconButton>
          {hasDraft && (
            <IconButton
              className={styles.resetButton}
              onClick={resetDraft}
              disabled={isRunning}
              label="Reset browser draft"
            >
              <ResetIcon />
            </IconButton>
          )}
        </div>
        <span className={styles.draftStatus} data-has-draft={hasDraft}>
          {draftStatusLabel}
        </span>
      </div>

      {/* <label className={styles.editorLabel} htmlFor={`solution-editor-${problemSlug}-${solution.id}`}>
        <span className={styles.codeFileName}>{solution.id}.ts</span>
        <span className={styles.codeLanguage}>TypeScript</span>
      </label> */}

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

      {isTerminalOpen && (
        <section className={styles.terminal} aria-label="Terminal output">
          <div className={styles.terminalToolbar}>
            <span>Terminal</span>
            <IconButton
              onClick={() => setIsTerminalOpen(false)}
              label="Close terminal"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <pre className={styles.terminalOutput}>
            {terminalLines.map((line, index) => (
              <code key={`${line.kind}-${index}`}>{terminalLineToText(line)}</code>
            ))}
          </pre>
        </section>
      )}
    </div>
  );
}
