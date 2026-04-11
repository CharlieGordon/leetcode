export function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();

  for (let index = 0; index < nums.length; index += 1) {
    const complement = target - nums[index];
    const complementIndex = seen.get(complement);

    if (complementIndex !== undefined) {
      return [complementIndex, index];
    }

    seen.set(nums[index], index);
  }

  throw new Error('No two sum solution found');
}
