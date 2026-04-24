type RunMessage = {
  type: 'run';
  code: string;
};

function serializeError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack || `${error.name}: ${error.message}`;
  }

  return String(error);
}

function postConsole(method: 'log' | 'warn' | 'error', values: unknown[]): void {
  self.postMessage({
    type: 'console',
    method,
    values,
  });
}

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
