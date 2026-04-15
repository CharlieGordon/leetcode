export function factorial(n: number): number {
  if(n <= 1) {
    return 1
  }

  let result = 1

  for(let i = n; i > 1; i--) {
    result = result * i
  }

  return result
}
