export type TerminalLine =
  | {
      kind: 'log' | 'warn' | 'error';
      values: unknown[];
    }
  | {
      kind: 'exception' | 'timeout' | 'compile-error';
      message: string;
    };

export function formatConsoleValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(formatConsoleValue).join(', ')}]`;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function formatThrownValue(value: unknown): string {
  if (
    value &&
    typeof value === 'object' &&
    'message' in value &&
    typeof value.message === 'string'
  ) {
    const name = 'name' in value && typeof value.name === 'string' ? value.name : 'Error';
    return `${name}: ${value.message}`;
  }

  return formatConsoleValue(value);
}

export function terminalLineToText(line: TerminalLine): string {
  if ('values' in line) {
    return line.values.map(formatConsoleValue).join(' ');
  }

  return line.message;
}
