# Pterodactyl (Unfinished Writeup)

Difficulty: Medium
OS: Linux
Category: Offensive
Date: 2026-09-30
Added: 2026-10-01

![Pterodactyl machine avatar](pterodactyl.png)

These are still **unfinished notes**. I've got some configuration values, account details, and a lead to follow, but I'm missing the steps that connect them. There's no complete path to either flag yet.

## Recorded Configuration

I saved these database and Redis settings, but didn't note which file they came from or how I accessed it.

```ini
DB_PORT = 3306
DB_PASSWORD = PteraPanel
DB_USERNAME = pterodactyl
DB_HOST = 127.0.0.1
REDIS_PORT = 6379
REDIS_PASSWORD = null
REDIS_HOST = 127.0.0.1
```

## Recorded Account Details

I recorded this credential pair, without a corresponding authentication result:

```text
phileasfogg3:!QAZ2wsx
```

I also saved these account rows. The column names are missing, so I can't confidently label every field.

```text
2       headmonitor     headmonitor@pterodactyl.htb     1       $2y$10$3WJht3/5GOQmOXdljPbAJet2C6tHP4QoORy1PSj59qJrU0gdX5gD2
3       phileasfogg3    phileasfogg3@pterodactyl.htb    0       $2y$10$PwO0TBZA8hLB6nuSsxRqoOuXuGi3I4AVVN2IgE7mZJLzky1vGC9Pi

```

## Unverified Privilege-Escalation Lead

I noted openSUSE Leap 15.6 as a possible environment to investigate, but I didn't preserve the OS-identification output or confirm an applicable vulnerability. I need that evidence before connecting a particular CVE to this machine.

The last command in my notes creates a 300 MiB file filled with zero bytes:

```bash
dd if=/dev/zero of=xfs.image bs=1M count=300
```

Despite the filename, this command alone does not create an XFS filesystem or extract a disk. I didn't record a formatting command, a mount operation, or an exploitation result after it.

## Remaining Work

I still need to document initial enumeration, the source of the recorded credentials, a confirmed foothold, and any privilege-escalation results before this can become a reproducible walkthrough.
