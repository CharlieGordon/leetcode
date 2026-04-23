### Approach
This implementation builds a `Map` from a canonical key to the strings that belong
in that anagram group.

For each input string, it:

- splits the string into characters
- sorts those characters
- joins them back into a normalized key such as `"aet"` or `"ant"`

Strings that produce the same sorted key are anagrams, so they get pushed into the
same array in the map. After processing every string, the solution returns
`Array.from(groups.values())`.

### Complexity
- Time: `O(n * k log k)`, where `n` is the number of strings and `k` is the
  average string length
- Space: `O(n * k)` for the grouped output and the sorted-key map

### Tradeoffs
- This version is short and easy to follow because the sorted string is a simple,
  reliable grouping key.
- The main cost is sorting every string, which is slower than counting character
  frequencies when performance is the top priority.
- Returning `groups.values()` means the output order depends on insertion order,
  which is fine here because the problem allows any order.
