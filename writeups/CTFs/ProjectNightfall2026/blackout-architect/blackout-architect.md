# Blackout Architect

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Unknown
OS: Multi-platform
Category: OSINT
Tags: OSINT, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

My next trail started with the dossier `TFN-NF-2026-0314`. It followed container `KORV1488221` through an air drop and ship-to-ship transfers to the Port of Vargstad. An authorized field-service vendor collected it from there.

The dossier gave me a specific ownership pattern to look for: two layers of shell ownership, ending at someone marked on the scenario's 2024 sanctions list.

The procurement memo listed four authorized vendors. Three were independent. **Trusted Grid Solutions LLC** was the one with a parent company, **Meridian Industrial Holdings**, registered in the Marshall Islands. That made it the first candidate worth checking, rather than proof on its own.

The Corporate Registry filled in the chain:

```text
Trusted Grid Solutions LLC
    -> Meridian Industrial Holdings
        -> Victor Kosev
```

Kosev's challenge profile carried the sanctions and intelligence-link warning described in the dossier. The same filing connected the vendor to contract `CDR-9988-VST`.

With the ownership trail and contract lined up, I had the two fields the flag needed:

```text
HTB{CDR-9988-VST_TRUSTED-GRID-SOLUTIONS-LLC}
```
