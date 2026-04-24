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
  return formatConsoleValueWithSeen(value, new WeakSet<object>());
}

function formatConsoleValueWithSeen(value: unknown, seen: WeakSet<object>): string {
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
    if (seen.has(value)) {
      return '[Circular]';
    }

    seen.add(value);
    const formatted = `[${value.map((item) => formatConsoleValueWithSeen(item, seen)).join(', ')}]`;
    seen.delete(value);
    return formatted;
  }

  try {
    return JSON.stringify(value) ?? String(value);
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
