# Phantom Echo

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Unknown
OS: Multi-platform
Category: OSINT
Tags: OSINT, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

## Challenge

The task was to investigate a spoofed `KOR1337` broadcast and recover its real identity. The briefing places the claimed aircraft elsewhere. The leaked fragment gives `7C2D62`: XOR each byte with `0x37` to get `4B1A55`, then pair it with `D9-SIGINT-WING`.

The screenshot mixes AGL and AMSL altitude references; that terrain comparison alone doesn't establish a collision.

## Flag

```text
HTB{KOR1337_4B1A55_D9-SIGINT-WING}
```
