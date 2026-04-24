type RunMessage = {
  type: 'run';
  code: string;
};

type CloneSafeValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | CloneSafeValue[]
  | {
      [key: string]: CloneSafeValue;
    };

function serializeError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack || `${error.name}: ${error.message}`;
  }

  return String(error);
}

export function toCloneSafeValue(value: unknown, seen = new WeakSet<object>()): CloneSafeValue {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  ) {
    return value;
  }

  if (typeof value === 'bigint' || typeof value === 'symbol') {
    return String(value);
  }

  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`;
  }

  if (typeof value !== 'object') {
    return String(value);
  }

  if (seen.has(value)) {
    return '[Circular]';
  }

  seen.add(value);

  if (Array.isArray(value)) {
    const cloneSafeArray = value.map((item) => toCloneSafeValue(item, seen));
    seen.delete(value);
    return cloneSafeArray;
  }

  const prototype = Object.getPrototypeOf(value);

  if (prototype !== Object.prototype && prototype !== null) {
    seen.delete(value);
    return String(value);
  }

  const cloneSafeObject: { [key: string]: CloneSafeValue } = {};

  for (const [key, item] of Object.entries(value)) {
    cloneSafeObject[key] = toCloneSafeValue(item, seen);
  }

  seen.delete(value);
  return cloneSafeObject;
}

export function toCloneSafeValues(values: unknown[]): CloneSafeValue[] {
  return values.map((value) => toCloneSafeValue(value));
}

function postConsole(method: 'log' | 'warn' | 'error', values: unknown[]): void {
  self.postMessage({
    type: 'console',
    method,
    values: toCloneSafeValues(values),
  });
}

if (typeof self !== 'undefined') {
  self.onmessage = (event: MessageEvent<RunMessage>) => {
    if (!event.data || event.data.type !== 'run') {
      return;
    }

    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
    };

    console.log = (...values: unknown[]) => postConsole('log', values);
    console.warn = (...values: unknown[]) => postConsole('warn', values);
    console.error = (...values: unknown[]) => postConsole('error', values);

    try {
      new Function(event.data.code)();
    } catch (error) {
      self.postMessage({
        type: 'error',
        message: serializeError(error),
      });
    } finally {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      self.postMessage({ type: 'done' });
    }
  };
}
