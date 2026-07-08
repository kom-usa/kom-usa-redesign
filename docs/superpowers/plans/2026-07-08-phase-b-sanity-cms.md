# Phase B — Storyblok → Sanity CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Storyblok with Sanity (Studio-only) as the content source for services, articles, locations, projects, FAQs, and testimonials, keeping the production build fully static and business/pricing guardrails code-owned.

**Architecture:** Astro 7 static site in `site/`. Content is fetched from Sanity **at build time** (`useCdn: false`, published perspective) via GROQ. GROQ projections return objects shaped like the existing `ServiceDef`/`Faq` types, so page components are largely unchanged. `src/data/services.ts` and `business.ts` `faqs` remain as **build-time fallbacks** so the build never fails if Sanity is empty or unreachable (this is what makes the build as resilient as Phase A). An embedded Sanity Studio is served at `/studio` for staff editing; Publish triggers a Netlify build hook.

**Tech Stack:** Astro 7, `@sanity/astro`, `@astrojs/react`, `sanity`, `@sanity/client`, `@sanity/image-url`, `@portabletext/to-html`, Netlify, Netlify Forms.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-08-sanity-seo-netlify-migration-design.md` — binding.
- Node `>=22.12.0`. Verification command from repo root: `cd site && npm run build`.
- Production stays **static**; visitors never hit Sanity at request time (all fetches are build-time, `useCdn: false`).
- Source of truth for business facts: `site/src/data/business.ts`. Do NOT create a Sanity "company settings" type. Phone `313-804-0844`, email `contact@kom-usa.com`, hours Mon–Sat 8am–5pm.
- Guardrails stay code-owned and auto-appended: `pricingDisclaimer` and `serviceGuardrails` (locksmith 50% deposit + $50 over-25mi) in `business.ts`, appended by `ServicePage.astro`. Editors cannot remove them.
- Services stay residential, exactly three, slugs locked to `locksmith`, `water-heaters`, `chimney-care`.
- Testimonials require a real `sourceUrl`. Never seed or render fabricated reviews. Never render the Gabriel Mann review.
- Production domain is `https://kom-usa.com` (already set in `astro.config.mjs` `site`).
- Secrets never in source or chat: `SANITY_API_WRITE_TOKEN` is local-only; `SANITY_PROJECT_ID`/`SANITY_DATASET` go in `.env` and Netlify env; a read token is only needed if the dataset is private.
- Netlify Forms `request-call` and `request-service` stay intact and untouched.
- `.env` is gitignored; never commit it.

## Owner prerequisites (blockers before runtime verification)

These are done by the owner in the Sanity dashboard; the coding tasks below can be written and type-checked before they exist, but Tasks 6–9 runtime verification needs them:

1. Create a Sanity project at sanity.io/manage (free plan is fine). Note the **Project ID**.
2. Create/confirm a dataset named `production` and set its **visibility to Public** (so build-time reads need no token).
3. Create a **write token** (Editor) for local seeding only → local `.env` as `SANITY_API_WRITE_TOKEN`.
4. Add `https://kom-usa.com` and `http://localhost:4321` to the project's **CORS origins** (Studio + client).
5. In Netlify: create a **build hook** named `sanity-publish` (Site config → Build & deploy → Build hooks); paste its URL into Sanity (Task 10).

## File Structure

- `site/sanity.config.ts` — Studio config: project, dataset, plugins, schema registry.
- `site/src/sanity/schemas/*.ts` — one file per document type + a shared `seo` object.
- `site/src/lib/sanity.ts` — typed GROQ fetch helpers with code fallback.
- `site/src/sanity/PortableText.astro` — renders Sanity Portable Text to HTML.
- `site/src/lib/sanity-image.ts` — `urlFor()` image URL builder.
- `site/scripts/sanity-seed.mjs` — idempotent seed from code data.
- `site/.env.example` — Sanity env contract (replaces Storyblok vars).
- Deleted at the end: `site/src/lib/storyblok.ts`, `site/src/storyblok/`, `site/scripts/storyblok-*.mjs`, `site/src/middleware.ts`.

---

### Task 1: Env contract and dependencies

**Files:**
- Modify: `site/.env.example`
- Modify: `site/package.json` (dependencies + scripts)
- Create: `site/src/env.d.ts` (or extend if present)

**Interfaces:**
- Produces: env var names `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_READ_TOKEN` (optional), `SANITY_API_WRITE_TOKEN` (local only), `SANITY_API_VERSION`.

- [ ] **Step 1: Install dependencies**

Run from `site/`:
```bash
npm install @sanity/astro @astrojs/react react react-dom sanity @sanity/client @sanity/image-url @portabletext/to-html
```
Expected: installs succeed; `package.json` gains those deps.

- [ ] **Step 2: Replace Storyblok env contract in `.env.example`**

Replace the entire file contents with:
```bash
# Sanity — copy this file to .env and fill in real values. Never commit .env.
#   SANITY_PROJECT_ID       = your Sanity project id (sanity.io/manage → project → Project ID)
#   SANITY_DATASET          = dataset name, e.g. "production" (set to PUBLIC read for token-free builds)
#   SANITY_API_VERSION      = pinned API date, e.g. 2024-10-01
#   SANITY_API_READ_TOKEN   = only needed if the dataset is PRIVATE; goes in Netlify env too
#   SANITY_API_WRITE_TOKEN  = LOCAL ONLY, used by scripts/sanity-seed.mjs. Never goes to Netlify.
SANITY_PROJECT_ID=
SANITY_DATASET=production
SANITY_API_VERSION=2024-10-01
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=
```

- [ ] **Step 3: Add seed script to `package.json`**

Add to the `"scripts"` block:
```json
"sanity:seed": "node scripts/sanity-seed.mjs"
```

- [ ] **Step 4: Add env typings** to `site/src/env.d.ts` (create if absent):
```typescript
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID: string;
  readonly SANITY_DATASET: string;
  readonly SANITY_API_VERSION: string;
  readonly SANITY_API_READ_TOKEN?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
```

- [ ] **Step 5: Verify install + typecheck**

Run: `cd site && npx astro check 2>&1 | tail -5 || true` then `npm run build`
Expected: build still succeeds (nothing wired to Sanity yet; Phase A behavior intact).

- [ ] **Step 6: Commit**
```bash
git add site/package.json site/package-lock.json site/.env.example site/src/env.d.ts
git commit -m "Phase B: add Sanity deps and env contract"
```

---

### Task 2: Configure the Sanity integration and embedded Studio

**Files:**
- Modify: `site/astro.config.mjs`
- Create: `site/sanity.config.ts` (minimal, schema added in Task 3)
- Modify: `site/public/_redirects` (Studio SPA fallback)

**Interfaces:**
- Produces: virtual module `sanity:client` (exports `sanityClient`), Studio at `/studio`.

- [ ] **Step 1: Rewrite `astro.config.mjs`** to register Sanity + React and keep static output. Replace the Storyblok block with:
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const projectId = env.SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID;
const dataset = env.SANITY_DATASET ?? process.env.SANITY_DATASET ?? 'production';
const apiVersion = env.SANITY_API_VERSION ?? process.env.SANITY_API_VERSION ?? '2024-10-01';

if (!projectId) {
  // Do NOT throw — the build must survive without Sanity (falls back to code
  // data in src/lib/sanity.ts). Warn so a misconfigured deploy is visible in logs.
  console.warn('[sanity] SANITY_PROJECT_ID is not set — building with code fallback content.');
}

export default defineConfig({
  site: 'https://kom-usa.com',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
  integrations: [
    sanity({
      projectId: projectId ?? 'placeholder',
      dataset,
      apiVersion,
      useCdn: false,
      studioBasePath: '/studio',
    }),
    react(),
    sitemap({
      filter: (page) => !page.includes('/thank-you') && !page.includes('/studio'),
    }),
  ],
});
```

- [ ] **Step 2: Create minimal `site/sanity.config.ts`**:
```typescript
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
  name: 'kom-usa',
  title: 'KOM USA',
  projectId: process.env.SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
```

- [ ] **Step 3: Add Studio SPA fallback** to the TOP of `site/public/_redirects` (before existing rules):
```
/studio/*  /studio/index.html  200
```

- [ ] **Step 4: Verify build** (schemas come next; create a temporary empty registry so it compiles)

Create `site/src/sanity/schemas/index.ts` with `export const schemaTypes = [];`
Run: `cd site && npm run build`
Expected: build succeeds; `dist/studio/index.html` exists (`ls dist/studio/index.html`).

- [ ] **Step 5: Commit**
```bash
git add site/astro.config.mjs site/sanity.config.ts site/public/_redirects site/src/sanity/schemas/index.ts
git commit -m "Phase B: register Sanity integration + embedded Studio at /studio"
```

---

### Task 3: Define Sanity schemas

**Files:**
- Create: `site/src/sanity/schemas/objects/seo.ts`
- Create: `site/src/sanity/schemas/objects/priceRow.ts`
- Create: `site/src/sanity/schemas/objects/faqItem.ts`
- Create: `site/src/sanity/schemas/service.ts`
- Create: `site/src/sanity/schemas/faq.ts`
- Create: `site/src/sanity/schemas/article.ts`
- Create: `site/src/sanity/schemas/location.ts`
- Create: `site/src/sanity/schemas/project.ts`
- Create: `site/src/sanity/schemas/testimonial.ts`
- Modify: `site/src/sanity/schemas/index.ts`

**Interfaces:**
- Produces: document types `service`, `faq`, `article`, `location`, `project`, `testimonial`; object types `seo`, `priceRow`, `faqItem`. `service` fields map 1:1 to `ServiceDef` (Task 4 GROQ relies on these exact field names).

- [ ] **Step 1: Shared objects.** `objects/seo.ts`:
```typescript
import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'seo', title: 'SEO', type: 'object',
  fields: [
    defineField({ name: 'title', title: 'SEO title', type: 'string', validation: (r) => r.max(65) }),
    defineField({ name: 'description', title: 'Meta description', type: 'text', rows: 2, validation: (r) => r.max(160) }),
  ],
});
```
`objects/priceRow.ts`:
```typescript
import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'priceRow', title: 'Price row', type: 'object',
  fields: [
    defineField({ name: 'service', title: 'Item', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'detail', title: 'Detail (optional)', type: 'string' }),
    defineField({ name: 'price', title: 'Price', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'service', subtitle: 'price' } },
});
```
`objects/faqItem.ts`:
```typescript
import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'faqItem', title: 'FAQ item', type: 'object',
  fields: [
    defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'answer', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'question' } },
});
```

- [ ] **Step 2: `service.ts`** (fields named to match `ServiceDef`):
```typescript
import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'service', title: 'Service', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'shortTitle', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'anchorPrice', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'blurb', type: 'text', rows: 2, validation: (r) => r.required() }),
    defineField({ name: 'heroIntro', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroAlt', type: 'string' }),
    defineField({ name: 'includes', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'pricing', type: 'array', of: [{ type: 'priceRow' }] }),
    defineField({ name: 'pricingNote', title: 'Extra pricing note (optional)', type: 'text', rows: 2 }),
    defineField({ name: 'faqs', type: 'array', of: [{ type: 'faqItem' }] }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'anchorPrice' } },
});
```

- [ ] **Step 3: `faq.ts`** (homepage FAQ, with placement):
```typescript
import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'faq', title: 'FAQ (homepage)', type: 'document',
  fields: [
    defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'answer', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({ name: 'placement', type: 'string', options: { list: ['homepage'] }, initialValue: 'homepage' }),
    defineField({ name: 'order', type: 'number' }),
  ],
  orderings: [{ name: 'order', title: 'Order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'question' } },
});
```

- [ ] **Step 4: `article.ts`**:
```typescript
import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'article', title: 'Blog article', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'category', type: 'string', options: { list: ['blog', 'update'] }, initialValue: 'blog' }),
    defineField({ name: 'excerpt', type: 'text', rows: 2 }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'coverAlt', type: 'string' }),
    defineField({ name: 'date', type: 'datetime' }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  orderings: [{ name: 'date', title: 'Newest', by: [{ field: 'date', direction: 'desc' }] }],
});
```

- [ ] **Step 5: `location.ts`**:
```typescript
import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'location', title: 'Location (city page)', type: 'document',
  fields: [
    defineField({ name: 'city', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'city' }, validation: (r) => r.required() }),
    defineField({ name: 'heroIntro', type: 'text', rows: 3 }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
});
```

- [ ] **Step 6: `project.ts`**:
```typescript
import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'project', title: 'Project', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'date', type: 'datetime' }),
    defineField({ name: 'photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], validation: (r) => r.min(1) }),
    defineField({ name: 'problem', type: 'text', rows: 2 }),
    defineField({ name: 'work', type: 'text', rows: 2 }),
    defineField({ name: 'result', type: 'text', rows: 2 }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
});
```

- [ ] **Step 7: `testimonial.ts`** (real source required):
```typescript
import { defineType, defineField } from 'sanity';
export default defineType({
  name: 'testimonial', title: 'Testimonial', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'quote', type: 'text', rows: 3, validation: (r) => r.required() }),
    defineField({
      name: 'sourceUrl', title: 'Source URL (required — real reviews only)', type: 'url',
      validation: (r) => r.required().uri({ scheme: ['http', 'https'] }),
    }),
  ],
});
```

- [ ] **Step 8: Register all in `index.ts`**:
```typescript
import seo from './objects/seo';
import priceRow from './objects/priceRow';
import faqItem from './objects/faqItem';
import service from './service';
import faq from './faq';
import article from './article';
import location from './location';
import project from './project';
import testimonial from './testimonial';

export const schemaTypes = [seo, priceRow, faqItem, service, faq, article, location, project, testimonial];
```

- [ ] **Step 9: Verify Studio compiles**

Run: `cd site && npm run build && ls dist/studio/index.html`
Expected: build succeeds; Studio shell present. (Full Studio UI is verified in the browser in Task 6 once a project exists.)

- [ ] **Step 10: Commit**
```bash
git add site/src/sanity/schemas
git commit -m "Phase B: define Sanity schemas (service, faq, article, location, project, testimonial)"
```

---

### Task 4: GROQ fetch layer with code fallback

**Files:**
- Create: `site/src/lib/sanity.ts`
- Create: `site/src/lib/sanity-image.ts`
- Test: `site/scripts/check-sanity-fetch.mjs` (throwaway assertion script)

**Interfaces:**
- Consumes: `sanity:client` (`sanityClient`), `ServiceDef` from `../data/services`, `Faq` from `../data/business`.
- Produces: `getServices(): Promise<ServiceDef[]>`, `getService(slug): Promise<ServiceDef | null>`, `getHomepageFaqs(): Promise<Faq[]>`, `getArticles()`, `getArticle(slug)`, `getLocations()`, `getLocation(slug)`, `getProjects()`, `getProject(slug)`. Each falls back to code data (services/faqs) or `[]`/`null` on error/empty.

- [ ] **Step 1: Image builder** `sanity-image.ts`:
```typescript
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from 'sanity:client';
const builder = imageUrlBuilder(sanityClient);
export function urlFor(source: any) { return builder.image(source); }
```

- [ ] **Step 2: Fetch helpers** `sanity.ts` (GROQ projects to existing shapes; falls back to code):
```typescript
import { sanityClient } from 'sanity:client';
import { services as codeServices, type ServiceDef } from '../data/services';
import { faqs as codeFaqs, type Faq } from '../data/business';

const SERVICE_PROJECTION = `{
  "slug": slug.current, title, shortTitle, anchorPrice, blurb, heroIntro,
  "heroImage": heroImage, heroAlt,
  "includes": includes[],
  "pricing": pricing[]{ service, detail, price },
  "pricingNote": pricingNote,
  "faqs": faqs[]{ question, answer },
  "seoTitle": seo.title, "seoDescription": seo.description,
  "preselectService": shortTitle
}`;

async function safe<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    const v = await fn();
    return v == null || (Array.isArray(v) && v.length === 0) ? fallback : v;
  } catch (e) {
    console.warn(`[sanity] ${label} failed, using fallback:`, (e as Error).message);
    return fallback;
  }
}

export async function getServices(): Promise<ServiceDef[]> {
  return safe(
    () => sanityClient.fetch<ServiceDef[]>(`*[_type == "service"] | order(anchorPrice asc) ${SERVICE_PROJECTION}`),
    codeServices, 'getServices',
  );
}
export async function getService(slug: string): Promise<ServiceDef | null> {
  return safe(
    () => sanityClient.fetch<ServiceDef | null>(`*[_type == "service" && slug.current == $slug][0] ${SERVICE_PROJECTION}`, { slug }),
    codeServices.find((s) => s.slug === slug) ?? null, 'getService',
  );
}
export async function getHomepageFaqs(): Promise<Faq[]> {
  return safe(
    () => sanityClient.fetch<Faq[]>(`*[_type == "faq" && placement == "homepage"] | order(order asc){ question, answer }`),
    codeFaqs, 'getHomepageFaqs',
  );
}
export async function getArticles() {
  return safe(() => sanityClient.fetch(`*[_type == "article" && defined(slug.current)] | order(date desc){
    "slug": slug.current, title, category, excerpt, date, "coverImage": coverImage, coverAlt }`), [], 'getArticles');
}
export async function getArticle(slug: string) {
  return safe(() => sanityClient.fetch(`*[_type == "article" && slug.current == $slug][0]{
    "slug": slug.current, title, category, excerpt, date, "coverImage": coverImage, coverAlt, body,
    "seoTitle": seo.title, "seoDescription": seo.description }`, { slug }), null, 'getArticle');
}
export async function getLocations() {
  return safe(() => sanityClient.fetch(`*[_type == "location" && defined(slug.current)] | order(city asc){
    "slug": slug.current, city, heroIntro }`), [], 'getLocations');
}
export async function getLocation(slug: string) {
  return safe(() => sanityClient.fetch(`*[_type == "location" && slug.current == $slug][0]{
    "slug": slug.current, city, heroIntro, body, "seoTitle": seo.title, "seoDescription": seo.description }`, { slug }), null, 'getLocation');
}
export async function getProjects() {
  return safe(() => sanityClient.fetch(`*[_type == "project" && defined(slug.current)] | order(date desc){
    "slug": slug.current, title, date, photos, problem, work, result }`), [], 'getProjects');
}
export async function getProject(slug: string) {
  return safe(() => sanityClient.fetch(`*[_type == "project" && slug.current == $slug][0]{
    "slug": slug.current, title, date, photos, problem, work, result,
    "seoTitle": seo.title, "seoDescription": seo.description }`, { slug }), null, 'getProject');
}
```

- [ ] **Step 3: Write the fallback assertion (the "failing test")** — `scripts/check-sanity-fetch.mjs`:
```javascript
// Verifies the fallback path: with no Sanity project reachable, getServices()
// must return the 3 code services, not throw. Run after build wiring exists.
import assert from 'node:assert';
// This is a smoke check run via the built site; see Step 4 for how to exercise it.
console.log('Use the build in Step 4 to verify fallback; this file documents the expectation.');
```

- [ ] **Step 4: Verify fallback via build (no Sanity configured)**

Temporarily ensure `SANITY_PROJECT_ID` is unset, then:
```bash
cd site && mv .env .env.bak 2>/dev/null; npm run build; mv .env.bak .env 2>/dev/null
grep -l "Unlocks from" dist/index.html
```
Expected: build succeeds and homepage still shows the 3 code services (fallback works). This is the regression guard that Phase A resilience is preserved.

- [ ] **Step 5: Commit**
```bash
git add site/src/lib/sanity.ts site/src/lib/sanity-image.ts site/scripts/check-sanity-fetch.mjs
git commit -m "Phase B: GROQ fetch layer with code-data fallback"
```

---

### Task 5: Portable Text renderer

**Files:**
- Create: `site/src/sanity/PortableText.astro`

**Interfaces:**
- Consumes: `@portabletext/to-html`, `urlFor` from `../lib/sanity-image`.
- Produces: `<PortableText value={blocks} />` rendering rich text + inline images with KOM prose classes.

- [ ] **Step 1: Implement** `PortableText.astro`:
```astro
---
import { toHTML } from '@portabletext/to-html';
import { urlFor } from '../lib/sanity-image';

interface Props { value: any }
const { value } = Astro.props;

const html = value ? toHTML(value, {
  components: {
    types: {
      image: ({ value }) =>
        value?.asset
          ? `<img src="${urlFor(value).width(1200).auto('format').url()}" alt="${value.alt ?? ''}" loading="lazy" class="rounded-xl my-6 w-full" />`
          : '',
    },
    marks: {
      link: ({ children, value }) => {
        const href = value?.href ?? '';
        const safe = /^(https?:|mailto:|tel:|\/)/i.test(href) ? href : '#';
        const ext = safe.startsWith('http');
        return `<a href="${safe}"${ext ? ' rel="noopener noreferrer" target="_blank"' : ''} class="text-kom-field underline">${children}</a>`;
      },
    },
  },
}) : '';
---
<div class="prose max-w-none prose-headings:text-kom-charcoal-deep prose-a:text-kom-field" set:html={html} />
```
(Note: the `href` scheme check closes the Storyblok "unsanitized link" follow-up from prior notes.)

- [ ] **Step 2: Verify build** — `cd site && npm run build`. Expected: succeeds (component unused so far).

- [ ] **Step 3: Commit**
```bash
git add site/src/sanity/PortableText.astro
git commit -m "Phase B: Portable Text renderer with sanitized links"
```

---

### Task 6: Seed Sanity from code data + verify Studio

**Files:**
- Create: `site/scripts/sanity-seed.mjs`

**Interfaces:**
- Consumes: `@sanity/client`, `SANITY_API_WRITE_TOKEN`, the recovered content in `src/data/services.ts` and `business.ts` `faqs`. (Import the data by reading the TS via a small inline copy — the script is plain Node, so hardcode the seed payload derived from those files to avoid a TS build step.)
- Produces: documents in the dataset with fixed `_id`s (idempotent by id).

- [ ] **Step 1: Owner prerequisites present.** Confirm local `.env` has `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_WRITE_TOKEN`. If not, stop and complete "Owner prerequisites".

- [ ] **Step 2: Implement seed script** `scripts/sanity-seed.mjs`:
```javascript
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { config } from 'dotenv';
config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || '2024-10-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// Import the code data at runtime via a tiny TS→JSON shim: read the module
// through a dynamic import of a compiled copy is overkill; instead the three
// services + faqs are defined here as the seed source of record. Keep in sync
// with src/data/services.ts on first run only (afterwards Sanity is the source).
const services = JSON.parse(readFileSync(new URL('./seed-services.json', import.meta.url)));
const faqs = JSON.parse(readFileSync(new URL('./seed-faqs.json', import.meta.url)));

async function run() {
  const tx = client.transaction();
  for (const s of services) {
    tx.createOrReplace({
      _id: `service-${s.slug}`, _type: 'service',
      title: s.title, shortTitle: s.shortTitle, slug: { _type: 'slug', current: s.slug },
      anchorPrice: s.anchorPrice, blurb: s.blurb, heroIntro: s.heroIntro, heroAlt: s.heroAlt,
      includes: s.includes, pricing: s.pricing.map((p, i) => ({ _key: `p${i}`, _type: 'priceRow', ...p })),
      pricingNote: s.pricingNote, faqs: s.faqs.map((f, i) => ({ _key: `f${i}`, _type: 'faqItem', ...f })),
      seo: { title: s.seoTitle, description: s.seoDescription },
    });
  }
  faqs.forEach((f, i) => tx.createOrReplace({
    _id: `faq-home-${i}`, _type: 'faq', question: f.question, answer: f.answer, placement: 'homepage', order: i,
  }));
  const res = await tx.commit();
  console.log(`Seeded ${services.length} services + ${faqs.length} FAQs (${res.results.length} docs).`);
}
run().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: Generate the seed JSON from the code data** (one-time, keeps the script free of TS imports):
```bash
cd site
node --input-type=module -e "import('./src/data/services.ts')" 2>/dev/null || true
```
If the direct import fails (TS), create `scripts/seed-services.json` and `scripts/seed-faqs.json` by copying the arrays from `src/data/services.ts` (`services`) and `src/data/business.ts` (`faqs`) as JSON (strip TS syntax; keep fields `slug,title,shortTitle,anchorPrice,blurb,heroIntro,heroAlt,includes,pricing,pricingNote,faqs,seoTitle,seoDescription`). Install `dotenv`: `npm install -D dotenv`.

- [ ] **Step 4: Run the seed and confirm idempotence**
```bash
cd site && npm run sanity:seed && npm run sanity:seed
```
Expected: prints "Seeded 3 services + 7 FAQs" both times (createOrReplace = idempotent, no duplicates).

- [ ] **Step 5: Verify Studio in the browser**

Run: `cd site && npx astro dev` then open `http://localhost:4321/studio`, log in, confirm the 3 services + 7 FAQs are visible and editable.

- [ ] **Step 6: Commit**
```bash
git add site/scripts/sanity-seed.mjs site/scripts/seed-services.json site/scripts/seed-faqs.json site/package.json site/package-lock.json
git commit -m "Phase B: idempotent Sanity seed from code data"
```

---

### Task 7: Point services + nav at Sanity

**Files:**
- Modify: `site/src/pages/services/[slug].astro`
- Modify: `site/src/components/sections/Services.astro`
- Modify: `site/src/components/layout/Header.astro`
- Modify: `site/src/components/layout/Footer.astro`
- Modify: `site/src/layouts/ServicePage.astro` (hero image: support Sanity image URL)

**Interfaces:**
- Consumes: `getServices`, `getService` from `../../lib/sanity`; `urlFor` from `../../lib/sanity-image`.
- Produces: identical URLs `/services/{locksmith,water-heaters,chimney-care}`; guardrails still appended in `ServicePage`.

- [ ] **Step 1: `services/[slug].astro`** — build paths from Sanity (fallback to code via helper):
```astro
---
import ServicePage from "../../layouts/ServicePage.astro";
import { getServices } from "../../lib/sanity";
import doorLock from "../../assets/images/door-lock.jpg";
import workerElectrical from "../../assets/images/worker-electrical.jpg";
import fireplaceChimney from "../../assets/images/fireplace-chimney.jpg";
import homeExterior from "../../assets/images/home-exterior.jpg";

const localHero = { locksmith: doorLock, "water-heaters": workerElectrical, "chimney-care": fireplaceChimney };

export async function getStaticPaths() {
  const services = await getServices();
  return services.map((service) => ({ params: { slug: service.slug }, props: { service } }));
}
const { service } = Astro.props;
const heroFallback = localHero[service.slug] ?? homeExterior;
---
<ServicePage service={service} heroImage={heroFallback} />
```

- [ ] **Step 2: `ServicePage.astro`** — accept an optional Sanity hero image, preferring it over the bundled fallback. Change the `Props` and hero markup:
```astro
// in frontmatter Props:
interface Props { service: ServiceDef; heroImage: ImageMetadata }
// keep guardrail pricingNotes logic unchanged.
// hero: if service.heroImage (Sanity asset) exists, use urlFor; else <Image src={heroImage}/>.
```
Add `import { urlFor } from "../lib/sanity-image";` and in the hero:
```astro
{ (service as any).heroImage?.asset ? (
  <img src={urlFor((service as any).heroImage).width(1000).auto('format').url()} alt={service.heroAlt} class="reveal h-full min-h-72 w-full rounded-xl object-cover shadow-card-hover" style="--rd:120ms" loading="eager" />
) : (
  <Image src={heroImage} alt={service.heroAlt} class="reveal h-full min-h-72 w-full rounded-xl object-cover shadow-card-hover" style="--rd:120ms" widths={[520,760,1000]} sizes="(min-width:1024px) 45vw, 100vw" loading="eager" />
) }
```

- [ ] **Step 3: `Services.astro`** — swap `import { services }` for `const services = await getServices();`:
```astro
import { getServices } from "../../lib/sanity";
const services = await getServices();
```
(Card markup unchanged; still uses `service.slug/anchorPrice/title/blurb` and the bundled `imageMap`.)

- [ ] **Step 4: `Header.astro` / `Footer.astro`** — replace `import { services }` with:
```astro
import { getServices } from "../../lib/sanity";
const services = await getServices();
```
(Both render `service.title` + `service.slug`; unchanged otherwise.)

- [ ] **Step 5: Verify parity**

Run: `cd site && npm run build` (with `.env` present → real Sanity). Then:
```bash
grep -o "Kwikset smart keypad" dist/services/locksmith/index.html
grep -o "50% deposit" dist/services/locksmith/index.html   # guardrail still appended
grep -c "Unlocks from" dist/index.html
```
Expected: all present — Sanity content renders and guardrails intact. Compare rendered service pages against Phase A output (same copy/pricing).

- [ ] **Step 6: Commit**
```bash
git add site/src/pages/services/'[slug]'.astro site/src/layouts/ServicePage.astro site/src/components/sections/Services.astro site/src/components/layout/Header.astro site/src/components/layout/Footer.astro
git commit -m "Phase B: drive services and nav from Sanity (guardrails still code-owned)"
```

---

### Task 8: Point homepage FAQ, Gallery, and SEO graph at Sanity

**Files:**
- Modify: `site/src/components/sections/Faq.astro`
- Modify: `site/src/components/sections/Gallery.astro`
- Modify: `site/src/components/seo/Seo.astro`

**Interfaces:**
- Consumes: `getHomepageFaqs`, `getServices`, `getProjects` from `../../lib/sanity`; `urlFor`.

- [ ] **Step 1: `Faq.astro`** — source FAQs from Sanity (fallback to code):
```astro
import { getHomepageFaqs } from "../../lib/sanity";
const faqs = await getHomepageFaqs();
```
(Render block unchanged; keep the `faqs.length > 0` guard so an empty result hides the section.)

- [ ] **Step 2: `Gallery.astro`** — source projects from Sanity, keep stock-photo fallback when <3:
```astro
import { getProjects } from "../../lib/sanity";
import { urlFor } from "../../lib/sanity-image";
const projects = await getProjects();
const usesProjects = projects.length >= 3;
const projectPhotos = usesProjects ? projects.slice(0, 6).map((p) => ({
  src: p.photos?.[0] ? urlFor(p.photos[0]).width(800).height(600).auto('format').url() : undefined,
  title: p.title, slug: p.slug,
})).filter((p) => p.src) : [];
```
(Keep the existing `stockPhotos` array and the `usesProjects ? ... : stockPhotos` markup.)

- [ ] **Step 3: `Seo.astro`** — source the service/FAQ graph from Sanity:
```astro
import { getServices, getHomepageFaqs } from "../../lib/sanity";
const serviceList = includeBusinessGraph ? await getServices() : [];
const faqList = includeBusinessGraph ? await getHomepageFaqs() : [];
```
(The `knowsAbout`/`makesOffer`/`hasOfferCatalog`/`FAQPage` mapping already reads `s.title`, `s.pricing[].service/.price`, `faq.question/.answer` — unchanged.)

- [ ] **Step 4: Verify**

Run: `cd site && npm run build` then:
```bash
grep -o "OfferCatalog\|FAQPage\|LocalBusiness" dist/index.html | sort -u
grep -c "What happens after I send the form" dist/index.html
```
Expected: JSON-LD entities present; homepage FAQ still rendered from Sanity.

- [ ] **Step 5: Commit**
```bash
git add site/src/components/sections/Faq.astro site/src/components/sections/Gallery.astro site/src/components/seo/Seo.astro
git commit -m "Phase B: source homepage FAQ, gallery, and SEO graph from Sanity"
```

---

### Task 9: Blog, locations, projects routes on Sanity

**Files:**
- Modify: `site/src/pages/blog/index.astro`
- Modify: `site/src/pages/blog/[slug].astro`
- Modify: `site/src/pages/locations/index.astro`
- Modify: `site/src/pages/locations/[slug].astro`
- Modify: `site/src/pages/projects/index.astro`
- Modify: `site/src/pages/projects/[slug].astro`

**Interfaces:**
- Consumes: `getArticles/getArticle/getLocations/getLocation/getProjects/getProject` from `../../lib/sanity`; `PortableText`; `urlFor`.

- [ ] **Step 1: Blog index** — replace Storyblok fetch:
```astro
import { getArticles } from "../../lib/sanity";
import { urlFor } from "../../lib/sanity-image";
const articles = await getArticles();
```
Update the map to use `article.slug`, `article.title`, `article.category`, `article.excerpt`, `article.date` (format with `Intl.DateTimeFormat`), and cover via `article.coverImage ? urlFor(article.coverImage).width(800).auto('format').url() : undefined`. Keep the existing `length === 0` "No posts yet — check back soon." empty state.

- [ ] **Step 2: Blog detail** `blog/[slug].astro`:
```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import PortableText from "../../sanity/PortableText.astro";
import { getArticles, getArticle } from "../../lib/sanity";
export async function getStaticPaths() {
  const articles = await getArticles();
  return articles.map((a) => ({ params: { slug: a.slug } }));
}
const article = await getArticle(Astro.params.slug);
if (!article) return Astro.redirect("/404");
---
<BaseLayout title={article.seoTitle ?? `${article.title} | KOM USA`} description={article.seoDescription ?? article.excerpt ?? ""}>
  <article class="section-pad mx-auto max-w-3xl px-4 sm:px-6">
    <h1 class="text-kom-charcoal-deep text-4xl font-black">{article.title}</h1>
    <PortableText value={article.body} />
  </article>
</BaseLayout>
```

- [ ] **Step 3: Locations index + detail** — same pattern: `getLocations()` for index (keep "City pages are coming soon…" empty state), `getLocation(slug)` + `getLocations()` for `getStaticPaths`, render `city`, `heroIntro`, `<PortableText value={location.body} />`, and include `LeadCallForm` + the code-owned service-area disclaimer.

- [ ] **Step 4: Projects index + detail** — `getProjects()` for index (keep "Project photos are coming soon." empty state; render `urlFor(photos[0])`), `getProject(slug)` for detail rendering `problem`/`work`/`result` + photo gallery.

- [ ] **Step 5: Verify**

Run: `cd site && npm run build`. Expected: succeeds. With no blog/location/project docs seeded yet, indexes show their empty states; once the owner adds a doc in Studio, it appears after rebuild. Add one test article in Studio, rebuild, confirm `/blog/<slug>/index.html` exists.

- [ ] **Step 6: Commit**
```bash
git add site/src/pages/blog site/src/pages/locations site/src/pages/projects
git commit -m "Phase B: render blog, locations, projects from Sanity"
```

---

### Task 10: Publish → Netlify rebuild webhook

**Files:**
- Docs only: `docs/EDITOR-GUIDE.md` (Task 12) references this; no code file.

- [ ] **Step 1:** In Netlify, create build hook `sanity-publish` (Site config → Build & deploy → Build hooks). Copy the URL.
- [ ] **Step 2:** In Sanity (sanity.io/manage → API → Webhooks), add a webhook: trigger on create/update/delete/publish/unpublish for the dataset, method POST, URL = the Netlify build hook URL, no filter needed.
- [ ] **Step 3: Verify** — edit a service price in Studio, Publish, confirm a Netlify production deploy starts within ~1 min and the change is live after it completes.
- [ ] **Step 4:** No commit (external config). Record the hook name in `docs/EDITOR-GUIDE.md` in Task 12.

---

### Task 11: Remove Storyblok entirely

**Files:**
- Delete: `site/src/lib/storyblok.ts`, `site/src/storyblok/` (Article/Location/Project/Service + .gitkeep), `site/scripts/storyblok-setup.mjs`, `site/scripts/storyblok-seed.mjs`, `site/scripts/storyblok-webhook.mjs`, `site/scripts/storyblok-lib.mjs`, `site/src/middleware.ts`
- Modify: `site/package.json` (remove `@storyblok/astro`)
- Delete branch: `preview` (local + `kom-usa`/`origin`)

- [ ] **Step 1: Confirm no imports remain**
```bash
cd site && grep -rn "storyblok\|@storyblok\|getLiveStory\|useStoryblokApi" src scripts || echo "clean"
```
Expected: `clean` (Tasks 7–9 removed the last usages). If any remain, fix before deleting.

- [ ] **Step 2: Delete files**
```bash
cd site
git rm -r src/storyblok src/lib/storyblok.ts src/middleware.ts scripts/storyblok-*.mjs
npm uninstall @storyblok/astro
```

- [ ] **Step 3: Verify build**

Run: `cd site && npm run build`. Expected: succeeds with no Storyblok references.

- [ ] **Step 4: Retire the preview branch**
```bash
git push kom-usa --delete preview
git push origin --delete preview
git branch -D preview 2>/dev/null || true
```

- [ ] **Step 5: Commit**
```bash
git add -A
git commit -m "Phase B: remove Storyblok integration, scripts, preview middleware and branch"
```

---

### Task 12: Rewrite the editor guide for Sanity

**Files:**
- Rewrite: `docs/EDITOR-GUIDE.md`

- [ ] **Step 1:** Write in plain English for non-technical staff (per owner convention). Cover: logging in at `kom-usa.com/studio`; editing a service's copy/pricing rows/FAQs; what Publish does (triggers a live rebuild via the `sanity-publish` hook, live in ~1 min); adding a blog article; adding a city page; adding a project (needs ≥1 photo); adding a testimonial (**source URL required — real reviews only**); which things they can't edit because they are code-owned guardrails (phone, hours, pricing disclaimer, locksmith deposit/distance lines); "do not paste secrets"; who to ask for new fields.
- [ ] **Step 2: Read-through** as a staff user; remove jargon.
- [ ] **Step 3: Commit**
```bash
git add docs/EDITOR-GUIDE.md
git commit -m "Phase B: Sanity staff editor guide"
```

---

### Task 13: Final verification and deploy

- [ ] **Step 1:** `cd site && npm run build` — clean, all pages present.
- [ ] **Step 2:** Preview: `npx astro preview --port 4330`; browser-check home, 3 services (content from Sanity, guardrails present), blog/locations/projects (empty states or seeded docs), `/studio` loads, contact forms present, JSON-LD valid.
- [ ] **Step 3:** Confirm fallback resilience: temporarily unset `SANITY_PROJECT_ID`, `npm run build`, confirm the site still builds with code content, then restore.
- [ ] **Step 4:** In Netlify env, set `SANITY_PROJECT_ID`, `SANITY_DATASET` (+ read token only if the dataset is private). Do NOT set `SANITY_API_WRITE_TOKEN`.
- [ ] **Step 5:** Merge to `main`, push `kom-usa main` (+ `origin main`); confirm the production deploy is green and Studio is reachable at `kom-usa.com/studio`.
- [ ] **Step 6:** Publish a trivial edit in Studio; confirm the webhook rebuild goes live.
