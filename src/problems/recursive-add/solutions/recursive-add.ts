export function recursiveAdd(a?: number) {
  if (a === undefined) return 0;

  return function (b?: number) {
    if (b === undefined) return a;

    return recursiveAdd(a + b);
  };
}
