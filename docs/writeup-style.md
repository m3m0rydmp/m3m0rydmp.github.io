# Writeup editing guide

Write each walkthrough in first-person singular: **I**, **me**, and **my**. Describe the action, its result, and why it led to the next step. Use past tense for a recorded run and conditional language for untested possibilities.

Keep the voice casual and direct, like explaining a find to another hacker. Contractions are fine. Vary sentence openings instead of starting every line with "I", and cut filler such as "I proceeded to" or repeated editorial notes about the source. Keep useful uncertainty in a short, plain sentence. Do not add invented reactions, jokes, successful tests, or claims just to make a story livelier. Respect the author's deletions when revising a draft.

For CTF events, create an event library under `writeups/CTFs/<Event>/<Event>.md`, with `Platform: CTFs` and `Type: event`. Put each challenge in `<Event>/<challenge>/<challenge>.md`, with `Event: <parent-slug>`, its category and difficulty, and `Coverage: Solve note` for brief incomplete notes. The CTF library lists the event; its page offers challenge cards, category filters, search, and sorting. Event background and shared verification notes stay in the parent's collapsible section. Keep recorded flags exact. Attribute external descriptions and pin source links to a commit when rebuilding an explanation from saved code. A saved flag proves only what the notes record; do not invent a missing solve trail. Distinguish local checks from a replay of the original challenge. Leave temporary instances, wallet keys, cookies, and unrelated unsolved challenges out of the import.

Preserve commands, captured output, account names on the target, and attributed quotations. Use `m3m0rydmp` for the author's local username and `/home/m3m0rydmp` for the author's home directory. Do not silently turn a hypothesis, scanner finding, or missing step into a claimed successful exploit.

Put new HTB notes in `writeups/HackTheBox/<Machine>/<Machine>.md`, with their referenced images in the same folder. Convert Obsidian embeds to ordinary Markdown, for example `![Login page](image-01.png)`. Image names and links must match exactly, including case, for GitHub Pages. Keep the original vault unchanged when importing.

Start with the title, metadata, and a short summary:

```markdown
# Machine

Difficulty: Easy
OS: Linux
Category: Offensive
Date: 2026-09-30
Added: 2026-10-01

I followed ...

## Enumeration
```

Keep `Date` explicit as the walkthrough date, and `Added` as the date it first joined the site. Recently added is the default category order, independent of the walkthrough date. If `Added` is absent, generation preserves the catalog's existing added date, or stamps a genuinely new entry once. Committing the regenerated catalog preserves that automatic timestamp. Grammar edits do not bump entries to the top. Each category also supports name, difficulty, and writeup-date sorting in either direction; unknown values remain last.

Use the recorded walkthrough date where available; do not invent a completion date. If difficulty is unverified, use `Unknown`. Mark incomplete titles with `(Unfinished Writeup)` and explain exactly where the notes stop. Do not invent a successful foothold or flag retrieval.

For an explicit request to place an archival import last, add `Default position: bottom` alongside its metadata. This overrides only the default Recently added / Descending order. Other sorting choices still use the real dates, name, and difficulty. Titanic uses this exception; ordinary new imports continue to appear first.

Run `npm run check:writeups` before building. It checks narrative pronouns, the old author alias, unresolved Obsidian image embeds, missing local images, and unclosed code fences. It skips verbatim quotations and code when checking narrative voice, and cannot inspect encrypted content or text inside screenshots. Human grammar and technical review are still required.

`npm run sync:writeups` regenerates the catalog, search index, and copied public assets. Those are derived files; edit the source Markdown instead. `npm run build` checks and regenerates content before compiling. Test the result locally, including direct writeup URLs, platform search, desktop/mobile layouts, and image loading, before deployment.

The full-text search index is generated at `public/writeups-search.json` and fetched as JSON. This keeps walkthrough commands and exploit examples out of executable JavaScript bundles; search results render as escaped React text. Antivirus tools may still flag security-training material, so investigate individual detections instead of excluding the whole repository.

The production domain is `m3m0rydmp.net`, served by GitHub Pages behind Cloudflare. Keep `public/CNAME` in the build so a Pages deployment retains the custom domain. Local testing does not require changing Cloudflare or publishing the build.

For anonymized bug bounty articles, use `writeups/BugBountyReports/<Topic>/<Topic>.md` and `Platform: Bug Bounty Reports`. Keep company and program names, target domains, internal service names, submission IDs, personal data, collaborator details, and rewards out of the Markdown and filenames; generation also copies prose into the public search index. Use relative endpoint examples with redacted identifiers when useful. Omit unavailable PoC images entirely. Separate reported observations from possible impact, and never equate acceptance with remediation.

Reports use `Bounty platform: Bugcrowd`, `Severity: P2`, and `Category: Broken Access Control` instead of machine difficulty/OS fields. Platform badges use brand-inspired colors; priority P1–P5 and named severities Critical, High, Medium, Low, Informational share red, orange, yellow, green, and blue highlights. Category colors distinguish vulnerability families, not risk levels. Bugcrowd, HackerOne, YesWeHack, Intigriti, and HackenProof have platform accents; unknown values use a neutral fallback. The listing's Severity sort runs from informational to critical in ascending order. Priority labels follow [Bugcrowd's scale](https://www.bugcrowd.com/glossary/vulnerability-priority/); its [archived design tokens](https://archive.bugcrowd.design/sassdoc/) inform the priority hues. Colors are lightened for the site's dark theme.
