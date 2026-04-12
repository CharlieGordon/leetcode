export function containsDuplicate(nums: number[]): boolean {
  const sorted = nums.sort((a, b) => a - b);

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1]) {
      return true;
    }
  }

  return false;
}
