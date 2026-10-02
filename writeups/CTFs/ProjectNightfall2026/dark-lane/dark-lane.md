# Dark Lane

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Unknown
OS: Multi-platform
Category: OSINT
Tags: OSINT, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

This one had a much better paper trail. The briefing named **MV STORMRIDER**, IMO `9512098`, as the target vessel. It went dark on March 5 at 19:42 UTC and reappeared on March 8 at 18:51 UTC.

The useful lead was an alert for a two-hull cluster during that gap. I took its timestamp, **March 7, 2026 at 03:15 UTC**, into the SAR Detection Log.

The matching entry, `SAR-2026-0307-A`, gave me two pieces of the answer:

| Evidence | Result |
| --- | --- |
| Detection centroid | Latitude `42.1234`, longitude `18.5678` |
| Second hull's active AIS | IMO `9765432`, MV BLACKWATER PRIDE |

The analyst notes described both hulls drifting together for more than 240 minutes in a ship-to-ship transfer pattern. That lined up with the draft changes mentioned in the briefing.

Next came the cable lookup. I checked the route coordinates in the Cable Database. ADRIC-LINK 1 didn't match the point I had, but **VARDA-SUBLINK** did: waypoint 7 was exactly `42.1234, 18.5678`.

That gave me both vessel identifiers, the cable name, and the coordinates in the required order:

```text
HTB{9512098_9765432_VARDA-SUBLINK_42.1234_18.5678}
```

The timestamp was the key pivot. It narrowed the SAR search to one encounter, and that encounter supplied the location for the cable search.
