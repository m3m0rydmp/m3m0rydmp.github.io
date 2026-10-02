# Once or Nothing

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Very Easy
OS: Multi-platform
Category: Crypto
Tags: Crypto, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

The [gateway](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/crypto/crypto_once_or_nothing/src/main.rs) used pairs of secret values, one pair per bit. A token revealed either the zero-secret or the one-secret for each position. Verification hashed those values and compared them with public commitments.

The message itself wasn't hashed first. It was padded to 32 bytes and interpreted directly as 256 bits. The same key also remained available for repeated token requests.

That made two inputs enough:

```python
zero_message = bytes(32)
one_message = bytes([255]) * 32
```

The first token exposed every zero-secret. The second exposed every one-secret. Neither input contained the forbidden target string, `d9_netadmin`.

I could then build the target token one bit at a time, using the target's zero-padded, big-endian representation:

```python
target = b"d9_netadmin".rjust(32, b"\x00")
bits = f"{int.from_bytes(target, 'big'):0256b}"
forged = [token_one[i] if bit == "1" else token_zero[i]
          for i, bit in enumerate(bits)]
```

I checked this recombination against all 256 public commitments in a local model. Hashing the secrets was doing its job; exposing both choices under the same key made the forgery possible.

```text
HTB{d0n7_f0rg3t_t0_h4sh_b3f0r3_4nyth1ng_3ls3_f12f0a94537b85c1ec601d07cde09305}
```
