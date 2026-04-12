export function isPalindrome(str: string) {
  const chars = Array.from(str);

  for (let i = 0; i < chars.length / 2; i++) {
    if (chars[i] !== chars[chars.length - 1 - i]) {
      return false;
    }
  }

  return true;
}
