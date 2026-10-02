# Pow Pow

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Medium
OS: Multi-platform
Category: Crypto
Tags: Crypto, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

The [ledger](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/crypto/crypto_pow_pow/server.py) asked for 100 accepted blocks within 30 seconds. Its proof-of-work condition wanted 50 leading zero bits, but the function called a hash was just:

```text
H(m) = (a * integer(m) + b) mod n
```

The server disclosed `a`, `b`, and `n`. Since `n` was prime and `a` was nonzero modulo `n`, I could invert `a`.

The nonce was exactly 32 bytes, appended after the previous ledger value and transaction data. Calling that prefix integer `P`, the full input integer was `P * 2^256 + nonce`. I chose a nonce that made the result **zero**:

```python
inverse_a = pow(a, -1, n)
nonce = (-prefix_integer * (1 << 256) - b * inverse_a) % n
nonce_bytes = nonce.to_bytes(32, "big")
```

Zero satisfies the leading-zero check. There was no need to search a 50-bit space. After each accepted block, the saved solver updated the ledger state and repeated the calculation for the next batch.

The response at the end was the same affine function applied to the flag. I inverted that too:

```python
flag_integer = (inverse_a * (flag_hash - b)) % n
```

That recovers the original integer when the flag is smaller than `n`, as this saved flag is. A longer message would only be recovered modulo `n`.

I tested 100 nonce calculations locally and each produced zero. One practical weakness in my old socket script is its fixed 213-byte transaction parser; I'd parse the actual message boundaries if adapting it. Padding the nonce to all 32 bytes is essential.

```text
HTB{50wing_7h3_s33d5_0f_my_pow}
```
