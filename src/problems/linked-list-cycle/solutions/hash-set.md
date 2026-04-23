### Approach
This implementation walks the list once and stores each visited node object in a `Set`.

On every step, it checks whether the current node reference is already in the set. If it is, the traversal has returned to a node seen earlier, so the list contains a cycle. If the pointer reaches `null`, the walk ended normally and there is no cycle.

Because the set stores node references, repeated values such as two different nodes with the same `val` do not count as a cycle.

### Complexity
- Time: `O(n)`
- Space: `O(n)`

### Tradeoffs
This version is easy to read and maps directly to the problem statement: "have I seen this node before?" The tradeoff is extra memory proportional to the number of visited nodes, so it uses more space than the classic fast-and-slow-pointer approach.
