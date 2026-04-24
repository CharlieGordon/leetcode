import * as esbuild from 'esbuild-wasm';
import wasmUrl from 'esbuild-wasm/esbuild.wasm?url';
import type { TerminalLine } from './terminalOutput';

const DEFAULT_TIMEOUT_MS = 2000;

type WorkerConsoleMethod = 'log' | 'warn' | 'error';

type WorkerMessage =
  | {
      type: 'console';
      method: WorkerConsoleMethod;
      values: unknown[];
    }
  | {
      type: 'error';
      message: string;
    }
  | {
      type: 'done';
    };

type TransformApi = Pick<typeof esbuild, 'initialize' | 'transform'>;

type RunCompiledScriptOptions = {
  code: string;
  createWorker?: () => Worker;
  timeoutMs?: number;
  onLine: (line: TerminalLine) => void;
};

let initializePromise: Promise<void> | undefined;

function ensureEsbuildInitialized(transformApi: TransformApi = esbuild): Promise<void> {
  initializePromise ??= transformApi.initialize({
    wasmURL: wasmUrl,
  });

  return initializePromise;
}

export function normalizeWorkerMessage(message: unknown): TerminalLine | null {
  if (!message || typeof message !== 'object' || !('type' in message)) {
    return {
      kind: 'exception',
      message: 'Runner sent an unreadable message',
    };
  }

  if (message.type === 'done') {
    return null;
  }

  if (
    message.type === 'console' &&
    'method' in message &&
    (message.method === 'log' || message.method === 'warn' || message.method === 'error') &&
    'values' in message &&
    Array.isArray(message.values)
  ) {
    return {
      kind: message.method,
      values: message.values,
    };
  }

  if (message.type === 'error' && 'message' in message && typeof message.message === 'string') {
    return {
      kind: 'exception',
      message: message.message,
    };
  }

  return {
    kind: 'exception',
    message: 'Runner sent an unsupported message',
  };
}

export async function transformSolutionScript(
  source: string,
  transformApi: TransformApi = esbuild,
): Promise<string> {
  await ensureEsbuildInitialized(transformApi);

  const result = await transformApi.transform(source, {
    format: 'iife',
    loader: 'ts',
    platform: 'browser',
    target: 'es2020',
  });

  return result.code;
}

export function createSolutionWorker(): Worker {
  return new Worker(new URL('./solutionExecution.worker.ts', import.meta.url), {
    type: 'module',
  });
}

export function runCompiledScriptWithWorker({
  code,
  createWorker = createSolutionWorker,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onLine,
}: RunCompiledScriptOptions): Promise<void> {
  return new Promise((resolve) => {
    const worker = createWorker();

    let finished = false;

    function finish(): void {
      if (finished) {
        return;
      }

      finished = true;
      globalThis.clearTimeout(timeoutId);
      worker.terminate();
      resolve();
    }

    const timeoutId = globalThis.setTimeout(() => {
      onLine({
        kind: 'timeout',
        message: `Execution timed out after ${timeoutMs}ms`,
      });
      finish();
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const line = normalizeWorkerMessage(event.data);

      if (line) {
        onLine(line);
        if (event.data.type === 'error') {
          finish();
        }
        return;
      }

      finish();
    };

    worker.onerror = (event: ErrorEvent) => {
      onLine({
        kind: 'exception',
        message: event.message,
      });
      finish();
    };

    worker.postMessage({ type: 'run', code });
  });
}

export async function runSolutionScript(
  source: string,
  onLine: (line: TerminalLine) => void,
): Promise<void> {
  try {
    const code = await transformSolutionScript(source);
    await runCompiledScriptWithWorker({ code, onLine });
  } catch (error) {
    onLine({
      kind: 'compile-error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
