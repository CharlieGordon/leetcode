import { describe, expect, it } from 'vitest';
import { formatConsoleValue, formatThrownValue, terminalLineToText } from './terminalOutput';

describe('terminal output formatting', () => {
  it('formats primitive console values', () => {
    expect(formatConsoleValue('hello')).toBe('hello');
    expect(formatConsoleValue(42)).toBe('42');
    expect(formatConsoleValue(true)).toBe('true');
    expect(formatConsoleValue(null)).toBe('null');
    expect(formatConsoleValue(undefined)).toBe('undefined');
  });

  it('formats arrays and objects as JSON when possible', () => {
    expect(formatConsoleValue([0, 1])).toBe('[0, 1]');
    expect(formatConsoleValue({ answer: 42 })).toBe('{"answer":42}');
  });

  it('falls back for circular objects', () => {
    const value: Record<string, unknown> = {};
    value.self = value;

    expect(formatConsoleValue(value)).toBe('[object Object]');
  });

  it('formats console lines without adding result labels', () => {
    expect(
      terminalLineToText({
        kind: 'log',
        values: ['nums:', [2, 7]],
      }),
    ).toBe('nums: [2, 7]');
  });

  it('formats thrown errors as terminal text', () => {
    expect(formatThrownValue({ name: 'Error', message: 'No solution found' })).toBe(
      'Error: No solution found',
    );
    expect(formatThrownValue({ message: 'boom' })).toBe('Error: boom');
    expect(formatThrownValue('bad input')).toBe('bad input');
  });
});
