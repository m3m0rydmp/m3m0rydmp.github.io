# Cascade Depth

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Medium
OS: Multi-platform
Category: Coding
Tags: Coding, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

For these five, I still had the Python submissions. I checked them against small independent implementations while putting this page together: 100 cases per solver, including boundary cases and disconnected graphs. Those checks validate the logic on the generated inputs; they aren't a replay of the event's hidden tests.

The dependency graph was a DAG with weighted edges. I needed the maximum accumulated weight along a path.

I used Kahn's algorithm to visit vertices in topological order. Every vertex started with `dp[v] = 0`. Once all incoming dependencies had been processed, its best value was ready to pass along:

```python
for v, weight in graph[u]:
    dp[v] = max(dp[v], dp[u] + weight)
    in_degree[v] -= 1
    if in_degree[v] == 0:
        queue.append(v)
```

The final answer was `max(dp)`. With edges `0 -> 1` of weight 4 and `1 -> 2` of weight 7, that path contributes 11, even if a direct `0 -> 2` edge only contributes 6.

The [solver](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/coding/cascade_depth.py) runs in `O(V + E)` time and memory. The zero initialization allows an empty path with value zero, which matters if adapting it to negative weights. It also assumes the promised acyclic graph; it doesn't reject a cycle explicitly.

```text
HTB{c4sc4d3_d3pth_d4g_dp_0pt1m4l}
```
