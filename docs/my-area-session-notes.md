# My Area — Session Notes & Handoff
**Session date:** July 20, 2026  
**Status:** Planning phase — do NOT start coding yet, pending approval from Gabe / Aran / Michael

---

## What we did today

### 1. Drive setup (completed)
- My Passport external drive is FAT32 (MBR) — incompatible with npm node_modules (no symlink support)
- Created a 160 GB APFS sparse bundle at `/Volumes/My Passport/Dev.sparsebundle`, mounts as `/Volumes/Dev`
- Moved all three projects into it: `kom-usa-redesign`, `hcp-lead-import`, `mann-law-modernization`
- Updated symlinks in `~/Downloads/Symlinks/` to point to `/Volumes/Dev/`
- Installed node_modules fresh on APFS for `kom-usa-redesign/site/`
- Set up LaunchAgent at `~/Library/LaunchAgents/com.user.mount-dev-bundle.plist` to auto-mount the sparse bundle when the drive is plugged in (script at `~/.local/bin/mount-dev-bundle.sh`)
- Dev server confirmed working at `http://localhost:4321` (IPv6 only — browser handles this fine)

### 2. My Area planning (main task)
Produced a thorough technical plan at:
```
/Volumes/Dev/kom-usa-redesign/docs/my-area-plan.md
```
This document is the source of truth for all planning decisions. It is actively being edited — always re-read before touching it.

### 3. Live HCP API testing (completed)
Used `/Volumes/Dev/hcp-lead-import/.env` (contains the real HCP API key) and Python scripts in that repo to verify real API behavior. Key findings incorporated into the plan:
- `?q=` search is fuzzy/substring — exact-match filter required in function (verified with `paulbeck.com` test)
- No `line_items` field exists — use `description` field instead
- `work_status` values in real KOM USA data: `"complete unrated"` (419 jobs), `"pro canceled"` (1 job)
- Default page_size is 10 — function must set `page_size=100`
- `description` field quality is inconsistent — internal labels like `"Services, Misc Sales"` not client-friendly
- Busiest customer has 7 jobs — pagination not urgent but documented
- `completed_at` in `work_timestamps` is the reliable date field (not `schedule.scheduled_start`)

### 4. Senior engineer review (completed)
Reviewed the plan critically and resolved/addressed the following concerns:

| Concern | Status |
|---|---|
| Netlify Identity deprecated? | RESOLVED — reversed Feb 2026, unlimited users, safe to use |
| HCP `?q=` fuzzy search | FIXED — exact-match filter added to function code |
| No timeout on HCP calls | FIXED — 8s AbortController added |
| TypeScript `any` types | FIXED — real types defined from live API data |
| User limit (was 1,000) | RESOLVED — now unlimited on all plans |
| `work_status` values | VERIFIED — normaliseStatus() handles all real values |
| Pagination | FIXED — page_size=100 in function, documented |
| Description quality | DOCUMENTED — flagged for Aran as Q6 |
| HCP migration risk | ADDRESSED — toJob() translation layer isolates HCP, healthcheck function added |
| Testing | ADDED — hcp-history.test.ts in Phase 1 scope |
| Dev time estimate | UPDATED — 4–5 working days (based on 3.5 hrs productive/day) |
| Sitemap | DOCUMENTED — /my-account excluded in astro.config.mjs when building |
| Package name | UPDATED — use `@netlify/identity` not `netlify-identity-widget` |

---

## Three concerns still to discuss

These were identified but NOT yet resolved or documented in the plan. Resume here next session.

### Concern 1 — JWT stored in localStorage (security decision)
`@netlify/identity` stores the JWT in `localStorage` by default. localStorage is readable by any JS on the page (XSS risk). The safer alternative is `httpOnly` cookies (invisible to JS entirely).

**The tradeoff:**
- Astro auto-escapes output → XSS surface is minimal
- Data shown (job history) is low-sensitivity
- Most auth libraries make this same tradeoff
- Moving to httpOnly cookies requires more complex setup

**This needs a call before writing auth code.** Options: accept localStorage, or use `gotrue-js` directly with cookie storage.

### Concern 3 — Rate limiting
No rate limiting on `/api/my-account/history`. A valid JWT could hammer the HCP API. Options:
- Simple in-memory per-user counter (10 req/min) in the function
- Netlify native rate limiting (paid plan feature)

Not urgent given current scale but needs to be on the implementation checklist.

### Concern 4 — Local dev story for Netlify Identity
`/.netlify/identity` only exists on a deployed Netlify site, not on `localhost:4321`. Dev workflow needs `netlify dev` (Netlify's local proxy) set up and documented before building starts. Without it, every auth change requires a deploy to the preview URL to test.

**Action needed:** Document the `netlify dev` setup steps and add to the plan.

---

## Current state of the plan document

`/Volumes/Dev/kom-usa-redesign/docs/my-area-plan.md` — comprehensive, ~700 lines. Sections:
1. What we're building
2. How it works (client perspective)
3. Current site architecture + Sanity CMS note
4. Authentication — Netlify Identity (with GoTrue escape hatch, unlimited users note)
5. Site output mode — hybrid (exact config changes shown)
6. House Call Pro API (verified response shapes, pagination, description quality table)
7. New Netlify Function — hcp-history (full TS code with real types, toJob() layer, exact-match fix, timeout, page_size=100)
8. New page — /my-account (5 UI states)
9. Header changes
10. Environment variables
11. Security considerations (JWT, bcrypt explanation, HCP key server-side, healthcheck)
12. What does NOT change
13. Phase breakdown (Phase 1 file table with tests + healthcheck, 4–5 day estimate)
14. Questions for Gabe (4 questions)
15. Questions for Aran (6 questions including description quality and HCP plan commitment)

---

## Key facts to remember

- HCP API key is in `/Volumes/Dev/hcp-lead-import/.env` — use this for any further API testing
- KOM USA is on HCP MAX plan (required for API access) — may not stay on it forever
- ~500 actual serviced customers, 420 jobs total in HCP
- Site is currently `output: 'static'` — switching to `output: 'hybrid'` is a Gabe validation item
- `@astrojs/netlify` is already in package.json but not wired up in astro.config.mjs
- Dev server runs at `http://localhost:4321` (IPv6 — works in browser, not `curl http://127.0.0.1`)
- Netlify free tier credits: ~117.6 of 300 remaining as of July 14, expiring July 23, 2026 — this may have changed
- `coming-soon` branch is production, `main` is preview only — do not touch coming-soon
