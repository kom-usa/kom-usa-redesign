# KOM USA Lead-Capture Redesign — Design Spec

**Date:** 2026-07-02
**Status:** Approved by owner (this session)
**Reference:** Mr. Handyman of South Oakland – Central Macomb franchise site (screenshots provided by owner)

## Goal

Rebuild the site around one funnel: **visitor shares contact info → KOM calls them → quote and schedule the project.** The layout emulates the Mr. Handyman franchise design; the visual language stays KOM's design system (Nunito Sans; Field Green #2F6B3B, Sage #78A866, Charcoal #33383E, Warm White #F7F7F2). Positioning: small, locally owned, friendly and helpful — no franchise-speak.

## Owner decisions (this session)

- **Services: spreadsheet only** — Locksmith, Water Heaters, Chimney Care. Air ducts is NOT a service; "liner cap $289" belongs under chimney care. All construction/remodeling, property-maintenance, and property-management/investor content is removed. Residential only.
- **Pricing: hybrid** — flat published prices for locksmith and chimney; "starting at … installed" for water heaters; everything else quote-based. Every price labeled "standard pricing — we confirm your exact quote by phone." Internal calculation rules (unit-tier math, per-foot formulas beyond the simple chimney line) are never published.
- **Reviews: real Google data** — 4.7★, 58 reviews, profile: https://share.google/gfFHF6KBpnBz5FchG (Google Maps place "KOM USA - Construction, Maintenance & Repairs"). Feature 2–3 real reviews (Jordan Petrovich — basement tile; Shannon P — accessibility overhaul; pull quote "Their workmanship is unmatched, very high quality work!"). Never fabricate reviews; do not feature the owner-connected Gabriel Mann review. Rating/count live in `business.ts` so they're easy to update.
- **Offer: $10 off first service** — first-time customers, one per household, mention when we call, not combinable with other offers. No expiration date (evergreen).
- **Credentials: "licensed & insured" confirmed OK** to display.
- **Hours: Mon–Sat 8am–6pm**, Sunday closed.
- **Approach: rework in place** — keep Astro + Starwind + Tailwind v4 foundation, Netlify Forms, deploy pipeline. Uncommitted restyle changes on 8 files are folded into this work.

## Standing constraints (from project memory — still binding)

Phone 313-804-0844; email info@kom-usa.com; never feature Housecall Pro, cleaning, memberships, houses for sale, subscriptions, or real-estate listings. Booking stays Netlify Forms + call CTAs (ServiceM8 in a later phase). Preserve kom.construction URL value — stage 301s in `site/public/_redirects`. All business facts live in `site/src/data/business.ts`, never hard-coded in templates. Gallery photos are stock, labeled "Sample photo," until real job photos exist. Locksmith pricing wording: "standard pricing… may vary," 50% deposit before dispatch, +$50 over 25 miles.

## Sitemap

| Route | Purpose |
|---|---|
| `/` | Homepage (Mr. Handyman layout, below) |
| `/services/locksmith/` | Full flat-price table; 301 from `/locksmith` |
| `/services/water-heaters/` | "Starting at" pricing by type |
| `/services/chimney-care/` | Flat prices; includes liner cap |
| `/contact/` | Dedicated request form page + phone/email/hours/service area |
| `/about/` | Kept; rewritten to friendly small-local-crew positioning |
| `/thank-you/`, `/404` | Kept |

**Header:** logo · Services ▾ (3 links) · About · Contact · phone number · green "Request a Call" button. Utility top bar: "Locally owned · Serving Metro Detroit" + hours.
**Footer:** service links, contact block (phone/email/hours), service-area counties, licensed & insured line.
**FloatingContact + MobileStickyBar:** kept (call + form CTAs).

## Homepage sections (in order)

1. **Hero** — house photo (`home-exterior.jpg`), eyebrow "Home Services in Metro Detroit," warm headline, short friendly copy, Google rating badge (4.7★ · 58 Google reviews, linked to profile).
2. **"Let Us Call You" card** overlapping hero bottom — Netlify Form `request-call`: first name, phone, email, city or ZIP, service select (3 services + "Something else"), optional note. Reassurance line: "We'll only use this to call you about your request." No SMS-consent legalese.
3. **Friendly intro strip** — who we are: small local crew, one number, we pick up.
4. **Services grid** — three photo cards (Locksmith, Water Heaters, Chimney Care), each with blurb + "from $X" anchor + link; fourth card "Need something else? Ask us."
5. **$10-off coupon card** — green coupon: "$10 Off Your First Service," terms above, "Claim Offer" button scrolls to the form and sets a hidden `offer` field so the team sees it on the lead.
6. **Google reviews** — 4.7★/58 header linked to profile + 2–3 real featured review cards.
7. **Why choose KOM USA** — locally owned & operated; upfront standard pricing; licensed & insured; one call, we pick up the phone.
8. **How it works** — ① Tell us what you need ② We call you to talk it through and quote ③ We schedule and do the work.
9. **Service area** — Wayne/Oakland/Macomb counties + city chips.
10. **Gallery** — slim, "Sample photo"-labeled stock until real photos exist.
11. **FAQ** — rewritten for the three services, pricing policy, deposit, offer, service area.
12. **Final CTA band** → footer.

## Service pages — shared template

Hero (photo, intro, phone CTA) → what's included list → pricing block → 3–4 service-specific FAQs → CTA band with embedded request form (same Netlify form, service preselected).

**Pricing content (from owner spreadsheet, 2026-07-02):**

- *Locksmith:* unlock $129 · 1/2/3 locks $179/$279/$349 · **4+ locks $65/unit** · lock combo $179 · Kwikset smart keypad $329 · lock box $129 (**$79 with another service**) · key duplication $25 (**$10 each additional**). Notes: 50% deposit before dispatch; +$50 beyond 25 miles; B2B wording removed (residential focus).
- *Water heaters:* installed, starting at — Electric (30–40 gal) from $1,750 · Gas from $1,850 (50-gal gas $2,300) · Power-vent gas from $2,850. "Exact quote on the call." No model matrix on site.
- *Chimney care:* cleaning $299 up to 35 ft (+$6/ft after) · chimney cap $329 · liner cap $289.

## Contact page

Full request form (Netlify Form `request-service`): service, urgency, first/last name, phone, email, city/ZIP, message, preferred contact time. Beside it: phone, email, hours (Mon–Sat 8–6), service-area summary, "what happens next" mini-steps.

## Data & code changes

- `business.ts` is rewritten: 3 service categories with pricing arrays; `offer` object; `googleReviews` { url, rating, count, featured[] }; hours; updated FAQs, trust points, how-it-works, service/urgency options; PM/construction/example-project arrays removed.
- Components removed or replaced: `PropertyManagement.astro`, construction-oriented content in `Services.astro`, `WhyChooseUs.astro`, `Testimonials.astro` (becomes Google reviews), `LockoutBand.astro` folds into locksmith page/home CTA.
- New: coupon section, reviews section, service-page template, `/contact` page, `/services/*` pages.
- `site/public/_redirects`: add `/locksmith /services/locksmith 301`.
- SEO: per-page titles/descriptions; LocalBusiness schema updated (hours, aggregate rating only if Google-sourced and current).

## Error handling & testing

- Forms: required-field validation (native + minimal JS), honeypot field, `/thank-you` redirect. Netlify Forms detection must be verified after deploy (still pending in Netlify UI per memory).
- Verify with dev server + browser preview: all routes render, nav/dropdown works, form posts (test locally with `data-netlify` markup check), mobile layout at 375px, redirects file syntax.
- `astro build` must pass before commit.

## Out of scope

ServiceM8 integration, real job photos, blog/SEO content pages, commercial services, any additional service categories, review widgets/embeds (static data only).
