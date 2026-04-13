# Fibonacci Sequence Check

Create a function `isFib` that accepts a number and returns whether it belongs
to the Fibonacci sequence.

The Fibonacci sequence starts with `0` and `1`, and each following number is
the sum of the two numbers before it:

```text
0, 1, 1, 2, 3, 5, 8, 13, ...
```

## Example 1

```text
Input: n = 5
Output: true
Explanation: 5 appears in the Fibonacci sequence.
```

## Example 2

```text
Input: n = 10
Output: false
Explanation: 10 does not appear in the Fibonacci sequence.
```

## Example 3

```text
Input: n = 0
Output: true
Explanation: 0 is the first Fibonacci number.
```

## Constraints

- `n` is a number.
- Return `true` only for nonnegative safe integers that appear in the Fibonacci
  sequence.
- Return `false` for negative numbers, decimals, `NaN`, `Infinity`, and
  `-Infinity`.
