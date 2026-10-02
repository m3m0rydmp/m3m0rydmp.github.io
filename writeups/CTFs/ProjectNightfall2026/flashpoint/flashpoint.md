# Flashpoint

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Medium
OS: Multi-platform
Category: Pwn
Tags: Pwn, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

I checked the Relay and Flashpoint binaries statically alongside the saved payloads. These offsets belong to the supplied builds; I haven't run their old remote instances again.

This [firmware updater](https://github.com/m3m0rydmp/temp-repo-htb-ctf/tree/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/pwn/flashpoint) runs as ARM Cortex-M3 firmware under QEMU. The memory map puts the upload buffer at `0x20008000`, with a capacity of `0x1e0` bytes. The update context begins immediately afterward at `0x200081e0`.

The saved exploit has an outdated comment naming a different context base. I followed `memory_map.h`, the actual payload offsets, and the disassembly instead.

The upload handler copies the supplied chunk beyond the intended buffer. That reaches fields used by the later verification command:

| Offset from upload buffer | Value written | Purpose |
| --- | --- | --- |
| `0x1e0` | `0x00018000` | First callback argument: address of the embedded flag |
| `0x1f0` | `1` | Nonzero update state |
| `0x1f4` | `0x000000a1` | Callback pointer to `uart_puts` |

The Docker launcher loads the flag at `0x18000`, and the binary's symbol table confirms `uart_puts` at `0xa1`. The low bit is the Thumb-state bit.

```python
data = bytearray(0x1fc)
struct.pack_into("<I", data, 0x1e0, 0x18000)
struct.pack_into("<I", data, 0x1f0, 1)
struct.pack_into("<I", data, 0x1f4, 0xa1)
body = struct.pack(">HH", 0, 1) + data
```

The protocol uses big-endian 16-bit header fields, while the overwritten ARM values are little-endian. The body is exactly 512 bytes: four bytes of upload fields plus `0x1fc` bytes of data.

The saved sequence sends an `NFWU` upload packet with command `0x02`, then a verify packet with command `0x03`. In `handle_verify`, the firmware loads the first argument and callback from those overwritten fields and branches to the callback. That makes verification print the embedded flag through UART.

```text
HTB{th3_upd4t3r_1s_th3_w34p0n_0x00018000}
```
