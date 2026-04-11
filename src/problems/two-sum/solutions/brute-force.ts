export function twoSum(nums: number[], target: number): number[] {
  for (let left = 0; left < nums.length; left += 1) {
    for (let right = left + 1; right < nums.length; right += 1) {
      if (nums[left] + nums[right] === target) {
        return [left, right];
      }
    }
  }

  throw new Error('No two sum solution found');
}
