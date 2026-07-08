# KOM USA — Netlify Fix, Storyblok→Sanity, and SEO Overhaul

**Date:** 2026-07-08
**Status:** Approved direction; Phase A cleared to implement. Phases B–C pending spec review.

## Context

The repo was transferred to the owner's GitHub org (`kom-usa/kom-usa-redesign`) and a
fresh Netlify site in the owner's account was connected to it. The site does not
deploy. Two prior decisions changed since the last plan: (1) the CMS moves from
Storyblok to **Sanity**, (2) hosting is the owner's Netlify, not the developer's.

The site is an Astro 7 static lead-capture site in `site/` for a Metro Detroit
residential trades business (locksmith, water heaters, chimney care). Business facts,
pricing guardrails, and lead forms are code-owned in `site/src/data/business.ts` and
must stay that way. Preserve existing `kom.construction` URLs.

## Diagnosis: why the site does not deploy

Two independent, confirmed blockers:

1. **Base directory.** The Astro app is in `site/`; the only `netlify.toml` is at
   `site/netlify.toml`. A freshly connected Netlify site defaults its base directory to
   the repo root, where there is no `package.json` or build. Result: nothing builds.
2. **Hard Storyblok dependency.** `site/astro.config.mjs` throws at config load when
   `STORYBLOK_TOKEN` is unset. The owner's new Netlify account has no env vars, so the
   build dies immediately even once the base directory is fixed.

Minor: `site/.netlify/state.json` still references the developer's deleted site ID
(irrelevant to Git-based deploys; cleaned up in Phase A).

## Decisions

- Sequencing: **hotfix live first** (Phase A), then Sanity (B), then SEO (C).
- SEO scope: **Core + high-value** (see Phase C). Explicitly out: schema endpoints /
  `schemamap.xml`, `/llms.txt`, per-page markdown alternates, NLWeb tag.
- Sanity editing: **Studio-only** (no SSR visual-editing branch). Production stays
  fully static; Publish triggers a Netlify build hook.
- Not-yet-migrated routes in Phase A: **"coming soon" empty states**.
- Phase A ships to production (`main`) once it builds clean and is verified locally.

---

## Phase A — Hotfix: working site on the owner's Netlify

**Goal:** one push produces a complete, presentable static site with zero external
dependencies. Storyblok becomes inert (not yet removed).

**Components / changes:**

1. **Root `netlify.toml`** with `base = "site"` and the full build + headers config.
   Drop the Storyblok CSP (`frame-ancestors ... app.storyblok.com` → standard
   `X-Frame-Options`/no frame-ancestors) and the Storyblok `preview` context.
   Keep immutable `_astro` caching. Remove `site/netlify.toml` (or reduce to nothing)
   so there is a single source of truth at root.
2. **Decouple Storyblok from build.** In `astro.config.mjs`, remove the `throw`; load
   the Storyblok integration only when a token is present. `output` stays `static`,
   no Netlify adapter (Studio-only means no SSR).
3. **Resilient data layer.** `src/lib/storyblok.ts` helpers return `[]`/`null` when no
   API is configured. `getStaticPaths` in `services/[slug]` (and blog/locations/
   projects) degrade to empty instead of throwing.
4. **Recover service content** from git `f54beee` into a new `src/data/services.ts`
   (`services: ServiceDef[]` — slug, title, blurb, heroIntro, includes, pricing,
   pricingNotes, faqs, anchorPrice, image key). Wire the homepage **Services** section,
   `/services/[slug]`, and the SEO service/offer graph to this code data.
5. **Homepage FAQ + Gallery** already fall back; verify they render token-free.
6. **blog / locations / projects**: index pages render a brief branded "coming soon"
   empty state; no detail routes generated.
7. Add `.netlify` to `.gitignore` (already staged); remove `site/.netlify/state.json`.
8. **Verify:** `cd site && npm run build` succeeds; `npm run preview` (or Netlify
   preview tools) renders home + all three service pages + empty-state indexes with no
   console/build errors. Then commit and deploy to `main`.

**Interfaces:**
- `src/data/services.ts`: `export const services: ServiceDef[]`, `export interface
  ServiceDef`. Single source until Sanity; becomes the Phase B seed input.
- Storyblok helpers keep signatures but no-op without a token.

**Failure modes handled:** missing token, missing/empty CMS content, missing
optional images (fall back to bundled `src/assets/images/*`).

---

## Phase B — Storyblok → Sanity (Studio-only)

**Goal:** replace Storyblok as the content source for service/article/location/
project/faq/testimonial while keeping the static production build and code-owned
guardrails.

**Components:**
- Dependencies: add `@sanity/client`, `@sanity/astro`, `sanity`, `@sanity/vision`,
  `astro-portabletext` (or `@portabletext/to-html`). Remove all `@storyblok/*`.
- **Sanity Studio**, embedded at `/studio` (single URL for staff), configured for the
  owner's Sanity project/dataset.
- **Schemas** mirroring the model: `service`, `article`, `location`, `project`, `faq`,
  `testimonial`, each with an SEO object (title/description/ogImage). Slugs for the
  three services locked to `locksmith`, `water-heaters`, `chimney-care`.
- **Fetch layer** `src/lib/sanity.ts`: `getService(slug)`, `getServices()`,
  `getArticles()`, `getArticle(slug)`, etc., via GROQ. `lastmod` from `_updatedAt`.
- **Renderers** `src/sanity/{Service,Article,Location,Project}.astro` replacing
  `src/storyblok/*`; Portable Text instead of Storyblok richtext.
- **Seed script** `scripts/sanity-seed.mjs` pushing `src/data/services.ts` + homepage
  FAQs into Sanity so rendered content is unchanged, now CMS-sourced.
- **Publish pipeline:** Sanity webhook → Netlify build hook → production rebuild.
- **Guardrails stay code-side:** `business.ts` pricing disclaimers, locksmith deposit/
  distance notes, lead forms, phone CTAs, verified Google review facts.
- **Removals:** `src/storyblok/`, `scripts/storyblok-*`, `src/lib/storyblok.ts`,
  `src/middleware.ts` (SSR preview gate), Storyblok deps, Storyblok env in
  `.env.example`, any Storyblok bits left in config.
- **Editor guide:** rewrite `docs/EDITOR-GUIDE.md` for Sanity in plain English.

**Constraints:** production static; visitors never hit Sanity at request time.
Tokens (`SANITY_*`) never in source; read token in Netlify env, Studio uses project
auth. Services stay residential (locksmith / water heaters / chimney care) unless the
owner adds one. Testimonials require real source URLs — never fabricate.

**Verification:** `npm run build` against the real Sanity dataset; parity check of the
three service pages vs. Phase A output; Studio edit → webhook → rebuild → live.

---

## Phase C — SEO + architecture (Joost's stack, Core + high-value)

Adopted from joost.blog/astro-seo-complete-guide, sourcing data from Sanity/code
rather than local content collections.

**Components:**
- `@jdevalk/astro-seo-graph` `<Seo>` component + linked JSON-LD `@graph`, replacing the
  hand-rolled `src/components/seo/Seo.astro`. Preserve the LocalBusiness/Locksmith,
  WebSite, WebPage, FAQPage, OfferCatalog entities already modeled; add `@id` wiring,
  `SearchAction`, and trust fields where applicable.
- Chunked sitemaps via `@astrojs/sitemap` (`chunks`, `entryLimit: 1000`); `lastmod`
  from Sanity `_updatedAt`, falling back to build time.
- Dynamic `/robots.txt` route referencing the sitemap index.
- IndexNow auto-submit integration (Bing/Yandex) with key-verification route.
- Auto OG images: `/og/[...slug].jpg` via Satori + Sharp, 1200×675 JPEG, brand
  template with title fallback; `<Seo>` derives the URL.
- RSS for the blog via `@astrojs/rss`, full content.
- Build-time SEO checks: single-H1, duplicate `<title>`/description across the corpus,
  missing `alt`, meta-length bounds, internal-link validation.
- **301 redirects for every legacy `kom.construction` URL** built from the old Wix URL
  set, in `netlify.toml`/`_redirects`. Keep the existing `/locksmith` → `/services/
  locksmith` style redirects.
- Performance defaults: Astro View Transitions (`<ClientRouter />`, viewport prefetch),
  woff2 font preload, `<Image>` for all raster assets, immutable `_astro` caching.

**Out of scope (Core choice):** schema endpoints + `/schemamap.xml`, `/llms.txt`,
per-page markdown alternates, NLWeb discovery tag. Can be added later.

**Verification:** `npm run build` passes all build-time SEO checks; Rich Results Test
on home + a service page; sitemap/robots/RSS/OG endpoints return valid output; spot
check 301s resolve.

---

## Cross-cutting / risks

- **Deploy target is `main`.** The owner's Netlify builds the production branch; Phase A
  must reach `main` to be visible. Work happens on a branch, then merges to `main`.
- **Secrets:** never commit or print `STORYBLOK_*`/`SANITY_*` values. `.env` local only;
  read tokens in Netlify env.
- **Owner blockers for Phase B:** create the Sanity project, provide `SANITY_PROJECT_ID`,
  `SANITY_DATASET`, and a read token; add the read token to Netlify env; create the
  Netlify build hook for the publish webhook.
- **Guardrail invariant across all phases:** business facts, pricing disclaimers,
  locksmith deposit/distance notes, lead forms, and verified review facts remain
  code-owned in `business.ts`, never CMS-editable.
