import type { ReactNode } from 'react';

type MarkdownBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; language: string; code: string };

const codeFencePattern = /^```(\w+)?\s*$/;

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = markdown.split('\n');
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const codeFence = codeFencePattern.exec(line);
    if (codeFence) {
      const code: string[] = [];
      index += 1;

      while (index < lines.length && !codeFencePattern.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }

      blocks.push({ type: 'code', language: codeFence[1] ?? 'text', code: code.join('\n') });
      index += 1;
      continue;
    }

    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];

      while (index < lines.length && lines[index].startsWith('- ')) {
        items.push(lines[index].slice(2));
        index += 1;
      }

      blocks.push({ type: 'list', items });
      continue;
    }

    const paragraph: string[] = [];

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,4})\s+/.test(lines[index]) &&
      !lines[index].startsWith('- ') &&
      !codeFencePattern.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }

    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
  }

  return blocks;
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(<code key={`code-${match.index}`}>{match[1]}</code>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function renderMarkdown(markdown: string): ReactNode[] {
  return parseMarkdown(markdown).map((block, index) => {
    const key = `${block.type}-${index}`;

    switch (block.type) {
      case 'heading': {
        const level = Math.min(block.level, 4);

        if (level === 1) {
          return <h1 key={key}>{renderInline(block.text)}</h1>;
        }

        if (level === 2) {
          return <h2 key={key}>{renderInline(block.text)}</h2>;
        }

        if (level === 3) {
          return <h3 key={key}>{renderInline(block.text)}</h3>;
        }

        return <h4 key={key}>{renderInline(block.text)}</h4>;
      }
      case 'paragraph':
        return <p key={key}>{renderInline(block.text)}</p>;
      case 'list':
        return (
          <ul key={key}>
            {block.items.map((item, itemIndex) => (
              <li key={`${key}-${itemIndex}`}>{renderInline(item)}</li>
            ))}
          </ul>
        );
      case 'code':
        return (
          <pre key={key} className="markdown-code" data-language={block.language}>
            <code>{block.code}</code>
          </pre>
        );
    }
  });
}
