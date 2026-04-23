### Approach
This implementation computes the longer input length with `Math.max(word1.length, word2.length)` and then walks both strings with a single `for` loop.

On each iteration, it checks whether `word1[i]` exists and appends it to `output`, then does the same for `word2[i]`. That keeps the merge order alternating from `word1` first while naturally handling uneven lengths: once one string runs out, only the remaining characters from the longer string continue to be appended.

Because the remainder case is handled by the same two `if` checks, the function avoids separate cleanup loops for leftover characters.

### Complexity
- Loop iterations: `O(max(word1.length, word2.length))`
- Output storage: `O(word1.length + word2.length)`

### Tradeoffs
- The code is short and easy to follow because everything happens in one loop.
- It favors clarity over low-level optimization by building the result through repeated string concatenation.
- The `if (word1[i])` and `if (word2[i])` checks work for this problem because the inputs are lowercase English letters, so every valid character is truthy.
