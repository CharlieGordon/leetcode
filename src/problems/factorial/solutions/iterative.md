### Approach
This solution keeps a running product and multiplies it by each integer from `2` through `n`.

### Complexity
- Time: `O(n)`
- Space: `O(1)`

### Tradeoffs
The iterative version is straightforward and avoids recursion depth concerns, so it is the safer default for larger valid inputs.
