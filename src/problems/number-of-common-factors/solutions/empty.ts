export function commonFactors(a: number, b: number): number {
  let result = 0
  let i = Math.max(a, b)

  while(i >= 1) {
    if(a % i === 0 && b % i === 0) {
      result += 1
    }

    i--
  }

  return result
}
