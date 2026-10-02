# Project Nightfall: 18 Solves

Platform: CTFs
Difficulty: Mixed
OS: Multi-platform
Category: Jeopardy
Tags: OSINT, Coding, Crypto, Pwn, Blockchain, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Type: event

I finished 18 challenges across five categories in HTB's **Global Cyber Skills Benchmark CTF 2026: Project Nightfall**. My notes were mostly flags, with a couple of detailed OSINT trails. Coming back to the saved code gave me enough to explain the other solves without trying to remember every terminal command.

The flags in these pages come from my solve list. The technical breakdowns use [my source archive](https://github.com/m3m0rydmp/temp-repo-htb-ctf/tree/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9).

The [event](https://ctf.hackthebox.com/event/details/global-cyber-skills-benchmark-ctf-2026-project-nightfall-3296) ran in May 2026. The date on this page is when I put the writeup together.

## What I Could Check After the Event

| Part | Check |
| --- | --- |
| All five Coding solvers | 500 generated comparisons against independent small-input solutions |
| Once or Nothing | Token recombination against 256 commitments in a local model |
| Twice or Nothing | SHA-256 coverage recomputed for all six saved messages |
| Pow Pow | 100 algebraic nonce checks and short-message recovery |
| Relay and Flashpoint | ELF architecture, symbols, callback paths, offsets, and payload encoding |
| Unverified Patch | Saved solve notes, packet construction, config, and flag-planter behavior reviewed |
| Isochronal Scramble and Grant Registry | Source review; no new SageMath or validator replay |
| OSINT | Original flags and notes, plus screenshot checks; no live replay |

The biggest lesson from writing this up was to keep the boring details: input limits, output format, packet byte order, and the exact code that ran. Those details caught several differences between a plausible explanation and the solve I actually saved.
