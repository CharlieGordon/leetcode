### Approach
This implementation starts at `Math.max(a, b)` and walks downward to `1`, checking whether each candidate divides both inputs evenly. Every shared divisor increments the counter, and the final count is returned.

Because the loop scans from the larger input instead of the smaller one, it does extra work for values that cannot possibly divide both numbers. That is still acceptable here because the problem constraints are small.

### Complexity
- Time: `O(max(a, b))`
- Space: `O(1)`

### Tradeoffs
- The code is direct and easy to verify because it tests the definition of a common factor literally.
- It avoids extra math setup, but it is less efficient than solutions based on the greatest common divisor plus divisor counting.
- The descending scan order does not change the result, but it does not provide any early-exit optimization either.
