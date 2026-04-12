export function missingNumber(nums: number[]): number {
  const sorted = nums.sort((a, b) => a - b);

  if (sorted[0] !== 0) {
    return 0;
  }

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] > 1) {
      return sorted[i - 1] + 1;
    }
  }

  return sorted[sorted.length - 1] + 1;
}
