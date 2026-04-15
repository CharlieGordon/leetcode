// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...

export function isFib(n: number): boolean {
  if(n === 0 || n === 1) {
    return true;
  }

  if(!Number.isSafeInteger(n)) {
    return false
  }

  let a = 0
  let b = 1

  while(b <= n) {
    const next = a + b

    if(next === n) {
      return true
    }

    a = b
    b = next
  }

  return false;
}
