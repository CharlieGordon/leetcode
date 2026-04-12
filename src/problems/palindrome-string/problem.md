# Palindrome String

Given a string `str`, return `true` if it reads the same forward and backward. Otherwise, return `false`.

Characters are compared exactly as they appear. Do not ignore spaces, punctuation, or letter casing.

## Example 1

```text
Input: str = "racecar"
Output: true
Explanation: Reading the string from either direction produces "racecar".
```

## Example 2

```text
Input: str = "hello"
Output: false
Explanation: The first and last characters do not match.
```

## Example 3

```text
Input: str = "Racecar"
Output: false
Explanation: Uppercase "R" and lowercase "r" are different characters.
```

## Constraints

- `0 <= str.length <= 10^5`
- `str` may contain any valid JavaScript string characters.
- Character comparison is case-sensitive.
