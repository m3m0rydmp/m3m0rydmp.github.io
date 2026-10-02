# Choke Point

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Insane
OS: Multi-platform
Category: Coding
Tags: Coding, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

For these five, I still had the Python submissions. I checked them against small independent implementations while putting this page together: 100 cases per solver, including boundary cases and disconnected graphs. Those checks validate the logic on the generated inputs; they aren't a replay of the event's hidden tests.

This was the trickiest coding entry to reconstruct because the [reference summary](https://github.com/archang31/htb-global-cyber-skills-benchmark-ctf-2026-writeups/blob/aac1fc2ccf85671cfb73289e3ad9700187994fad/coding/choke-point/README.md) describes selecting the biggest non-root bottleneck. My [saved solver](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/coding/choke_point.py) computes a different result: **the sum of all dominator-subtree sizes**.

A vertex `u` dominates `v` if every path from the start vertex to `v` passes through `u`. Removing `u` cuts off every vertex in its dominator subtree. Ordinary graph descendants aren't enough: a descendant may have another route from the start.

The code uses Lengauer–Tarjan. I read it in five parts:

1. DFS numbers only the vertices reachable from the chosen start.
2. A reverse pass computes semidominators using predecessor edges and the `find`/`union` helpers.
3. Buckets collect provisional immediate dominators.
4. A correction pass resolves the final immediate-dominator links.
5. A tree traversal adds each subtree size to `ans`.

That last step settles the output:

```python
size = 1
for child in tree[node]:
    size += visit(child)
answer += size
```

The removed vertex counts, and so does the root's subtree. For a chain `0 -> 1 -> 2`, the sizes are 3, 2, and 1, so the answer is **6**. For a diamond with two independent routes to the last vertex, the root dominates all four vertices, while each other subtree has size 1: **7** in total.

I checked this by removing each reachable vertex in small graphs, recounting reachability, and summing the losses. It agreed with the saved solver in all 100 generated cases. Unreachable vertices are excluded. The recursive DFS can still be a practical limit on very deep graphs; raising Python's recursion limit doesn't make stack space unlimited.

I don't have the full original statement, so I describe what this implementation actually returns instead of silently changing it to fit the reference.

```text
HTB{l3nGu3r_t4rj4n_ch0k3_p01nt_f0und}
```
