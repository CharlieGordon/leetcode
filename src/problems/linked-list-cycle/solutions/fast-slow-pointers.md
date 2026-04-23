### Approach
This implementation starts both pointers at the head, then advances `slow` by one node and `fast` by two nodes on each loop iteration.

If the list has a cycle, the faster pointer eventually laps the slower one, so both variables point to the same node reference and the function returns `true`. If `fast` reaches `null` or its `next` pointer is `null`, the list ends normally and there is no cycle.

Like the hash-set version, this check depends on node identity, not node values.

### Complexity
- Time: `O(n)`
- Space: `O(1)`

### Tradeoffs
This version avoids allocating extra memory, which makes it the more space-efficient choice. The tradeoff is that the reasoning is less direct than the set-based approach, since correctness depends on the fast pointer eventually catching the slow pointer inside a cycle.
