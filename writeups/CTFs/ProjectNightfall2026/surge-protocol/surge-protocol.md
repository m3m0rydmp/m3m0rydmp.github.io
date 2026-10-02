# Surge Protocol

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Hard
OS: Multi-platform
Category: Coding
Tags: Coding, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

For these five, I still had the Python submissions. I checked them against small independent implementations while putting this page together: 100 cases per solver, including boundary cases and disconnected graphs. Those checks validate the logic on the generated inputs; they aren't a replay of the event's hidden tests.

This was a range-update, range-maximum problem. An update added a value to every sensor in an inclusive interval. A query asked for the maximum in another interval.

Walking every affected sensor for every operation would get expensive, so my [solver](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/coding/surge_protocol.py) used a segment tree with lazy propagation.

Each node stored the maximum for its segment. A full-cover update changed that maximum and recorded the pending addition in `lazy[node]`:

```python
tree[node] += value
lazy[node] += value
```

I only pushed that addition to the children when an operation needed to go deeper. Adding the same value to a whole segment shifts its maximum by exactly that value, so there's no need to touch every leaf immediately.

An easy detail to miss is the output: my script **adds all query results together** and prints the total once. It doesn't print a separate line for each query. Starting with `[1, 3, 2]`, a full-range query gives 3. Adding 5 to indices 0 through 1 gives `[6, 8, 2]`; the next full-range query gives 8, making the printed total 11.

Building the tree takes `O(N)`. Each update or query takes `O(log N)`, with `O(N)` storage. The recursion follows the tree height, not the number of operations.

```text
HTB{l4zy_s3g_surG3_pr0t0c0l_p4ss3d}
```
