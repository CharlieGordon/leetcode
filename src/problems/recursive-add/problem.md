# Recursive Add

Create a function `recursiveAdd` that accepts an optional number and returns a
function that can keep accepting numbers.

When the returned function is called without an argument, it should return the
sum of all numbers passed through the chain.

## Example 1

```text
Input: recursiveAdd(1)(2)(4)()
Output: 7
```

## Example 2

```text
Input: recursiveAdd(5)()
Output: 5
```

## Example 3

```text
Input: recursiveAdd()
Output: 0
```

## Example 4

```text
Input: recursiveAdd(-3)(10)(-2)()
Output: 5
```

## Constraints

- Each provided value is a number.
- The chain ends when `recursiveAdd` or one of its returned functions is called without an argument.
- The implementation should preserve the running total across recursive calls.
