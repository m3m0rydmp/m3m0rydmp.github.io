# Incident Window

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Easy
OS: Multi-platform
Category: Coding
Tags: Coding, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

For these five, I still had the Python submissions. I checked them against small independent implementations while putting this page together: 100 cases per solver, including boundary cases and disconnected graphs. Those checks validate the logic on the generated inputs; they aren't a replay of the event's hidden tests.

The task counted integer-aligned windows containing at least `K` suspicious events. The interval was half-open: `[t, t + W)`. An event exactly at the right boundary didn't count.

My [saved implementation](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/coding/incident_window.py) kept the suspicious timestamps and turned each qualifying group into a range of possible window starts.

For the group ending at index `r`, the earliest valid start is just after `suspicious[r] - W`. The latest is the timestamp of the first of the last `K` events:

```python
t_min = max(0, suspicious[r] - W + 1)
t_max = min(10000 - W, suspicious[r - K + 1])
```

I merged those inclusive ranges and counted their lengths. Without that merge, overlapping groups could count the same window several times.

For a small example, suspicious events at `2` and `4`, with `K = 2` and `W = 4`, fit into windows starting at `1` or `2`. The count is two, even though the same pair of events appears in both windows.

One assumption matters here: the saved script expects timestamps in order. I'd sort the suspicious timestamps before using this approach on an unordered log. It also uses the challenge's start-time limit of `0` through `10000 - W`, inclusive.

With `M` suspicious events, the scan is linear and sorting the candidate ranges makes the overall bound `O(N + M log M)`, with `O(N + M)` memory in this implementation. The [description reference](https://github.com/archang31/htb-global-cyber-skills-benchmark-ctf-2026-writeups/blob/aac1fc2ccf85671cfb73289e3ad9700187994fad/coding/incident-window/README.md) uses a prefix-sum approach instead; this is the route in my saved code.

```text
HTB{sl1d3_th3_w1nd0w_s1l3nc3_th3_n0d3}
```
