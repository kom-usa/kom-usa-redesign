# KOM USA — Customer Accounts & Membership Subscriptions (Phase 4)

**Date:** 2026-07-13
**Status:** Draft for owner review. No implementation until sign-off and the
owner inputs in "Blockers" are provided.

## Context

Phase 4 of the KOM USA gantt (CUSTOMER ACCOUNTS) adds customer-facing accounts
to the site: sign up / login, saved profile and property addresses, service
request history, and a paid maintenance membership billed through Stripe. The
site today is Astro 7 in `site/`, deployed static to the owner's Netlify with
Netlify Functions already in use (Brevo form sync). Sanity (Phase B) owns
editorial content; business facts and pricing guardrails stay code-owned in
`site/src/data/business.ts` — that invariant carries into this phase.

Forward compatibility this design must not paint over:

- **Phase 5 estimator** saves estimates to a customer account → the schema
  reserves room for an `estimates` table keyed the same way as
  `service_requests`; nothing in v1 blocks it.
- **ServiceM8** is the company's field-service platform → `service_requests`
  carries a nullable `servicem8_job_id` from day one so a later sync is a
  column fill, not a migration.

## Stack decision

**Chosen: Supabase (auth + Postgres + RLS) for accounts/data, Stripe for
payments.**

| Option | Verdict | Why |
|---|---|---|
| **Supabase + Stripe** | **Chosen** | One vendor for auth, Postgres, and row-level security; free tier comfortably covers a local service business; `@supabase/ssr` cookie sessions integrate cleanly with Astro SSR on Netlify. Stripe is the industry-standard billing integration. |
| Clerk + Neon Postgres | Rejected | Slicker prebuilt auth UI, but two vendors, recurring cost at scale, and no RLS story out of the box — more glue code for less ownership. |
| Netlify-native (Functions + Auth.js + Netlify DB) | Rejected | Fewest vendors, but we would own the security-critical auth code (password hashing, session fixation, reset-token lifecycle). Wrong trade for a small team. |
| Polar.sh (merchant of record) | Rejected | 4% + 40¢ vs Stripe's 2.9% + 30¢, and MoR platforms are built for digital goods — their terms don't fit in-person home services, and Polar would appear as the seller of record. The multi-state sales-tax problem MoR solves does not exist for a single-state service business: Michigan generally does not apply sales tax to services. **Action: one-time confirmation with the company accountant that the membership is not taxable.** |

Stripe surface area is deliberately minimal: **Stripe Checkout** (hosted) for
purchase and the **hosted Billing Portal** for card updates and cancellation.
We never render card fields and never build cancellation UI. We own exactly
two server-side pieces: checkout-session creation and the webhook.

## Rendering architecture

- Enable the already-installed `@astrojs/netlify` adapter with static-first
  hybrid output. Every existing page remains prerendered — marketing build
  output is unchanged.
- Server-rendered surface: `/account/*`, the auth pages, and `/api/*`
  endpoints only.
- Astro middleware (`site/src/middleware.ts`) guards `/account/*`: no valid
  session → 302 to `/login?next=<path>`. (The old Storyblok middleware was
  removed in Phase B; this is a fresh file with one job.)
- Sessions are Supabase cookie sessions via `@supabase/ssr` (httpOnly,
  Secure, SameSite=Lax). No tokens in localStorage.

## Database schema plan

Postgres on Supabase. Every table gets RLS enabled with owner-only policies
(`auth.uid() = user_id`) except `stripe_events`, which is service-role only.

- **`profiles`** — 1:1 with `auth.users` (PK = user id, FK cascade). Fields:
  `full_name`, `phone`, `marketing_consent boolean default false`,
  `created_at`, `updated_at`. Created by trigger on user signup.
- **`addresses`** — N per user. Fields: `user_id`, `label` ("Home",
  "Rental"), `street`, `city`, `state char(2) default 'MI'`, `zip`,
  `is_primary boolean`, timestamps. City/county sanity check against
  `serviceAreaCities` / `serviceAreaCounties` from
  `site/src/data/business.ts` happens app-side at write time (warn, don't
  block — the team confirms service area by phone today and that stays true).
- **`service_requests`** — `user_id`, `address_id`, `service_slug` (validated
  app-side against `service-catalog.ts`), `details text`, `status` enum
  (`submitted | reviewed | scheduled | done | closed`), `source` (default
  `web`), `servicem8_job_id text null`, timestamps. v1 writes `submitted`
  rows from the logged-in request form and lists them read-only in the
  dashboard; staff move statuses in the Supabase dashboard.
  **Note on service catalog scope:** KOM USA offers approximately 50 services
  across maintenance and construction. The current `service-catalog.ts` covers
  ~25 — the file must be expanded to the full catalog before the service
  request form launches in Phase 4 (see Blockers).
- **`subscriptions`** — Stripe mirror, 1 row per Stripe subscription:
  `user_id`, `stripe_customer_id`, `stripe_subscription_id` (unique),
  `stripe_price_id`, `status` (Stripe's own status vocabulary), 
  `current_period_end timestamptz`, `cancel_at_period_end boolean`,
  timestamps. Read-only to the user; written only by the webhook with the
  service-role key.
- **`stripe_events`** — webhook idempotency log: `event_id` (unique),
  `type`, `received_at`, `payload jsonb`. Insert-first; duplicate event id →
  ack and skip.

**Guardrail:** membership discount rules, benefit copy, and pricing
disclaimers are code-owned (a `membership.ts` sibling to `business.ts`),
not database rows and not CMS-editable — same invariant as Phases A–C.

## User authorization plan

- Supabase email/password auth. Email verification required before the
  dashboard unlocks. Password reset via Supabase's built-in flow
  (`/reset-password` request page + `/reset-password/confirm` update page).
- No social login in v1 (add later without schema change).
- RLS is the enforcement layer; the app layer never queries with the service
  role except in the Stripe webhook and auth callback.
- No admin UI in v1. Staff operate through the Supabase dashboard (requests,
  profiles) and the Stripe dashboard (billing). An admin portal is a later
  phase if dashboard use becomes painful.
- Rate limiting on auth endpoints comes free from Supabase; the request-form
  endpoint reuses the existing spam-protection approach from the public
  Netlify forms.

## Page & endpoint map

Pages (server-rendered unless noted):

| Route | Purpose |
|---|---|
| `/signup`, `/login`, `/logout` | Auth entry/exit; `/logout` is a POST that clears the session |
| `/reset-password`, `/reset-password/confirm` | Reset request + new-password screens |
| `/account` | Dashboard shell: membership status card, recent requests, quick links |
| `/account/profile` | Name / phone / marketing consent |
| `/account/addresses` | List, add, edit, delete, set-primary |
| `/account/membership` | Status, renewal date, links to Checkout (join) or Billing Portal (manage) |
| `/members` | **Public, prerendered** benefits page (gantt: "Member benefits page") |
| `/account/checkout/success`, `/account/checkout/cancel` | Stripe return pages |

Endpoints:

| Route | Job |
|---|---|
| `/api/auth/callback` | Supabase code exchange → session cookies |
| `/api/checkout` | POST; creates Stripe Checkout session for the signed-in user (creates/reuses Stripe customer, stores mapping) |
| `/api/billing-portal` | POST; creates Billing Portal session, redirects |
| `/api/stripe-webhook` | Signature-verified webhook (see below) |
| `/api/service-request` | POST from the logged-in request form → `service_requests` row |

## Stripe subscription wiring

- Products/prices are created in the Stripe dashboard, **test mode first**;
  price IDs land in env/config, never hardcoded in components.
- Webhook events handled: `checkout.session.completed` (create/attach
  subscription row), `customer.subscription.updated` and
  `customer.subscription.deleted` (mirror status / period end / cancel flag),
  `invoice.payment_failed` (status → `past_due`; UI shows a fix-payment
  prompt linking to the Billing Portal). Everything else: log to
  `stripe_events`, ack.
- Idempotency via `stripe_events.event_id` unique insert before processing.
- **Test matrix (gantt items):** purchase (test card checkout → active row →
  dashboard shows member), renewal (Stripe test clock advance → period end
  updates), cancellation (Billing Portal cancel → `cancel_at_period_end`,
  then `deleted` → status reflects), payment failure (failing test card →
  `past_due` + prompt).

## Design-system & content constraints

- Account screens use the existing tokens (`site/src/styles/global.css`) and
  Starwind form components — visible labels on all fields (not
  placeholder-as-label), flat/no-shadow language, mobile-first. Gantt's
  "Account mobile QA" is an explicit acceptance step.
- Copy tasks from the gantt: account privacy copy and account terms copy —
  plain-English additions to `/privacy` plus a short terms section; drafted
  in this phase, owner-reviewed.
- The `/maintenance/subscription-maintenance` "coming soon" page converts to
  a real page linking to `/members` and `/account/membership` once pricing
  exists.

## Blockers — owner inputs required before implementation

1. **Complete service list:** KOM USA offers approximately 50 services but
   `service-catalog.ts` currently covers ~25. The full list — with slugs,
   titles, and which line (maintenance vs construction) each belongs to —
   must be provided and added to the catalog before the service request form
   can go live. Aran to supply.
2. **Membership definition:** tier name(s), monthly/annual price(s), and the
   concrete benefit list (visit cadence, discount %, priority scheduling?).
   Nothing is defined today; the subscription page is a placeholder.
3. Stripe account (business verification takes a day or two — start early).
4. Supabase project + region; keys into Netlify env
   (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs).
5. Accountant confirmation that the membership isn't subject to Michigan
   sales tax.

## Out of scope (v1)

Social login; staff/admin portal; ServiceM8 two-way sync (column reserved
only); the Phase 5 estimator (schema leaves room); invoice payment for
one-off jobs; multi-user households.

## Verification (when implemented)

`npm run build` still produces prerendered output for all marketing routes;
auth flows exercised end-to-end on a Netlify deploy preview (signup →
verify → login → reset); RLS verified by attempting cross-user reads with a
second account; full Stripe test matrix above in test mode before any live
key exists; Lighthouse/mobile pass on the five account screens.
