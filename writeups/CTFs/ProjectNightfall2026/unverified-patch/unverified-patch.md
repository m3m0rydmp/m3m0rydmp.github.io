# Unverified Patch

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

The [saved notes and subscriber](https://github.com/m3m0rydmp/temp-repo-htb-ctf/tree/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/pwn/pwn_unverified_patch) show a much shorter route than the topic-alias memory-corruption technique described in the external writeup.

The broker rejected a subscription to `#`, the multi-level MQTT wildcard. My saved solve used `+` instead.

The flag planter published a retained message to a UUID topic with no `/` separators. That is a single topic level, which `+` matches. Blocking one wildcard hadn't blocked access to the retained flag message.

The subscriber builds this MQTT v5 SUBSCRIBE packet after connecting:

```python
import struct
topic = b"+"
topic_filter = struct.pack("!H", len(topic)) + topic + b"\x00"
variable_header = b"\x00\x01\x00"
body = variable_header + topic_filter
packet = b"\x82" + bytes([len(body)]) + body
```

The short remaining-length encoding is sufficient for this tiny packet; it isn't a general MQTT variable-length encoder. The final byte in the filter requests QoS 0 with default subscription options.

My archived solve notes record this working locally and remotely. The copy of `flag_planter.py` in the archive now has a misindented `topic = ...` line, so it would need that indentation fixed before a fresh local deployment. I didn't treat it as a ready-to-run environment.

The flag mentions topic aliases, but my recorded route doesn't demonstrate an alias out-of-bounds exploit. The wildcard bypass was enough.

```text
HTB{t0p1c_4l1as_0ut_0f_b0und5}
```
