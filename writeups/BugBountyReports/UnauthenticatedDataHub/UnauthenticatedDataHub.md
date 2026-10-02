# Unauthenticated DataHub Access: API Mocks Without Access Control

Platform: Bug Bounty Reports
Bounty platform: Bugcrowd
Severity: P2
Category: Broken Access Control
Tags: DataHub, API Security, Access Control, Security Misconfiguration
Date: 2026-10-01
Added: 2026-10-01

I opened a DataHub dashboard on an in-scope development site and landed straight in the project list. No login. From there, I could browse API mocks and create a hub, an API, and a scene. The controls for managing the test environment were sitting out in the open.

I've kept the company, target details, and reward private. This version is text-only, so there are no PoC screenshots.

## Straight Into the Dashboard

The site was running Macaca DataHub, with several projects already set up. Each project had APIs and scenes: the saved responses an API could return during testing.

I started by looking through those configurations. The interesting part was how much I could do without signing in. The interface had controls to change how the mock endpoints behaved.

## Making Changes Without a Login

My PoC covered creating a hub, adding an API, and creating a scene under it. All of that worked without authentication.

I reported full CRUD access: reading, creating, updating, and deleting mock configurations. The exposed controls also included response editing, scene deletion, proxy-mode toggles, and proxy destinations. I haven't included a request log for every operation here; the creation sequence is the part described step by step in the original PoC.

That's the broken access control issue. Someone reaching the dashboard could get access to functionality meant for the developers managing those mocks.

## What Was in the Responses?

Some scene responses contained email, name, and environment-information fields. The request looked like this, with the real identifier removed:

```text
GET /api/scene?interfaceUniqId=<redacted-interface-id>
```

I don't know whether those names and email addresses were real or test fixtures, so I'm not calling this a customer-data breach. The configurations still exposed details about the services being tested and how they were connected.

## Why This Was Worth Reporting

Mock data still drives real tests. Changing a response from success to an error, removing a field, or deleting a scene could leave a developer chasing a failure caused by someone else's changes. A mock that returns the wrong result could also give a test a misleading pass.

That was the main impact I focused on: unauthorized changes to the test environment, plus access to the data in its configurations. I didn't document an outage or a production compromise.

The proxy controls were worth flagging too. Being able to set a destination raises questions about what the service can reach. I didn't confirm SSRF or access to an internal host, though, so those stayed outside the demonstrated impact.

## The Short PoC

1. I opened the in-scope dashboard without signing in.
2. The existing projects and mock configurations were visible.
3. I created a hub, an API, and a scene through the interface.
4. I checked scene responses and found the fields described above.
5. I submitted the access-control issue through Bugcrowd.

The target addresses and original record IDs are left out of this walkthrough.

## What I'd Fix

I'd put authentication in front of both the dashboard and its API, then check permissions on every read and write operation. Protecting the page wouldn't help if the same actions were still available through direct API requests.

I'd also restrict proxy destinations, check fixtures for real personal data or secrets, and review configuration changes for anything unexpected. Read-only access and configuration management should be separate permissions.

Those are my recommendations; I haven't verified a fix.

## How It Ended

The program accepted the report as **P2 — High**. The status in my submission record was still **unresolved**, so acceptance doesn't mean the issue has been fixed.

This was a useful reminder to spend time on development tools during an assessment. A mock dashboard can look pretty harmless until the same interface lets an unauthenticated visitor change what the tests rely on.
