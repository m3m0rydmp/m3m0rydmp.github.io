# Twice or Nothing

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Medium
OS: Multi-platform
Category: Crypto
Tags: Crypto, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

The [next gateway](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/crypto/crypto_twice_or_nothing/src/main.rs) hashed messages before choosing secrets, so the all-zero/all-one trick no longer applied. It also limited signing requests.

The key reuse was still there. I only needed one observed secret matching the target digest's bit at each position. Different signed messages could supply different positions.

My saved search script sampled candidate messages locally and kept the one that covered the most missing positions. SHA-256 is public, so that search didn't need to spend a signing request on every candidate.

The saved messages covered this many target positions after each selection:

| Selection | Covered positions |
| --- | --- |
| 1 | 156 / 256 |
| 2 | 220 / 256 |
| 3 | 248 / 256 |
| 4 | 256 / 256 |
| 5–6 | Still 256 / 256 |

I recomputed those counts from the saved inputs. This particular set only needs four tokens, although the submitted script requests six. That isn't a guarantee that any four random messages will work.

The limit has an off-by-one detail too: `issue_count > BURN_LIMIT`, with `BURN_LIMIT = 5`, permits six successful issues. After collecting the tokens, the script picks a matching segment for every bit of `SHA256(b"d9_netadmin")` and submits the assembled token.

Hashing the message fixed the first challenge's raw-bit weakness. Reusing a one-time signing key still leaked enough material to sign the target.

```text
HTB{y0u_kn0w_1t_1s_c4ll3d_0n3_t1m3_s1gn4tur3_f0r_4_r34s0n_ca8d70b76135071df8f69add10fecf76}
```
