import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

export function highlightTypeScript(source: string): string {
  return Prism.highlight(source, Prism.languages.typescript, 'typescript');
}
