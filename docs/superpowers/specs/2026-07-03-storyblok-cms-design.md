# Storyblok CMS Integration — Design Spec

**Date:** 2026-07-03
**Status:** Approved by owner (this session)
**Depends on:** 2026-07-02 lead-capture redesign (merged; site is live and CI-deployed)

## Goal

Let non-technical staff publish blog posts, company updates, service-page content, location pages, FAQs, testimonials, and project/gallery entries through Storyblok — without touching code, and without being able to break the site's guardrails (pricing disclaimers, phone/email, lead forms, design system). Prioritize strict fields over flexible page-building.

## Owner decisions (this session)

- Storyblok, free Community plan (1 seat included; extra seats ~$9/mo or share a login). Owner creates the account/space and supplies tokens via `.env` — never through chat.
- Services: **full CMS with structured pricing.** Editors edit intro/includes/pricing rows/FAQs; guardrail wording, phone, deposit/distance notes stay code-side and render automatically.
- **One Article type** with category (Blog post / Company update) at `/blog/`; **Location** template at `/locations/<city>` targeting the 16 service-area cities.
- **SSR preview branch** for Storyblok's visual editor; public site stays fully static.
- **Business-fact updates to apply first:** email changes to `contact@kom-usa.com` (from info@); hours change to **Mon–Sat 8am–5pm** (from 8–6). Update `business.ts`, schema `openingHoursSpecification` (08:00–17:00), and anywhere hours render.

## Standing constraints (still binding)

Phone 313-804-0844 and all business facts only via `site/src/data/business.ts`. No property-management/construction/investor content. Real reviews only — never fabricated. Netlify Forms stay as-is. Keep design system (Nunito Sans, Field Green/Sage/Charcoal/Warm White, existing components). Do not rebuild the site; existing URLs keep working.

## Architecture

- **SDK:** `@storyblok/astro@^10` (peer range includes Astro ^7.0.0 — verified against npm).
- **Production (static):** all CMS pages are prerendered via `getStaticPaths`, fetching `version: "published"` at build time. Visitors never hit Storyblok's API.
- **Preview (SSR):** git branch `preview` deploys as a Netlify branch deploy at `preview--kom-usa-redesign.netlify.app`. `astro.config.mjs` switches `output: "server"` + `@astrojs/netlify` adapter + `version: "draft"` + `livePreview: true` when `STORYBLOK_PREVIEW=true` (set via `[context."preview".environment]` in `site/netlify.toml`). Storyblok's visual editor points at the preview URL. Preview branch is kept in sync with main by fast-forwarding (documented; a follow-up automation is out of scope).
- **Preview URL protection:** Astro middleware on the preview deployment returns 404 unless the request carries Storyblok's editor query params or a `?_preview=<shared key>` param (key in env). Prevents draft content leaking publicly; robots `noindex` header on the whole preview context.
- **Tokens/env:** `STORYBLOK_TOKEN` (preview-type delivery token — works for both draft and published) in `site/.env` (gitignored) and Netlify env. `STORYBLOK_MANAGEMENT_TOKEN` + `STORYBLOK_SPACE_ID` only in local `.env`, used by provisioning scripts; never needed in Netlify.
- **Component mapping:** Storyblok technical components map 1:1 to new Astro components under `site/src/components/storyblok/`, which internally reuse the existing design-system sections (ServicePage layout parts, card styles, etc.).

## Content models (created by script, not by hand)

Every routed type gets an **SEO tab**: `seo_title` (text, falls back to name), `seo_description` (textarea, required), `seo_image` (asset, optional). Slug, publish state, and publish date are Storyblok-native. Field types in parentheses.

1. **article** — routed `/blog/<slug>`; folder `blog/`
   - title (text, req), category (single-option: "Blog post" | "Company update", req), date (date, req), cover_image (asset), excerpt (textarea, req — used on the index and as default seo_description), body (richtext, req)
2. **service** — routed `/services/<slug>`; folder `services/` (slugs locked to `locksmith`, `water-heaters`, `chimney-care`; new services allowed)
   - title (text, req), short_title (text, req), anchor_price (text, req — e.g. "Unlocks from $129"), card_blurb (textarea, req), hero_intro (textarea, req), hero_image (asset), includes (multi-text list), pricing (table block: rows of {name (text), detail (text), price (text)}), pricing_note (textarea — service-specific note like the water-heater "starting prices include installation" line), faqs (list of {question, answer} blocks)
   - Code appends: `pricingDisclaimer`, locksmith deposit + distance lines (keyed by slug in `business.ts`), lead form with preselect, phone CTAs.
3. **location** — routed `/locations/<slug>`; folder `locations/`
   - city (text, req), intro (richtext, req), services_offered (multi-link to service stories, req), featured_testimonials (multi-link to testimonial stories), featured_projects (multi-link to project stories)
   - Template renders: hero with city name, intro, service cards, testimonials, projects strip, LeadCallForm, service-area disclaimer from business.ts.
4. **project** — routed `/projects/<slug>` + `/projects/` index; folder `projects/`
   - title (text, req), city (text, req), service_category (single-option from the 3 services + "Other"), date (date), photos (multi-asset, req), problem (textarea, req), work (textarea, req), result (textarea, req)
5. **faq** — not routed; folder `faqs/`
   - question (text, req), answer (textarea, req), placement (single-option: "Homepage" | "Service page only"), related_service (link to service story, optional)
6. **testimonial** — not routed; folder `testimonials/`
   - name (text, req), city (text), quote (textarea, req), source_url (text, **required** — link to the real review; enforces the no-fabricated-reviews rule), service_category (single-option)
7. **Editor roles:** single shared editor login initially (free tier); the Management-API script marks `business`-type facts nonexistent in CMS by design — there is deliberately no "settings/company info" content type.

## Site integration

- `/services/[slug].astro` replaces the three static service pages (identical URLs; `getStaticPaths` from the `services/` folder). The three existing pages' content is **seeded into Storyblok by script** so day one renders identically; the old `.astro` pages and the `services` array's page-content fields are then removed from `business.ts` (contact-form `serviceOptions` and pricing guardrail notes stay).
- `/blog/index.astro` + `/blog/[slug].astro` — index lists published articles (cover, category chip, date, excerpt), newest first; empty state copy if none.
- `/locations/[slug].astro` + a small `/locations/index.astro` listing published cities.
- `/projects/index.astro` + `/projects/[slug].astro`.
- **Homepage FAQ section:** switches to published `faq` stories with placement=Homepage at build time; seeded with the current 7 FAQs so nothing changes visually.
- **Homepage gallery:** if ≥3 published projects exist, shows latest projects; otherwise falls back to the current labeled stock photos. (Google-reviews section stays code-driven from `business.ts` — it is verified data, not CMS content.)
- Header/footer nav: Services dropdown becomes CMS-driven (published services); add Blog link to footer quick links (header nav unchanged until owner wants it).
- Sitemap picks up all new routes automatically; article/location/project pages included only when published (unpublished stories simply don't build).

## Provisioning & pipeline

- `site/scripts/storyblok-setup.mjs` — idempotent Node script against the Management API: creates the 7 component schemas, the folders, and the webhook. Run locally with the management token.
- `site/scripts/storyblok-seed.mjs` — one-time seed: 3 services, 7 homepage FAQs, sample article ("Welcome to the new KOM USA site"), draft location example (Warren). Seeded stories created as **published** except the location (draft, as a worked example for staff).
- **Rebuild pipeline:** Netlify build hook (created via CLI) named "storyblok-publish"; setup script registers a Storyblok webhook firing on story publish/unpublish/delete/move → production rebuild. Preview branch needs no webhook (SSR reads drafts live).
- Build fails loudly (non-zero) if Storyblok is unreachable or the token is bad — no silent empty pages.

## Editor documentation

`docs/EDITOR-GUIDE.md`, plain English for non-technical staff: logging in, the visual editor, writing/publishing an article, editing service prices (and what they can't change), creating a location page, adding FAQs/testimonials (source link required)/projects, what Publish does (site updates in ~1 minute), and who to ask for new fields. Screenshot placeholders marked for the owner to fill in.

## Error handling & testing

- Verify per task with `npx astro build` against the real space (after owner provides tokens) and browser preview of each new route.
- Preview branch verified by loading the preview URL with the shared key and confirming draft content + bridge (`window.storyblok` / clicking a block highlights it in the editor).
- End-to-end test: publish a trivial article edit in Storyblok → confirm Netlify build fires → change is live.
- Rollback: all changes are git commits; Storyblok schemas are re-runnable from the setup script.

## Out of scope

Multiple seats/roles/workflows, scheduled publishing, Storyblok releases, image-focal-point art direction, migrating the homepage/about/contact pages into the CMS (they stay code-driven), automating preview-branch sync, comments/search on the blog, RSS.

## Owner prerequisites (blocking Task 2+)

1. Create Storyblok account + space (Community plan) at app.storyblok.com.
2. In the space: Settings → Access tokens → copy the **Preview** token. Account → Personal access tokens → create a **Management** token.
3. Put them in `site/.env` (I'll provide the exact template) and add `STORYBLOK_TOKEN` to Netlify env. Never paste tokens into chat.
