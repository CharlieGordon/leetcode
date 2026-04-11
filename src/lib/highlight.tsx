import type { ReactNode } from 'react';

const tokenPattern =
  /(\/\/.*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|for|while|if|else|throw|new|export|import|from|type|Record|Map|number|string|undefined)\b|\b\d+(?:\.\d+)?\b)/g;

function tokenClass(token: string): string {
  if (token.startsWith('//') || token.startsWith('/*')) {
    return 'token-comment';
  }

  if (token.startsWith("'") || token.startsWith('"') || token.startsWith('`')) {
    return 'token-string';
  }

  if (/^\d/.test(token)) {
    return 'token-number';
  }

  return 'token-keyword';
}

export function highlightTypeScript(source: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(source)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(source.slice(lastIndex, match.index));
    }

    nodes.push(
      <span key={`${match.index}-${match[0]}`} className={tokenClass(match[0])}>
        {match[0]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < source.length) {
    nodes.push(source.slice(lastIndex));
  }

  return nodes;
}
