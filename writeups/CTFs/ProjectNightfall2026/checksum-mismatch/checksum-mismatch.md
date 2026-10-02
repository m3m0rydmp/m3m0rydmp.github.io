# Checksum Mismatch

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Very Easy
OS: Multi-platform
Category: Coding
Tags: Coding, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

For these five, I still had the Python submissions. I checked them against small independent implementations while putting this page together: 100 cases per solver, including boundary cases and disconnected graphs. Those checks validate the logic on the generated inputs; they aren't a replay of the event's hidden tests.

Each packet supplied a payload and a stored XOR checksum. I needed to count the packets whose checksum didn't match.

The [saved solver](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/coding/checksum_mismatch.py) does exactly that. For each line, the first number is the payload length, the next values are bytes, and the last value is the stored checksum.

```python
calculated = 0
for byte in payload:
    calculated ^= byte

if calculated != stored_checksum:
    corrupted_count += 1
```

For example, `1 ^ 2 ^ 3` is `0`. A stored checksum of `0` matches; `1` doesn't. I only needed a running mismatch count, not a copy of the entire batch.

The work is linear in the total number of payload bytes. This particular script holds one packet at a time. XOR catches the mismatches defined by the challenge; it isn't a secure replacement for a cryptographic integrity check.

```text
HTB{xor_7h3_truth_fr0m_7h3_n01s3}
```
