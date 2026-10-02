# Isochronal Scramble

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Unknown
OS: Multi-platform
Category: Crypto
Tags: Crypto, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

I couldn't recover a difficulty label for this one. The [server](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/crypto/crypto_isochronal_scramble/server.py) let me choose an elliptic curve over `GF(p^2)`, with `p = 2^49 * 3^36 - 1`. It checked that the curve was supersingular, then required:

```text
CGL_hash(chosen_curve, credential) == credential
```

The hash walked through 2-isogenies according to the credential's bits, took the final curve's j-invariant, and SHA-256-hashed its string representation.

My [saved solver](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/crypto/crypto_isochronal_scramble/solve.py) worked backward. It picked a candidate final curve first, computed the credential from its j-invariant, then tried to reconstruct a starting curve whose bit-directed walk would end there.

That changes the problem. The SHA-256 output is known before constructing the start point; I don't need to find a fixed point of SHA-256 itself.

The reverse step in the code uses the current coefficient `A` and selected torsion root `alpha` to find possible predecessors:

```python
D = -3 * alpha**2 - 4 * A
S = D.sqrt()
candidates = [(-alpha + S) / 2, (-alpha - S) / 2]
```

It tests which candidate matches the bit-dependent selection rule, recovers the previous curve state, and backtracks. At the first bit, it checks that the reconstructed starting curve would select the required root.

The submitted credential is a 64-character hex string. The server walks over its **ASCII bytes**, so that means 512 input bits, not the 256 bits obtained by hex-decoding it. The exact ordering of field elements and string formatting of the j-invariant matter too.

The archive includes a concrete coefficient tuple and credential in `get_flag.py`, and my notes contain the flag below. I haven't rerun the SageMath search or validated that tuple through the original service during this writeup. This section explains the saved backward-search approach, rather than presenting a fresh replay.

```text
HTB{0n_y0ur_w4y_t0_b3c0m3_4_CGL_h4sh_cr4ck3r_4bd32713a7bc38bb9f20551a83e59282}
```
