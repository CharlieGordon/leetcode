export function hammingWeight(n: number): number {
  const binary = n.toString(2);
  let count = 0;

  for (let item of binary) {
    if (item === '1') count++;
  }

  return count;
}
