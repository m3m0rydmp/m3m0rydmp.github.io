# Relay

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Easy
OS: Multi-platform
Category: Pwn
Tags: Pwn, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

I checked the Relay and Flashpoint binaries statically alongside the saved payloads. These offsets belong to the supplied builds; I haven't run their old remote instances again.

The [binary and script](https://github.com/m3m0rydmp/temp-repo-htb-ctf/tree/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/pwn/relay) target 32-bit, big-endian MIPS. The saved login is `OPERATOR` / `DAYSHIFT`, and both strings are present in the binary.

The useful bug is in `cmd_remarks`. Its input starts at offset `0x30` in the station structure, but the read allows `0x200` bytes. The diagnostics callback lives at offset `0x70`.

```text
0x70 - 0x30 = 0x40 = 64 bytes
```

I only needed 64 bytes of padding before the replacement callback. The symbol table places `dump_station_keys` at `0x00400d9c`:

```python
import struct
payload = b"A" * 64 + struct.pack(">I", 0x00400d9c)
```

The big-endian encoding matters. After sending that payload through `remarks`, the saved script runs `diag`. Disassembly shows `cmd_diag` loading the pointer from offset `0x70` and calling it indirectly. With the overwrite in place, that points to the existing key-dump function.

This was a callback overwrite inside a structure. I didn't need to build a shellcode payload or overwrite a saved return address.

```text
HTB{r3l4y_k3ys_3xf1ltr4t3d_v14_d14g_0v3rfl0w}
```
