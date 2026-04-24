import { describe, expect, it, vi } from 'vitest';
import { normalizeWorkerMessage, runCompiledScriptWithWorker } from './solutionRunner';

class FakeWorker {
  static instances: FakeWorker[] = [];

  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;
  postedMessages: unknown[] = [];

  constructor() {
    FakeWorker.instances.push(this);
  }

  postMessage(message: unknown): void {
    this.postedMessages.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent);
  }
}

describe('solution runner', () => {
  it('normalizes known worker messages into terminal lines', () => {
    expect(normalizeWorkerMessage({ type: 'console', method: 'log', values: ['hello'] })).toEqual({
      kind: 'log',
      values: ['hello'],
    });
    expect(normalizeWorkerMessage({ type: 'error', message: 'Error: bad input' })).toEqual({
      kind: 'exception',
      message: 'Error: bad input',
    });
    expect(normalizeWorkerMessage({ type: 'done' })).toBeNull();
  });

  it('terminates the worker and reports timeout when execution does not finish', async () => {
    vi.useFakeTimers();
    FakeWorker.instances = [];

    const onLine = vi.fn();
    const runPromise = runCompiledScriptWithWorker({
      code: 'while (true) {}',
      WorkerConstructor: FakeWorker as unknown as typeof Worker,
      timeoutMs: 25,
      onLine,
    });

    expect(FakeWorker.instances[0].postedMessages).toEqual([
      { type: 'run', code: 'while (true) {}' },
    ]);

    await vi.advanceTimersByTimeAsync(25);
    await runPromise;

    expect(FakeWorker.instances[0].terminated).toBe(true);
    expect(onLine).toHaveBeenCalledWith({
      kind: 'timeout',
      message: 'Execution timed out after 25ms',
    });

    vi.useRealTimers();
  });

  it('resolves when the worker sends done', async () => {
    FakeWorker.instances = [];
    const onLine = vi.fn();

    const runPromise = runCompiledScriptWithWorker({
      code: 'console.log("done")',
      WorkerConstructor: FakeWorker as unknown as typeof Worker,
      timeoutMs: 1000,
      onLine,
    });

    FakeWorker.instances[0].emit({ type: 'console', method: 'log', values: ['done'] });
    FakeWorker.instances[0].emit({ type: 'done' });

    await runPromise;

    expect(onLine).toHaveBeenCalledWith({ kind: 'log', values: ['done'] });
    expect(FakeWorker.instances[0].terminated).toBe(true);
  });
});
