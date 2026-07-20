# "My Area" Client Portal — Technical Plan

**Prepared by:** Ovidiu Marina  
**Date:** July 20, 2026  
**For review by:** Gabe (architecture validation), Aran Segal (scope approval), Michael (final approval)

---

## Table of contents

1. [What we're building](#1-what-were-building)
2. [How it works from the client's perspective](#2-how-it-works-from-the-clients-perspective)
3. [Current site architecture and what changes](#3-current-site-architecture-and-what-changes)
4. [Authentication — Netlify Identity](#4-authentication--netlify-identity)
5. [Site output mode — adding the Netlify adapter](#5-site-output-mode--adding-the-netlify-adapter)
6. [House Call Pro API](#6-house-call-pro-api)
7. [New Netlify Function — hcp-history](#7-new-netlify-function--hcp-history)
8. [New page — /my-account](#8-new-page--my-account)
9. [Header changes](#9-header-changes)
10. [Environment variables](#10-environment-variables)
11. [Security considerations](#11-security-considerations)
12. [What does NOT change](#12-what-does-not-change)
13. [Phase breakdown](#13-phase-breakdown)
14. [Questions for Gabe](#14-questions-for-gabe)
15. [Questions for Aran](#15-questions-for-aran)
16. [Questions for Michael](#16-questions-for-michael)
17. [Questions for House Call Pro call](#17-questions-for-house-call-pro-call)
18. [Local development setup](#18-local-development-setup)

---

## 1. What we're building

A password-protected "My Area" section on kom-usa.com. Clients create an account or log in, and see a list of all maintenance and service jobs that KOM USA has completed for them, pulled in real-time from the House Call Pro system (the job management software KOM USA already uses internally).

A later phase extends this to property-based history: a client can register an address (say, a building they manage) and see all jobs ever performed at that address, even across different service requests. This is especially valuable for property managers who take over a building and need to understand its maintenance history.

This document covers Phase 1 only: account login and personal job history.

### Core design principle: platform independence

House Call Pro is the current data source — it is not intended to be a permanent dependency. KOM USA plans to eventually move away from HCP, whether to a different field service platform or a system built in-house. Every technical decision in this plan is made with that migration in mind.

The portal itself — the client accounts, the login system, the `/my-account` page, the header link, all UI components — knows nothing about House Call Pro. Job data flows through a single translation layer inside one server function (`hcp-history.mts`), and that is the only place in the entire codebase that touches HCP directly.

When the platform changes, the migration is: rewrite that one function and swap one environment variable. Nothing else changes. This is not an aspiration — it is a hard architectural constraint that shapes every decision below.

---

## 2. How it works from the client's perspective

1. A "My Account" link appears in the navigation header.
2. The client clicks it and arrives at `/my-account`.
3. If not logged in, they see a login/sign-up form.
   - They enter their email and a password they choose.
   - If first time, they get a confirmation email and click the link to verify.
4. After logging in, the page shows their job history:
   - Each row shows the date, service type(s), job address, and current status.
   - The most recent job appears first.
5. They can log out.
6. Their data is matched by email address: the email they use to log in is looked up in House Call Pro, and the jobs associated with that customer record are shown.

---

## 3. Current site architecture and what changes

### What the site currently is

The site is an **Astro 7 static site** (`output: 'static'`). This means:
- At build time, Astro pre-builds every page into a plain HTML file.
- When a visitor loads a page, they are served a static file from Netlify's CDN — there is no server involved at that moment.
- Dynamic server-side behavior happens only in Netlify Functions (the Brevo form handler and the Google Reviews function). These are separate from Astro and run independently.

This architecture is fast, cheap, and simple. It works perfectly for a marketing site. The problem is that a "My Account" page is inherently personal — it shows different content for every visitor — so it cannot be a static file.

### A note on Sanity CMS

Sanity is the content management system wired into this site. The Studio (the editor UI for managing content) lives in `studio/` and the Sanity project ID is `eg4720mv`. The site has Sanity client code set up and the routes for blog posts, projects, services, and locations are all designed to pull from Sanity.

However, the site also has **code-owned fallbacks** for most critical content — FAQs, business info, service lists — meaning those sections render from hardcoded data in `src/data/` if Sanity is empty or unreachable. So the site works and builds correctly regardless of how much content has actually been entered into Sanity.

How much content is currently live in Sanity is an open question — Gabe would know. This does not affect the My Area feature (which has no Sanity dependency), but it is worth understanding before the full site launches.

### What needs to change for My Area

Two things change. First, we wire up the **Netlify adapter** in `astro.config.mjs` — this lets individual pages opt into server-side rendering while everything else stays static, with no change to the output mode. Second, we add **Netlify Identity** for authentication and a **new Netlify Function** to proxy the House Call Pro API.

Everything else — every existing page, the Sanity CMS integration, the Brevo form handler, the Google Reviews function, the header and footer, all styling — stays exactly as-is.

---

## 4. Authentication — Netlify Identity

### What Netlify Identity is

Netlify Identity is an authentication service that comes built into every Netlify account. It handles user sign-up, email confirmation, login, password reset, and session management. We do not pay extra for it — Netlify Identity includes unlimited users on all plans as of February 2026. We do not need to build or run our own auth server.

Internally, Netlify Identity runs a service called **GoTrue** at the path `/.netlify/identity` on the site's own domain. So for KOM USA, it lives at `https://kom-usa.com/.netlify/identity`.

### How login works step by step

1. We add a small JavaScript library (`@netlify/identity`) to the `/my-account` page.
2. The user enters their email and password into the widget.
3. The widget sends the credentials to `https://kom-usa.com/.netlify/identity/token`.
4. If correct, Netlify Identity returns a **JWT** (JSON Web Token) — a cryptographically signed string that proves the user is who they say they are.
5. The widget stores this JWT in the browser's `localStorage`.
6. We read the JWT from localStorage and include it in requests to our own Netlify Function.
7. Our function verifies the JWT before doing anything with it.

### What a JWT is

A JWT is a string in three parts separated by dots: `header.payload.signature`. The payload (middle part) contains claims — facts about the user — and looks like this when decoded:

```json
{
  "sub": "abc123",
  "email": "john@example.com",
  "exp": 1753100000,
  "role": ""
}
```

`sub` is a unique user ID. `email` is what we use to match the client to their House Call Pro record. `exp` is a Unix timestamp after which the token is expired and must be refreshed.

### User limit — not a concern

Verified against the current Netlify docs (July 2026): Netlify Identity now includes **unlimited active users** on all credit-based plans at no extra cost. The 1,000-user ceiling referenced in earlier planning was from the old pricing structure, prior to Netlify's February 2026 reversal on Identity. There is no user cap to plan around.

The self-hosting escape hatch still applies if KOM USA ever moves off Netlify entirely: Netlify Identity is built on the open-source **GoTrue** project, which can be self-hosted on any server. All accounts and hashed passwords are exportable and go with you.

### Sign-up flow

New clients who have never created a KOM USA account:
1. Click "Sign up" in the widget, enter email + password.
2. They receive a confirmation email from Netlify Identity (we can customize the sender and template).
3. They click the confirmation link, which verifies their email.
4. They are now logged in.

Important: signing up does not automatically create a House Call Pro customer record. The match relies on their email already existing in HCP. If a client signs up with the same email they gave KOM USA when they booked a service, the history will appear immediately. If they use a different email, no history will show (we show a "no records found" message).

### Alternatively: invite-based onboarding

Instead of open sign-up, Netlify Identity also supports sending invite emails. After a job is marked complete in House Call Pro, someone at KOM USA could manually trigger an invite from Netlify (or we could automate it with a webhook later). The client receives an email, sets a password, and their first login already shows their history. This approach prevents clients from creating accounts with the wrong email. It's a better user experience but requires a manual step on KOM USA's end for Phase 1.

This is a decision for Aran (see Section 15).

---

## 5. Site output mode — adding the Netlify adapter

### The change in astro.config.mjs

Currently:

```js
export default defineConfig({
  site: 'https://kom-usa.com',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap(...)],
});
```

After the change:

```js
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://kom-usa.com',
  output: 'static',
  adapter: netlify(),
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap(...)],
});
```

One addition only: `adapter: netlify()`. The `output` line stays `'static'` — no change needed.

**Important correction from planning:** The plan originally called for changing `output` to `'hybrid'`. Verified against the installed Astro 7.0.5 source: `hybrid` is not a valid output mode in Astro 7. The only valid values are `'static'` and `'server'`. The `hybrid` mode was removed in Astro 5 and its behavior is now the default behaviour of `output: 'static'`.

### How per-page SSR works in Astro 7

In `output: 'static'` mode with an adapter installed, pages are prerendered by default. Any individual page can opt into server-side rendering by adding one line at the top:

```ts
export const prerender = false;
```

Our new `/my-account.astro` page will have this line. Every other existing page in `src/pages/` stays exactly as-is — no changes needed, no `prerender` annotation required.

### What the Netlify adapter does

When a page has `export const prerender = false`, the `@astrojs/netlify` adapter converts it into a Netlify Function automatically at build time. The build output includes the usual static files in `dist/` plus a generated function (typically at `.netlify/functions/`) that handles requests for server-rendered routes.

This is the main thing for Gabe to check — whether the generated SSR function from the adapter conflicts with the manually managed `netlify/functions/` directory in `netlify.toml`. It likely does not, because they are in different directories (`.netlify/` vs `netlify/`), but Gabe should verify this against the current build setup.

---

## 6. House Call Pro API

### HCP is a temporary data source — architecture reflects this

KOM USA intends to move away from House Call Pro. This section documents how HCP works today and what we use from it, but the architecture is explicitly built so that HCP can be replaced without touching the portal, the auth system, or any client-facing code.

House Call Pro is only touched in **one place**: the `hcp-history.mts` Netlify Function. Inside that function, a dedicated translation layer (`toJob()`) converts HCP's raw response into a generic job shape before anything else in the codebase sees it. Every other file — the `/my-account` page, the UI components, the auth logic — works with that generic shape and has no knowledge of HCP's field names, API structure, or status values.

When KOM USA moves to a different platform (ServiceTitan, Jobber, an internal system, or anything else with an API), the migration is:
1. Rewrite `hcp-history.mts` to call the new platform's API.
2. Update `toJob()` to map the new platform's fields to the same generic shape.
3. Swap the `HCP_API_KEY` environment variable for the new key.
4. Everything else — auth, UI, all other pages — stays completely untouched.

### API access — current state

KOM USA currently has API access through the **MAX plan**. The API key is held by Ovidiu and was used for the bulk lead import. If KOM USA ever downgrades from MAX, API access is lost and the portal breaks — this is flagged as a question for Michael (Section 16).

### What the HCP API is

House Call Pro has a REST API (version 1). All requests go to `https://api.housecallpro.com/`. Authentication is done with an API key in the request header:

```
Authorization: Token YOUR_HCP_API_KEY
```

The API key is generated from the House Call Pro account settings and never expires (unless regenerated). It must be kept secret and must never appear in browser-visible code.

### The endpoints we use

**Find a customer by email:**

```
GET https://api.housecallpro.com/customers?q=john@example.com&page_size=50
```

Response shape:
```json
{
  "customers": [
    {
      "id": "cus_abc123",
      "first_name": "John",
      "last_name": "Smith",
      "email": "john@example.com",
      "mobile_number": "248-555-0100"
    }
  ],
  "total_count": 1
}
```

If no customer is found, `customers` is an empty array.

**Get jobs for a customer:**

```
GET https://api.housecallpro.com/jobs?customer_id=cus_abc123
```

Response shape — verified against the live KOM USA HCP account:
```json
{
  "id": "job_c30488fea2024139b5914792161770fc",
  "description": "Services, Misc Sales",
  "work_status": "complete unrated",
  "work_timestamps": {
    "on_my_way_at": null,
    "started_at": null,
    "completed_at": "2022-08-16T16:00:00Z"
  },
  "schedule": {
    "scheduled_start": null,
    "scheduled_end": null,
    "appointments": []
  },
  "total_amount": 300000,
  "invoice_number": "1003",
  "address": {
    "street": "107 S 2nd St Suite 300",
    "city": "Philadelphia",
    "state": "PA",
    "zip": "19106"
  },
  "customer": {
    "id": "cus_d9eff4751e9b4adbb6ab9bf4c9e630e6",
    "email": "rafco2626@gmail.com",
    "first_name": null,
    "last_name": null,
    "company": "Rafco Properties"
  }
}
```

**Important corrections from live API testing:**

- **No `line_items` field exists** on either the list or detail endpoint. The plan originally assumed line items would be available — they are not. Service description comes from the `description` field instead.
- **`work_status` values** observed across all 420 real KOM USA jobs: `"complete unrated"` (419 jobs), `"pro canceled"` (1 job). The status badge logic handles both plus any future values via a normalisation function.
- **Date to use is `work_timestamps.completed_at`**, not `schedule.scheduled_start`. The scheduled_start is `null` on many jobs. Completed date is the reliable field.
- **`total_amount` is in cents** — 300000 = $3,000.00. Relevant if Aran decides to show pricing (see Section 15, question 4).
- **Default page_size is 10** — calling `/jobs?customer_id={id}` with no `page_size` param returns only the 10 most recent jobs. The function must explicitly set `page_size=100`. See pagination note below.
- **`description` field quality is inconsistent** — see note below.

### Pagination

The HCP jobs endpoint paginates with a default of 10 per page. Response includes `total_items` and `total_pages`. The function sets `page_size=100` for Phase 1, which safely covers any customer in KOM USA's current account (the busiest customer has 7 jobs). Full pagination should be implemented before the feature scales — the `total_pages` field makes this straightforward to add later.

### Description field quality

Sampled across 50 real KOM USA jobs:

| Count | Value |
|---|---|
| 16 | `"Diagnostics and Estimate."` |
| 15 | `"Services, Misc Sales"` |
| 10 | `"Electric Service"` |
| 2 | `"Installation"` |
| 2 | `"Repair Units"` |
| 1 each | `"Materials - Flooring"`, `"Deposit"`, `"Unit Heater Line"`, `"Install switches"`, `"Electric Service Upgrade"` |

These are internal HCP job category labels, not client-friendly descriptions. `"Services, Misc Sales"` and `"Deposit"` would look confusing to a client. The quality of this field depends on how KOM USA staff enter jobs in HCP — if descriptions are improved going forward, the portal automatically looks better. For now we display what exists and fall back to "Service details unavailable" for null values. This is flagged for Aran (see Section 15, question 5).

### What we show in the UI

From each job we extract:
- **Date:** `work_timestamps.completed_at` formatted as "August 16, 2022"
- **Service:** `description` field — quality varies; see note above
- **Address:** `street`, `city`, `state` from the `address` object
- **Status:** `work_status` normalised to a human-readable badge (`"complete unrated"` → "Completed", `"pro canceled"` → "Cancelled")

### Email matching — reliability assessment

About 7 out of 8 customer records in HCP have correct, matching email addresses. The roughly 1-in-8 records without emails are predominantly leads (people who inquired but were never serviced), not actual customers. Since this feature is for clients who have had work done, the email match rate for the target audience is closer to 95%+. For the small number of actual customers without emails, we show a "no records found" message with instructions to call the office. We can also add a phone-number fallback search in a later iteration if this edge case comes up frequently.

### Edge cases

| Scenario | What we do |
|---|---|
| No HCP customer found for this email | Show "No service history found" with a prompt to request their first service |
| HCP returns multiple customers with same email | Use the first result (most recently created by default in HCP) |
| A job has no `description` | Show the row with "Service details unavailable" |
| A job has no `completed_at` | Show "Date not available" |
| HCP API is unreachable or returns an error | Return an error to the browser; show a friendly message and suggest calling the office |

---

## 7. New Netlify Function — hcp-history

### What this function does

This is a new file at `site/netlify/functions/hcp-history.mts`. It is an HTTP-triggered Netlify Function (the same pattern as `google-reviews.mts`).

The browser calls it at `/api/my-account/history` with the Netlify Identity JWT in the `Authorization` header. The function:

1. Verifies the JWT signature locally using GoTrue's published public key (no network call).
2. Extracts the user's email from the verified token.
3. Checks the per-user rate limit (10 req/min).
4. Calls House Call Pro to find the customer with that email.
5. Calls House Call Pro to get that customer's jobs.
6. Translates the HCP response to a generic job shape via `toJob()` and returns it as JSON.

If any step fails — invalid JWT, no HCP customer, HCP API error — the function returns an appropriate HTTP error code and the UI shows a friendly message.

### Why the function exists (the security reason)

The HCP API key must never be sent to the browser. If it were embedded in JavaScript that runs in the browser, any visitor could copy it and query the HCP API directly — reading all KOM USA customer records.

Instead, the API key lives only in Netlify's environment variables. The function runs on Netlify's servers, makes the HCP API call server-side, and returns only the current user's data to the browser. The browser never sees the HCP API key.

### Approximate function code

```typescript
import { jwtVerify, createRemoteJWKSet } from "jose";
import type { Context } from "@netlify/functions";

// Guard: URL is auto-set by Netlify to the site's own URL. Missing means the function
// was invoked outside netlify dev or a proper Netlify deployment — fail fast with a
// clear message rather than a cryptic URL parse error at request time.
const siteUrl = process.env.URL;
if (!siteUrl) throw new Error("URL env var not set — use netlify dev locally");

// GoTrue public keys — fetched once per function instance, cached automatically by jose.
// createRemoteJWKSet re-fetches only when key rotation causes a verification failure.
const JWKS = createRemoteJWKSet(
  new URL(`${siteUrl}/.netlify/identity/.well-known/jwks.json`)
);

// In-memory rate limiter — 10 requests per user per minute.
// Resets on cold start (acceptable at ~500 users); upgrade to Netlify native
// edge rate limiting when scale justifies a paid plan tier.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(email: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(email);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(email, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// HCP-specific types derived from live API responses.
// No line_items field exists; work_status is a phrase not a keyword.
interface HcpCustomer {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
}

interface HcpJob {
  id: string;
  description: string | null;
  work_status: string;
  work_timestamps: { completed_at: string | null };
  schedule: { scheduled_start: string | null };
  address: { street: string; city: string; state: string; zip: string } | null;
  total_amount: number; // cents
  invoice_number: string | null;
}

// Generic job shape — platform-agnostic. The /my-account page and all UI
// components use this type. Nothing outside hcp-history.mts knows about HCP.
interface Job {
  id: string;
  date: string | null;
  status: string;
  address: { street: string; city: string; state: string; zip: string } | null;
  description: string | null;
}

// work_status values observed across all 420 live KOM USA jobs:
//   419x "complete unrated"
//     1x "pro canceled"
// Handles other values gracefully via fallback.
function normaliseStatus(raw: string): string {
  if (raw.startsWith("complete")) return "Completed";
  if (raw.includes("cancel")) return "Cancelled";
  if (raw === "scheduled") return "Scheduled";
  if (raw === "in_progress") return "In Progress";
  return raw;
}

// Translation layer — the only place in the codebase that knows HCP's field names.
// To migrate to a different platform: rewrite this function and the API calls below.
function toJob(raw: HcpJob): Job {
  return {
    id: raw.id,
    date: raw.work_timestamps?.completed_at ?? null,
    status: normaliseStatus(raw.work_status),
    address: raw.address ?? null,
    description: raw.description ?? null,
  };
}

export default async (request: Request, context: Context) => {
  // Step 1: Get the JWT from the Authorization header.
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const token = authHeader.slice(7);

  // Step 2: Verify the JWT signature locally using GoTrue's public key.
  // No network call — jose verifies cryptographically using the cached JWKS.
  // Trade-off: revocation lag up to 1 hour (acceptable — data is low-sensitivity
  // and we have no use case for instant account suspension).
  let email: string;
  try {
    const { payload } = await jwtVerify(token, JWKS);
    email = payload.email as string;
    if (!email) throw new Error("no email in token");
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  // Step 3: Rate limit — 10 requests per user per minute.
  if (isRateLimited(email)) {
    return new Response("Too many requests", { status: 429 });
  }

  // Step 4: Find the customer in House Call Pro by email.
  // NOTE: HCP's ?q= is a fuzzy substring search, not exact-match — verified
  // against the live account. We must filter the results ourselves.
  // page_size=50: gives enough headroom if many records share a name prefix;
  // 25 risks missing the target if it falls outside the first page of fuzzy results.
  const hcpKey = process.env.HCP_API_KEY;
  if (!hcpKey) return new Response("Server misconfigured — HCP_API_KEY not set", { status: 500 });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const customerRes = await fetch(
    `https://api.housecallpro.com/customers?q=${encodeURIComponent(email)}&page_size=50`,
    { headers: { Authorization: `Token ${hcpKey}` }, signal: controller.signal }
  );
  clearTimeout(timeout);
  if (!customerRes.ok) {
    return new Response("HCP unavailable", { status: 502 });
  }
  const { customers } = await customerRes.json();

  // Exact-match filter — required because ?q= is fuzzy.
  const match = (customers ?? []).find(
    (c: HcpCustomer) => c.email?.toLowerCase() === email.toLowerCase()
  );
  if (!match) {
    return Response.json({ jobs: [] });
  }

  // Step 5: Get the customer's job history.
  // page_size=100: default is 10 — verified against live account. Busiest
  // customer currently has 7 jobs so 100 safely covers all cases for now.
  // sort_by=completed_at&sort_direction=desc: verified against live account —
  // default order is oldest-first. Sort param confirmed on per-customer endpoint.
  const jobsController = new AbortController();
  const jobsTimeout = setTimeout(() => jobsController.abort(), 8000);
  const jobsRes = await fetch(
    `https://api.housecallpro.com/jobs?customer_id=${match.id}&page_size=100&sort_by=completed_at&sort_direction=desc`,
    { headers: { Authorization: `Token ${hcpKey}` }, signal: jobsController.signal }
  );
  clearTimeout(jobsTimeout);
  if (!jobsRes.ok) {
    return new Response("HCP unavailable", { status: 502 });
  }
  const { jobs } = await jobsRes.json();

  // Step 6: Translate HCP response to generic Job shape and return.
  return Response.json({ jobs: (jobs ?? []).map(toJob) });
};

export const config = { path: "/api/my-account/history" };
```

---

## 8. New page — /my-account

### File location

`site/src/pages/my-account.astro`

This is the only new page. It opts into server rendering:

```
export const prerender = false;
```

### UI states the page handles

The page is a shell that loads quickly. Once the Netlify Identity library initializes in the browser (takes under a second), client-side JavaScript takes over and puts the page in one of these states:

**State 1 — Not logged in**
Show a login form with fields for email and password, a "Sign up" option, and a "Forgot password" link. This is provided by the `@netlify/identity` library with minimal custom styling.

**State 2 — Logged in, loading history**
Show the user's name/email at the top, then a skeleton loader (animated placeholder rows) while the browser calls `/api/my-account/history`.

**State 3 — Logged in, has history**
Show a table or card list:

| Date | Services | Address | Status |
|------|----------|---------|--------|
| June 15, 2026 | HVAC Filter Replacement, Duct Inspection | 123 Oak Park Blvd, Oak Park, MI | Completed |
| May 2, 2026 | Chimney Inspection | 456 Maple St, Royal Oak, MI | Completed |

**State 4 — Logged in, no history found**
Show a message: "No service history found for your account. If you've had work done, make sure you're logged in with the same email you provided at booking." With a "Request Service" call to action.

**State 5 — Error loading history**
Show: "We couldn't load your service history right now. Please try again or call us at 248-264-3631." The error is logged to the console for debugging.

### Design

The page uses the existing KOM USA design system — the same `BaseLayout.astro`, same Tailwind classes, same KOM green, same Nunito Sans font. It looks and feels native to the site.

---

## 9. Header changes

The desktop header (`Header.astro`) currently ends with a phone number, a "Request Service" button, and a hamburger for mobile. We add a "My Account" icon-link to the right side of that cluster.

On desktop: a small person icon (we already use `@tabler/icons` throughout the site) with "My Account" text, linking to `/my-account/`. It sits next to the "Request Service" button.

On mobile: a new list item in the mobile menu, in the same style as the other nav items.

This is a minor, self-contained change to `Header.astro`. The `nav` array already defined in that file gets one new entry:

```js
{ label: "My Account", href: "/my-account/" }
```

With a small condition to render a person icon alongside the label.

---

## 10. Environment variables

### New variable needed

| Variable | Where it goes | What it is |
|---|---|---|
| `HCP_API_KEY` | Netlify env vars (not in `.env` commit) | The House Call Pro API key. Held by Ovidiu. Already used for the bulk lead import. Never committed to git. |

### Variables already set or auto-set by Netlify

| Variable | Source | Used by |
|---|---|---|
| `URL` | Auto-set by Netlify to the site URL | The new `hcp-history` function, to build the JWKS endpoint URL for local JWT verification |
| `SANITY_PROJECT_ID` | Already in Netlify env | Existing Sanity integration |
| `BREVO_API_KEY` | Already in Netlify env | Existing form handler |

`HCP_API_KEY` is added in the Netlify dashboard under **Site configuration → Environment variables**. It is also added locally to `site/.env` for development testing (and `.env` is in `.gitignore` so it never gets committed).

---

## 11. Security considerations

### JWT validation is mandatory before touching HCP

The function validates the JWT with Netlify Identity before making any HCP API call. A request with a missing, expired, or forged JWT receives a 401 and the function exits. This means a bad actor cannot call `/api/my-account/history` without a valid logged-in session.

### The HCP API key stays server-side

Only the Netlify Function has the HCP API key. The key lives in Netlify's encrypted environment variable storage. It does not appear in any file committed to git, any build output, or any browser-visible JavaScript.

### Each user only sees their own records

The function extracts the email from the validated JWT — the user cannot pass their own email as a query parameter and be trusted. The email comes from the identity provider (Netlify Identity), not from user input. A logged-in user cannot access another user's records.

### Existing security headers cover the new page

The security headers in `netlify.toml` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) already apply to `/*` — the new `/my-account` page is covered automatically.

### Password handling — detailed

This is a common concern and worth explaining fully.

**KOM USA never stores passwords, sees passwords, or has access to passwords.** Here is the exact flow:

1. The user types their password into the browser.
2. It is sent over **HTTPS** (encrypted in transit — unreadable to anyone intercepting the network) directly to Netlify Identity's servers at `/.netlify/identity/token`.
3. Netlify Identity hashes the password using **bcrypt** — an algorithm designed specifically for password storage. Bcrypt is intentionally slow to compute, which makes brute-force attacks (trying millions of guesses) impractical even if someone stole the database. Only the bcrypt hash is stored. The original password is immediately discarded.
4. Nobody — not Netlify, not KOM USA, not Ovidiu — can ever recover the original password from the stored hash. If a user forgets their password, the only option is a reset (a new password is created; the old one is gone forever).
5. When the user logs in again, they type their password, it gets sent to Netlify, Netlify runs bcrypt on it and compares the result to the stored hash. If the hashes match, login succeeds. The password never goes anywhere else.
6. What comes back to the KOM USA site is only a **JWT** — a short-lived token (typically valid for 1 hour) that proves "this person authenticated successfully." Even if someone stole a JWT, it would stop working within an hour. The client library silently refreshes it in the background so legitimate users never notice.

This is the same security posture as Auth0, Clerk, Firebase Auth, or any other managed identity provider. Passwords are Netlify's responsibility to secure, and they handle it with industry-standard practices.

### JWT token storage — decision and rationale

`@netlify/identity` stores the JWT in the browser's `localStorage` by default. localStorage is readable by any JavaScript running on the page, which means an XSS vulnerability (a way to inject a malicious script) could theoretically allow a token to be stolen and used elsewhere until it expires.

The alternative is `httpOnly` cookies — the server sets the cookie with a flag that makes it completely invisible to JavaScript, eliminating that attack vector entirely. However, using httpOnly cookies requires abandoning `@netlify/identity` in favour of the lower-level `gotrue-js` library, adding a server-side cookie-setting endpoint, and introducing CSRF protection for state-changing requests. Roughly half a day of extra dev work and meaningfully more moving parts.

**Decision: use localStorage (the default) for Phase 1.**

The risk in context is low:

- Astro auto-escapes all template output — there is no obvious XSS injection point on the page
- We control every script that loads on `/my-account` (no third-party chat widgets or ad scripts on the account page)
- The token expires in ~1 hour regardless; Netlify Identity's client library silently refreshes it for active sessions
- What an attacker would obtain: service dates, job descriptions, and a street address — not payment info, not passwords, not personal identification numbers

This is the same posture taken by Auth0, Clerk, Firebase Auth, and every other managed auth library by default. The risk/complexity tradeoff does not favour httpOnly cookies at this data sensitivity level.

**Trigger for revisiting:** if Phase 2 or Phase 3 adds pricing history, payment records, or any data of higher sensitivity to the portal, migrate to httpOnly cookies at that point. The migration is self-contained — it's a change to how the token is stored and transmitted between the browser and the function, not an architectural overhaul. The rest of the codebase stays the same.

### HCP plan dependency risk and monitoring

The API integration only works while KOM USA is on the MAX plan. If the subscription changes, or the API key is rotated without updating the Netlify env var, the function returns 502s to every logged-in client. The weekly healthcheck function (below) catches this within a week before a client notices.

As part of Phase 1 we add a scheduled Netlify Function (`hcp-healthcheck.mts`) that runs once per week, makes a lightweight call to the HCP API (`GET /customers?page_size=1`), and sends an alert email via Brevo if it fails. This reuses the Brevo integration already in place and takes roughly an hour to build. It ensures the team finds out about a broken API key before a client does.

### Data export before leaving HCP

The portal reads job history live from HCP on every page load — there is no separate copy of that data stored anywhere in the portal. This means if KOM USA cancels HCP or loses API access, the historical job records that power the portal become inaccessible.

**Before cancelling HCP or downgrading away from the MAX plan, KOM USA must export all job and customer data out of HCP first.** HCP supports a full data export from the account settings. That export should be taken and stored safely before any cancellation is processed.

What happens after export depends on what KOM USA moves to:
- If moving to a new field service platform (ServiceTitan, Jobber, etc.), the migration team typically handles importing historical records as part of the transition.
- If building an internal system, the historical data would need to be imported into that system's database so the portal can continue showing complete history.

The code migration itself is straightforward (see "Designing for HCP migration" below). Data continuity is the part that requires advance planning — it cannot be done after HCP access is already gone.

### API rate limiting

The `/api/my-account/history` endpoint has no rate limiting by default. A user with a valid JWT could make rapid repeated requests, unnecessarily hammering the HCP API and potentially hitting HCP's own rate limits.

**Phase 1 approach: in-function per-user counter**

We implement a simple in-memory counter inside the Netlify Function — 10 requests per user (keyed by email) per minute. If the counter exceeds the threshold, the function returns `429 Too Many Requests`. This is lightweight, zero cost, and sufficient for current scale.

One limitation: the counter resets if Netlify spins up a new function instance (which can happen on cold starts or under high concurrency). For a portal with ~500 customers, this is acceptable — the window where a cold start matters is small and the cost of a reset is just slightly more than 10 requests going through.

**Future option: Netlify native rate limiting**

Netlify's Pro plan and above include configurable rate limiting enforced at the edge, before a request even reaches the function. This is more robust — it persists across function instances, requires no code changes, and protects against more sophisticated abuse patterns. It also scales cleanly as the number of registered portal users grows.

As KOM USA's client portal grows in usage and the business evaluates its Netlify plan tier, native rate limiting is the natural upgrade path. No changes to the function code are needed to switch — it is configured in the Netlify dashboard and enabled on top of what already exists.

### Designing for HCP migration

KOM USA intends to eventually move away from House Call Pro. The architecture is deliberately built so that HCP is isolated to a single function (`hcp-history.mts`). The function uses an internal data translation layer — a dedicated block of code that converts HCP's raw response into a generic job shape before returning it to the browser. Shown here for context (Section 7 has the full canonical implementation):

```typescript
// This is the only place that knows about HCP's field names.
// To migrate to a different platform, rewrite this function only.
function toJob(raw: HcpJob): Job {
  return {
    id: raw.id,
    date: raw.work_timestamps?.completed_at ?? null,
    status: normaliseStatus(raw.work_status),
    address: raw.address ?? null,
    description: raw.description ?? null,
  };
}
```

The rest of the codebase — the `/my-account` page, the UI components, the auth logic — imports the `Job` type, not anything HCP-specific. When the platform changes, only `toJob()` and the two HCP API fetch calls need to be rewritten. Nothing else changes.

---

## 12. What does NOT change

- Every existing page on the site — all routes, content, and behavior remain exactly as-is.
- Sanity CMS — no schema changes, no new document types.
- The `coming-soon` branch and `kom-usa.com` public state — My Area is developed on `main` and visible only at `https://main--kom-usa-redesign.netlify.app` until launch is explicitly approved.
- DNS, GoDaddy, Google Workspace records — untouched.
- The existing Netlify Functions (`form-brevo.mts`, `google-reviews.mts`) — unchanged.
- Netlify Forms, Brevo contact sync — unchanged.
- The production deploy credit budget — all development goes through the `main` branch deploy (0 credits) and is reviewed at the preview URL before any production deploy.

---

## 13. Phase breakdown

### Phase 1 — Personal job history (this plan)

Files changed or added:

| File | Change |
|---|---|
| `astro.config.mjs` | Add `adapter: netlify()` and `/my-account` to sitemap filter — `output` stays `'static'` |
| `site/netlify/functions/hcp-history.mts` | New — JWT validation + HCP API proxy with `toJob()` translation layer |
| `site/netlify/functions/hcp-healthcheck.mts` | New — weekly scheduled ping to HCP API with Brevo alert on failure |
| `site/netlify/functions/hcp-history.test.ts` | New — unit tests for `normaliseStatus()` and `toJob()`; integration test for exact-match customer filter |
| `src/pages/my-account.astro` | New — login UI + job history view |
| `src/components/layout/Header.astro` | Add "My Account" link to nav array |
| `site/.env` (local only, not committed) | Add `HCP_API_KEY` for local testing |
| Netlify dashboard | Enable Netlify Identity; add `HCP_API_KEY` env var |

New npm packages needed:
- `@netlify/identity` — client-side auth widget (current package; `netlify-identity-widget` is the older version)
- `jose` — JWT verification library for the `hcp-history` function; handles JWKS fetching, caching, and local signature verification. Widely used, actively maintained, works in Node and edge runtimes.

**Sitemap:** `/my-account` added to the filter exclusion list in `astro.config.mjs`. A login-gated page has no value in the sitemap and should not be crawled.

**Tests:** The `hcp-history` function contains the two most critical logic pieces in the feature — `normaliseStatus()` and the exact-match customer filter. Both are straightforward to unit test. The exact-match filter test is particularly important: it verifies that a fuzzy HCP search result containing the wrong customer is correctly discarded before their jobs are returned. This test directly guards against the data leak scenario identified during planning.

**Estimated development time: 4–5 working days.**

Based on ~3.5 hours of productive coding time per day (5-hour day minus planning, breaks, and context-switching). Rough breakdown:

| Task | Estimated time |
|---|---|
| `astro.config.mjs` changes + Netlify adapter setup | 1 hour |
| Netlify Identity setup in dashboard + local dev config | 1 hour |
| `hcp-history.mts` function | 3 hours |
| `hcp-healthcheck.mts` scheduled function | 1.5 hours |
| Unit + integration tests | 2 hours |
| `/my-account.astro` page (all 5 UI states) | 4 hours |
| `Header.astro` nav change | 30 min |
| End-to-end testing and debugging on preview URL | 2 hours |
| **Total** | **~15 hours → 4–5 days** |

Clock starts after Gabe's validation question is answered — the Netlify adapter compatibility check could surface conflicts that add time.

### Phase 2 — Property history (not in scope for Phase 1)

Clients register named properties (e.g. "My House", "Oak Park Office Building") with a street address. The system shows all jobs ever associated with that address in HCP, regardless of which customer account originally booked them.

This phase requires:
- A database to store property registrations (the current site has no database — this may mean adding Supabase or another lightweight store, or using Sanity if a non-relational schema fits)
- Resolving the consent question: can KOM USA legally show job details from Customer A's booking to Customer B who now manages the same address?
- Verifying that the HCP API supports filtering jobs by address (not just by customer ID)
- Its own planning session

### Phase 3 — Mobile apps (future)

iOS and Android apps that use the same Netlify Identity accounts and call the same `/api/my-account/history` function. The function works as a REST API from day one — no changes needed to support mobile clients later. The auth token mechanism is identical.

---

## 14. Questions for Gabe

One question needs Gabe's answer before work begins.

**Does adding the Netlify adapter conflict with anything in the current build setup?**

Two related things to check:

- The existing `netlify.toml` sets `[functions] directory = "netlify/functions"`. When the Netlify adapter is added, Astro generates its own SSR function at build time (typically landing in `.netlify/functions/` — a different path). Do these two directories conflict, or does Netlify pick them both up automatically? Does the `[functions]` block in `netlify.toml` need updating?
- Are there any redirects, edge functions, or Netlify dashboard settings (branch deploy rules, environment overrides) that the adapter might override or duplicate?

The existing `netlify.toml` config is straightforward, but Gabe knows if there are dashboard-side settings that might interact unexpectedly. This is the one thing that could add time to the estimate if it surfaces a conflict.

---

## 15. Questions for Aran

**1. Open sign-up or invite-only?**

Should clients be able to create their own account freely on the website (they enter an email and password and get a confirmation link), or should KOM USA send invites manually after a job is complete?

- Open sign-up: more self-serve, but a client might sign up with a different email than the one on their HCP record and see no history.
- Invite-only: requires someone to send each invite from Netlify after a job closes, but the email always matches.

We can start invite-only and open it up later.

**2. What history should be visible?**

Should clients see all jobs on record, or only jobs from a certain date forward? Some older HCP records may have no date or a vague description. Showing everything is most complete; capping at a date avoids surfacing incomplete older entries.

**3. What label do we use?**

The meeting used "My Area." The plan uses "My Account" as a placeholder. Other options: "My Portal," "Client Area," "Service History." Whatever appears in the navigation and as the page heading.

**4. Should clients see job pricing?**

`total_amount` is available on each job (stored in cents in HCP). We currently plan to hide pricing and show services and dates only. Is that right, or would clients find it useful to see what they were charged?

**5. Job description quality — HCP data hygiene**

The `description` field on HCP jobs is what clients will see as the service name in their history. Sampling real KOM USA data shows a mix of useful values (`"Electric Service"`, `"Diagnostics and Estimate."`) and vague internal labels (`"Services, Misc Sales"`, `"Deposit"`). The portal will display whatever is in HCP — if KOM USA staff use clearer job descriptions going forward, the client-facing view automatically improves. Is there appetite to establish a naming convention for job descriptions in HCP, or should we accept the current labels as-is for now?

---

## 16. Questions for Michael

Michael's role is final approval — not operational or technical decisions, but the strategic and legal questions only he can answer.

**1. Does this feature require updating KOM USA's privacy policy?**

Clients will be creating password-protected accounts on kom-usa.com and viewing their personal service history online. Credentials are handled entirely by Netlify (KOM USA never sees passwords), and the data shown is limited to jobs KOM USA performed for that client. That said, collecting account credentials and surfacing personal service records may trigger a disclosure requirement depending on how KOM USA's current privacy policy is worded. Worth a quick check before launch.

**2. Is KOM USA committed to the House Call Pro MAX plan long-term?**

API access — which is what powers this entire feature — requires the MAX plan. If KOM USA ever downgrades, the portal breaks for every logged-in client. The weekly healthcheck function will catch this within a week, but clients will see errors in the meantime. This is not a reason to not build it, but it is a dependency worth acknowledging as a business commitment. It also affects how much to invest in Phase 2 and Phase 3: if there's a realistic chance of moving off HCP or downgrading within the next 12–18 months, that changes the calculus on further development.

**3. Go/no-go on the feature**

Is this the right time to build this, and does the scope described here match what was discussed? Any concerns about timeline, cost, or direction should be raised before development begins — changes after implementation starts are significantly more expensive.

---

## 17. Questions for House Call Pro call

The goal of this call is not to deepen KOM USA's reliance on HCP — it is to understand the platform well enough to build a clean abstraction over it. The answers shape how the translation layer is written and what the migration path looks like later. Where HCP has a capability that reduces coupling (exact email lookup, webhooks), we want to know about it so we can use it without building unnecessary workarounds that would be harder to remove later.

**1. Is there an exact email filter parameter on the customers endpoint?**

We're currently using `?q=email@example.com`, which is a fuzzy substring search. We then filter the results ourselves to find the exact email match. If HCP has a dedicated parameter (e.g. `?email=`) that returns only exact matches, we can simplify the function code and remove the `page_size=50` buffer entirely. Ask: is there a way to search customers by exact email address?

**2. Does HCP support webhooks on job completion?**

This is the most impactful question. If HCP can POST to a URL when a job is marked complete, we can automate the client invite flow: job closes in HCP → webhook fires → Netlify Identity invite sent to the client automatically. This directly affects the sign-up flow decision (Aran Q1) — it changes "invite-only requires a manual step by staff after each job" to "invite-only is fully automatic." Ask: does HCP support webhooks, and specifically a trigger for when a job is marked complete?

**3. What are the API rate limits?**

We've built in-function rate limiting (10 requests/user/minute) partly to avoid hammering HCP's side. We don't know HCP's actual limits. Knowing the real number — requests per minute, per hour, or per day — lets us set our own threshold appropriately. Ask: what are the rate limits on the REST API, and what happens when they're exceeded (429? silent drop?)?

**4. Does the API support filtering jobs by address?**

Phase 2 of this feature (property history) requires showing all jobs ever performed at a given address, regardless of which customer booked them. We know jobs can be filtered by `customer_id` but don't know if address-based filtering is supported. If it isn't, Phase 2 would require a different approach. Ask: is there a way to query jobs by address or property?

**5. Does HCP have a built-in client-facing portal?**

Worth understanding what exists natively before the meeting with Aran and Michael. If HCP already has a customer portal, it's almost certainly generic and unbranded — but knowing what it looks like helps articulate why a custom-built portal on kom-usa.com is a better client experience. Ask: is there a customer-facing portal in HCP, and if so what does it show?

---

## 18. Local development setup

### The problem: Netlify Identity doesn't run on localhost

Netlify Identity is served at `/.netlify/identity` on the deployed site URL (e.g. `https://kom-usa.com/.netlify/identity`). When running `npm run dev` — Astro's built-in dev server at `http://localhost:4321` — that path does not exist. There is no Netlify Identity server running locally. This means login, sign-up, JWT issuance, and the function's JWT validation step cannot be tested against `localhost:4321` directly.

### The solution: netlify dev

Netlify provides a local development proxy called `netlify dev`. When run instead of `npm run dev`, it:

1. Starts Astro's dev server internally (port 4321)
2. Wraps it in a local Netlify edge emulator
3. Exposes the full site — including `/.netlify/identity` and all functions — at `http://localhost:8888`
4. Injects all environment variables from `site/.env` automatically

This means auth, JWT validation in the function, and the HCP API call can all be tested locally without a deploy.

### What needs to be installed

**Step 1 — Install Netlify CLI** (global, run once on the machine):

```bash
npm install -g netlify-cli
```

Approximate install size: ~50 MB. Independent of the project — installs globally to the machine's Node environment.

**Step 2 — Authenticate with Netlify** (one-time, per machine):

```bash
netlify login
```

Opens a browser window for OAuth. After logging in once, the CLI caches the session indefinitely — no need to log in again.

**Step 3 — Link the local folder to the deployed site** (one-time, run from `site/`):

```bash
cd /Volumes/Dev/kom-usa-redesign/site
netlify link
```

This associates the directory with the deployed Netlify site so `netlify dev` knows which Identity service to proxy. You will be prompted to select the site by name from your Netlify account.

**Step 4 — Run the dev server** (daily, instead of `npm run dev`):

```bash
netlify dev
```

The Netlify proxy listens on `http://localhost:8888`. Always use port 8888 when testing anything auth-related. Port 4321 still works for non-auth pages but the identity endpoint will not be available there.

### Disk space note

The `netlify-cli` global install adds approximately 50 MB. On the current development machine — an APFS sparse bundle with 160 GB allocated on the external drive — this is not a concern.

Any other developer picking this project up on a machine with limited internal storage (e.g. a 256 GB MacBook with very little free space) should verify available disk space before installing. The Netlify CLI goes into the global `node_modules` for whatever Node version is active, typically `~/.nvm/versions/node/<version>/lib/node_modules/netlify-cli` or similar depending on the Node version manager in use.

### Summary for any future developer

Always use `netlify dev` (not `npm run dev`) when working on the `/my-account` page, the `hcp-history.mts` function, or any other auth-related code. Using `npm run dev` is fine for all other pages and components where authentication is not involved.
