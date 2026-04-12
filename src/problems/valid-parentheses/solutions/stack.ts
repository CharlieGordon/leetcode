export function isValid(s: string): boolean {
  const stack: string[] = [];
  const brackets: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{',
  };

  for (const item of s) {
    if (Object.values(brackets).includes(item)) {
      stack.push(item);
    } else if (Object.keys(brackets).includes(item)) {
      if (stack[stack.length - 1] === brackets[item]) {
        stack.pop();
      } else {
        return false;
      }
    }
  }

  return stack.length === 0;
}
