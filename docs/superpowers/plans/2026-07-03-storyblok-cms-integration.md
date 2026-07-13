# KOM USA Storyblok CMS Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Storyblok as a structured CMS for articles, service content, location pages, projects, FAQs, and testimonials while preserving KOM USA's lead-capture funnel, static production build, Netlify Forms, and code-owned business guardrails.

**Architecture:** Astro 7 static production site in `site/`. Published Storyblok content is fetched at build time with `getStaticPaths`. A separate Netlify `preview` branch runs SSR with draft content and Storyblok live preview enabled. Business facts, phone, email, hours, pricing guardrail copy, verified Google review facts, and lead forms remain code-owned.

**Tech Stack:** Astro 7, Tailwind v4, Starwind UI, Netlify, Netlify Forms, `@storyblok/astro@^10`, `@astrojs/netlify`, Storyblok Management API scripts.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-03-storyblok-cms-design.md` - binding.
- Source of truth for business facts: `site/src/data/business.ts`. Do not create a Storyblok company-settings content type.
- Phone: `313-804-0844`. Email: `contact@kom-usa.com`. Hours: Mon-Sat 8am-5pm, Sunday closed.
- Public production site stays static. Visitors should not hit Storyblok at request time.
- Preview branch may be SSR only when `STORYBLOK_PREVIEW=true`.
- Tokens never go in chat or source control. `STORYBLOK_TOKEN` may exist locally and in Netlify. `STORYBLOK_MANAGEMENT_TOKEN` and `STORYBLOK_SPACE_ID` are local-only.
- Services stay residential and constrained to Locksmith, Water Heaters, and Chimney Care unless the owner explicitly adds a new service.
- Code appends pricing disclaimers, locksmith deposit/distance notes, lead forms, and phone CTAs.
- Testimonials require real source URLs. Never seed or render fabricated reviews.
- Netlify Forms `request-call` and `request-service` stay intact.
- Verification command from `site/`: `npx astro build`.

---

### Task 1: Apply immediate business-fact updates

**Status:** Complete in current working tree; commit with the first CMS work or as its own small commit.

**Files:**
- Modify: `site/src/data/business.ts`
- Modify: `site/src/components/seo/Seo.astro`

**Changes:**
- [x] Change `business.email` and `business.emailHref` from `info@kom-usa.com` to `contact@kom-usa.com`.
- [x] Change `business.hoursShort` from `Mon-Sat 8am-6pm` to `Mon-Sat 8am-5pm`.
- [x] Change exported `hours` row from `8:00 am - 6:00 pm` to `8:00 am - 5:00 pm`.
- [x] Change LocalBusiness `openingHoursSpecification.closes` from `18:00` to `17:00`.
- [x] Verify no rendered stale email/hour strings remain in `site/dist`.

**Verification:**
- [x] `npx astro build`
- [x] `rg -n "info@kom-usa\.com|Mon.Sat 8am.6pm|8:00 am.6:00 pm|\"closes\":\"18:00\"" site/dist` returns no matches.

---

### Task 2: Add Storyblok dependencies, env contract, and preview-aware Astro config

**Files:**
- Modify: `site/package.json`
- Modify: `site/package-lock.json`
- Modify: `site/astro.config.mjs`
- Modify: `site/netlify.toml`
- Add: `site/src/env.d.ts` or equivalent type declarations if needed
- Modify: `site/.env.example`

**Steps:**
- [ ] Install `@storyblok/astro@^10` and `@astrojs/netlify`.
- [ ] Register Storyblok integration in `astro.config.mjs`.
- [ ] Switch config by env:
  - production/default: `output: "static"`, Storyblok `version: "published"`, no Netlify adapter.
  - preview: `output: "server"`, Netlify adapter, Storyblok `version: "draft"`, `livePreview: true`.
- [ ] Add `STORYBLOK_PREVIEW=true`, `PREVIEW_ACCESS_KEY`, and preview noindex headers to `[context."preview".environment]` / headers in `site/netlify.toml`.
- [ ] Update `.env.example` with variable names only:
  - `STORYBLOK_TOKEN=`
  - `STORYBLOK_MANAGEMENT_TOKEN=`
  - `STORYBLOK_SPACE_ID=`
  - `STORYBLOK_PREVIEW=`
  - `PREVIEW_ACCESS_KEY=`
- [ ] Do not read or print real token values.

**Verification:**
- [ ] `npx astro build` still succeeds before routed Storyblok pages are wired.

---

### Task 3: Create typed Storyblok data helpers and component mapping

**Files:**
- Add: `site/src/lib/storyblok.ts`
- Add: `site/src/types/storyblok.ts`
- Add: `site/src/components/storyblok/RichText.astro`
- Add: `site/src/components/storyblok/ArticleCard.astro`
- Add: `site/src/components/storyblok/ProjectCard.astro`
- Add: `site/src/components/storyblok/ServiceContent.astro`
- Add: `site/src/components/storyblok/LocationContent.astro`

**Interfaces:**
- `getStories<T>(startsWith, options)` fetches folder content and fails loudly when required env is missing after Storyblok-backed routes are enabled.
- `getStory<T>(slug, options)` fetches one story for routed pages.
- `storyblokVersion` resolves to `draft` only in preview.
- Storyblok content types mirror the spec: `ArticleStory`, `ServiceStory`, `LocationStory`, `ProjectStory`, `FaqStory`, `TestimonialStory`.

**Steps:**
- [ ] Keep Storyblok helper code isolated from `business.ts`.
- [ ] Convert Storyblok richtext via the official renderer/API from the installed package.
- [ ] Build components with existing KOM classes and section/card conventions.
- [ ] Ensure unknown/missing optional assets render gracefully; required content should fail during build.
- [ ] Keep CTAs and pricing guardrail notes code-side.

**Verification:**
- [ ] `npx astro build` succeeds if routes are not yet Storyblok-dependent, or succeeds against the real space once tokens are present.

---

### Task 4: Add idempotent Storyblok provisioning script

**Files:**
- Add: `site/scripts/storyblok-setup.mjs`
- Modify: `site/package.json`

**Script commands:**
- `npm run storyblok:setup`

**Steps:**
- [ ] Read `STORYBLOK_MANAGEMENT_TOKEN` and `STORYBLOK_SPACE_ID` from env.
- [ ] Create or update folders: `blog`, `services`, `locations`, `projects`, `faqs`, `testimonials`.
- [ ] Create or update component schemas for `article`, `service`, `location`, `project`, `faq`, and `testimonial`.
- [ ] Add the SEO tab fields to routed types.
- [ ] Lock service seed slugs to `locksmith`, `water-heaters`, and `chimney-care` by convention in script validation.
- [ ] Create or document the Netlify build hook named `storyblok-publish`; register Storyblok webhook for publish/unpublish/delete/move.
- [ ] Make the script idempotent: rerunning updates missing fields without duplicating components or folders.
- [ ] Print a concise summary without printing secrets.

**Verification:**
- [ ] With tokens present: `npm run storyblok:setup`
- [ ] Rerun once to confirm idempotence.

---

### Task 5: Add seed script from current code-owned content

**Files:**
- Add: `site/scripts/storyblok-seed.mjs`
- Modify: `site/package.json`

**Script commands:**
- `npm run storyblok:seed`

**Steps:**
- [ ] Seed the three current services from `site/src/data/business.ts`.
- [ ] Seed the seven homepage FAQs from `business.ts`.
- [ ] Seed one published article: "Welcome to the new KOM USA site".
- [ ] Seed one draft location example: Warren.
- [ ] Seed sample project/testimonial only if the content is real and source-backed; otherwise skip those types.
- [ ] Preserve all guardrail notes as code-owned where the spec requires it.
- [ ] Make the seed script idempotent by slug.

**Verification:**
- [ ] With tokens present: `npm run storyblok:seed`
- [ ] Confirm seeded services and homepage FAQs render unchanged once routes are wired.

---

### Task 6: Replace static service pages with CMS-backed `/services/[slug].astro`

**Files:**
- Add: `site/src/pages/services/[slug].astro`
- Modify: `site/src/layouts/ServicePage.astro` or introduce `site/src/layouts/CmsServicePage.astro`
- Delete after parity is verified: `site/src/pages/services/locksmith.astro`
- Delete after parity is verified: `site/src/pages/services/water-heaters.astro`
- Delete after parity is verified: `site/src/pages/services/chimney-care.astro`
- Modify: `site/src/data/business.ts`

**Steps:**
- [ ] Fetch published service stories from `services/` in `getStaticPaths`.
- [ ] Render identical URLs: `/services/locksmith`, `/services/water-heaters`, `/services/chimney-care`.
- [ ] Map CMS fields to current service layout: title, intro, hero image, includes, pricing, pricing note, FAQs.
- [ ] Append `pricingDisclaimer` and locksmith deposit/distance notes from code.
- [ ] Keep `serviceOptions` and contact-form data in `business.ts`.
- [ ] Remove page-content-only service fields from `business.ts` only after seeded CMS content renders with parity.
- [ ] Make build fail clearly if no services are returned.

**Verification:**
- [ ] `npx astro build`
- [ ] Preview all three service pages and compare content against current static output.

---

### Task 7: Add article, location, and project routes

**Files:**
- Add: `site/src/pages/blog/index.astro`
- Add: `site/src/pages/blog/[slug].astro`
- Add: `site/src/pages/locations/index.astro`
- Add: `site/src/pages/locations/[slug].astro`
- Add: `site/src/pages/projects/index.astro`
- Add: `site/src/pages/projects/[slug].astro`

**Steps:**
- [ ] Blog index lists articles newest first with category, date, cover image, and excerpt.
- [ ] Blog detail renders richtext body and SEO fields.
- [ ] Locations index lists published service-area city pages.
- [ ] Location detail renders city hero, intro, service cards, linked testimonials/projects, LeadCallForm, and the code-owned service-area disclaimer.
- [ ] Projects index/detail render real project photos and problem/work/result fields.
- [ ] Published content only appears in production static builds.
- [ ] Empty states are concise and brand-consistent.

**Verification:**
- [ ] `npx astro build`
- [ ] Preview `/blog/`, seeded article, `/locations/`, and `/projects/`.

---

### Task 8: Wire homepage and navigation to CMS where specified

**Files:**
- Modify: `site/src/components/sections/Faq.astro`
- Modify: `site/src/components/sections/Gallery.astro`
- Modify: `site/src/components/layout/Footer.astro`
- Modify if needed: `site/src/components/layout/Header.astro`
- Modify: `site/src/pages/index.astro`

**Steps:**
- [ ] Fetch homepage FAQs with `placement=Homepage`; render seeded FAQs so visual output stays unchanged.
- [ ] Fetch latest published projects for the gallery.
- [ ] If fewer than three projects are published, keep the current sample-photo fallback.
- [ ] Keep Google reviews code-driven from verified data in `business.ts`.
- [ ] Make services footer list CMS-driven once service stories are available.
- [ ] Add Blog to footer quick links.
- [ ] Leave header nav unchanged except for CMS-driven service URLs/titles.

**Verification:**
- [ ] `npx astro build`
- [ ] Preview homepage with seeded FAQ and gallery fallback.

---

### Task 9: Protect and verify the Storyblok preview deployment

**Files:**
- Add: `site/src/middleware.ts`
- Modify: `site/netlify.toml`
- Modify: `site/astro.config.mjs`

**Steps:**
- [ ] In preview mode, allow requests carrying Storyblok editor params.
- [ ] Allow requests carrying `?_preview=<PREVIEW_ACCESS_KEY>`.
- [ ] Return 404 for other preview-branch requests.
- [ ] Add noindex headers for the preview context.
- [ ] Confirm live preview bridge loads only in preview mode.

**Verification:**
- [ ] Branch deploy from `preview`.
- [ ] Preview URL without key returns 404.
- [ ] Preview URL with key renders draft content.
- [ ] Storyblok visual editor can select/highlight blocks.

---

### Task 10: Write staff-facing editor guide

**Files:**
- Add: `docs/EDITOR-GUIDE.md`

**Steps:**
- [ ] Write in plain English for non-technical staff.
- [ ] Cover login, visual editor basics, publishing an article, editing service content/prices, creating a location page, adding FAQs, adding source-backed testimonials, adding projects, and what Publish does.
- [ ] Explain fields staff cannot edit because they are guardrails.
- [ ] Add screenshot placeholders for owner-filled images.
- [ ] Include "who to ask for new fields" and "do not paste secrets" notes.

**Verification:**
- [ ] Read the guide once as a staff user and remove implementation jargon.

---

### Task 11: Final verification, deploy path, and rollback notes

**Files:**
- Modify: `.superpowers/sdd/progress.md`
- Optional: add task reports under `.superpowers/sdd/`

**Steps:**
- [ ] Run `npm run storyblok:setup` and `npm run storyblok:seed` with owner-provided local tokens.
- [ ] Run `npx astro build`.
- [ ] Preview production build with `npx astro preview --port 4330`.
- [ ] Browser-check homepage, all three services, blog index/detail, locations index/detail, projects index/detail, contact forms, and schema output.
- [ ] Publish a trivial article edit in Storyblok, confirm webhook triggers Netlify production rebuild, and confirm the change is live.
- [ ] Document rollback: revert code commit and/or republish prior Storyblok story versions.
- [ ] Update `.superpowers/sdd/progress.md` with completed task commits and any residual risks.

**Verification:**
- [ ] Git diff includes only CMS work, docs, package changes, and the business-facts update.
- [ ] User-owned files remain unstaged unless explicitly approved.
- [ ] Netlify production deploy completes from `main`.

## Blockers Before Task 4 Runtime Verification

- Owner must create the Storyblok space.
- Owner must place `STORYBLOK_TOKEN`, `STORYBLOK_MANAGEMENT_TOKEN`, and `STORYBLOK_SPACE_ID` in `site/.env`.
- Owner must add `STORYBLOK_TOKEN` to Netlify env.
- A `PREVIEW_ACCESS_KEY` value must be generated locally and added to the Netlify preview branch environment before preview protection can be verified.
