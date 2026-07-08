# Phase C — SEO + Architecture Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Several tasks also call the project's `astro-seo` skill — invoke it as instructed; it emits current drop-in code for `@jdevalk/astro-seo-graph`.

**Goal:** Adopt the "Core + high-value" SEO stack from joost.blog/astro-seo-complete-guide — centralized `<Seo>` + linked JSON-LD `@graph`, chunked sitemaps, dynamic robots.txt, IndexNow, auto OG images, RSS, build-time SEO checks, legacy-URL 301s, and performance defaults — sourcing data from Sanity/code rather than local content collections.

**Architecture:** Astro 7 static site in `site/`. SEO metadata is centralized through `@jdevalk/astro-seo-graph`'s `<Seo>` component (replacing the hand-rolled `src/components/seo/Seo.astro`), which emits head tags + a linked `@graph`. Build-time SEO checks run as an integration and can fail the build. Data comes from the Phase B Sanity helpers (`src/lib/sanity.ts`) and code (`business.ts`).

**Tech Stack:** Astro 7, `@jdevalk/astro-seo-graph`, `@astrojs/sitemap`, `@astrojs/rss`, `satori`, `sharp`, `@fontsource/nunito-sans`, Netlify.

**Prerequisite:** Phase B (Sanity) is merged and the site builds from Sanity with code fallback. Phase C sits on top.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-08-sanity-seo-netlify-migration-design.md` — binding.
- Node `>=22.12.0`. Verification: `cd site && npm run build`.
- Production static; canonical domain `https://kom-usa.com` (set in `astro.config.mjs`).
- **Pre-launch:** the `X-Robots-Tag: noindex, nofollow` header in root `netlify.toml` stays until launch; do not remove it in this phase. SEO endpoints (sitemap, OG, RSS) are built but the site remains noindexed until go-live.
- Business facts / guardrails remain code-owned in `business.ts`.
- **Out of scope (Core choice):** schema endpoints + `/schemamap.xml`, `/llms.txt`, per-page markdown alternates, NLWeb `<link rel="nlweb">`. Do not implement these.
- OG images: 1200×675 JPEG (per Google Discover minimum + 16:9).
- Keep existing Netlify Forms and `/locksmith` → `/services/locksmith` redirects intact.

## Owner prerequisites

- **Legacy URL inventory (Task 8):** export the live Wix `kom.construction` URL list (Google Search Console → Pages report + Wix `sitemap.xml`). Needed to build the 301 map. Without it, Task 8 ships only the already-known redirects.
- **IndexNow (Task 5):** no account needed; a key is self-generated. After launch, submit the sitemap in Google Search Console + Bing Webmaster Tools (not part of this build).

## File Structure

- `site/src/components/seo/Seo.astro` — replaced: thin wrapper over `@jdevalk/astro-seo-graph` `<Seo>` + graph builder.
- `site/src/lib/seo-graph.ts` — assembles the site-wide `@graph` (Organization/LocalBusiness, WebSite + SearchAction, etc.).
- `site/src/pages/robots.txt.ts` — dynamic robots route.
- `site/src/pages/og/[...slug].jpg.ts` — Satori+Sharp OG image endpoint.
- `site/src/pages/rss.xml.ts` — blog RSS.
- `site/src/lib/og-template.ts` — Satori JSX template + font loading.
- `site/public/_redirects` — extended legacy 301 map.
- `site/src/layouts/BaseLayout.astro` — View Transitions, font preload, `<Seo>` wiring.
- `site/astro.config.mjs` — `seoGraph()` integration (build-time checks + IndexNow), sitemap `chunks`/`serialize`.

---

### Task 1: Install SEO packages and register the seo-graph integration

**Files:**
- Modify: `site/package.json`
- Modify: `site/astro.config.mjs`

**Interfaces:**
- Produces: `@jdevalk/astro-seo-graph` `<Seo>`/`seoGraph()` available; `satori`, `sharp`, `@astrojs/rss` installed.

- [ ] **Step 1: Install**
```bash
cd site && npm install @jdevalk/astro-seo-graph @astrojs/rss satori sharp
```

- [ ] **Step 2: Invoke the `astro-seo` skill** to get the current, correct `seoGraph()` integration snippet and confirm the package's exact export names/props for this version. Follow its output for the `astro.config.mjs` integration block. Configure it with: build-time checks **enabled** (single-H1, duplicate title/description, missing `alt`, meta-length, internal-link validation), IndexNow host `kom-usa.com` + siteUrl `https://kom-usa.com` (key route added in Task 5), and **`llmsTxt` disabled** (out of scope).

- [ ] **Step 3: Add the integration to `astro.config.mjs`** integrations array (exact call per the skill's output), keeping `sanity()`, `react()`, and `sitemap()`.

- [ ] **Step 4: Verify build** — `cd site && npm run build`. Expected: succeeds; build-time SEO check output appears in the log (warnings are fine at this stage).

- [ ] **Step 5: Commit**
```bash
git add site/package.json site/package-lock.json site/astro.config.mjs
git commit -m "Phase C: install astro-seo-graph + SEO deps, enable build-time checks"
```

---

### Task 2: Replace Seo.astro with the astro-seo-graph `<Seo>` + linked graph

**Files:**
- Create: `site/src/lib/seo-graph.ts`
- Rewrite: `site/src/components/seo/Seo.astro`
- Modify: `site/src/layouts/BaseLayout.astro` (uses the new Seo props)

**Interfaces:**
- Consumes: `business`, `googleReviews`, `serviceAreaCities` from `../../data/business`; `getServices`, `getHomepageFaqs` from `../../lib/sanity`.
- Produces: `<Seo title description ogImage noindex includeBusinessGraph />` — same prop surface as today, so `BaseLayout`/pages don't change their call sites.

- [ ] **Step 1: Invoke the `astro-seo` skill** for the site type "local business" to generate: (a) the `<Seo>` usage with correct props for this package version, (b) the `@graph` builder shape (Organization/LocalBusiness with `@id` wiring, WebSite + `SearchAction`, WebPage, FAQPage, `OfferCatalog`), and (c) the `seoSchema`/graph helpers to import. Use its output as the authoritative API.

- [ ] **Step 2: Build `seo-graph.ts`** using the skill's helpers, porting the entities already modeled in the current `Seo.astro`: `LocalBusiness`+`Locksmith` (telephone, email, `areaServed` from `serviceAreaCities`, `openingHoursSpecification` Mon–Sat 08:00–17:00, `aggregateRating` 4.7/58, `sameAs` Google reviews URL, `knowsAbout`/`makesOffer` from services, `hasOfferCatalog` from service pricing filtered to `/^\$[\d,]+$/` or `from `), `WebSite` (+`SearchAction`), `WebPage`, `FAQPage` (homepage FAQs). Add trust fields where the package supports them (`copyrightHolder`, `copyrightYear`).

- [ ] **Step 3: Rewrite `Seo.astro`** as a thin wrapper: same `Props` (`title, description, ogImage?, ogImageAlt?, noindex?, includeBusinessGraph?`), fetch `getServices()`/`getHomepageFaqs()` when `includeBusinessGraph`, assemble the graph via `seo-graph.ts`, and render the package `<Seo>` with the graph + canonical (canonical/OG derive from `Astro.site` = kom-usa.com). Keep OG image default `/og/home.jpg` for now (Task 6 swaps to dynamic).

- [ ] **Step 4: Verify parity**
```bash
cd site && npm run build
grep -o "LocalBusiness\|FAQPage\|OfferCatalog\|SearchAction" dist/index.html | sort -u
grep -o '<link rel="canonical" href="https://kom-usa.com/"' dist/index.html
```
Expected: entities present (incl. new `SearchAction`), canonical correct. Validate `dist/index.html` + a service page in Google Rich Results Test (paste rendered HTML).

- [ ] **Step 5: Commit**
```bash
git add site/src/lib/seo-graph.ts site/src/components/seo/Seo.astro site/src/layouts/BaseLayout.astro
git commit -m "Phase C: centralize SEO via astro-seo-graph <Seo> + linked @graph"
```

---

### Task 3: Chunked sitemap with Sanity lastmod

**Files:**
- Modify: `site/astro.config.mjs` (sitemap `chunks` + `serialize`)

**Interfaces:**
- Consumes: Sanity `_updatedAt` per document (fetch a slug→date map at config load).

- [ ] **Step 1: Fetch a lastmod map** in `astro.config.mjs` (build-time, before `defineConfig`), using `@sanity/client` directly (config runs in Node, no `sanity:client` virtual module there):
```javascript
import { createClient } from '@sanity/client';
let lastmodMap = {};
if (projectId) {
  try {
    const c = createClient({ projectId, dataset, apiVersion, useCdn: false });
    const docs = await c.fetch(`*[defined(slug.current)]{ "slug": slug.current, _type, _updatedAt }`);
    for (const d of docs) {
      const prefix = { service: '/services/', article: '/blog/', location: '/locations/', project: '/projects/' }[d._type];
      if (prefix) lastmodMap[`${prefix}${d.slug}/`] = d._updatedAt;
    }
  } catch (e) { console.warn('[sitemap] lastmod fetch failed:', e.message); }
}
```

- [ ] **Step 2: Configure sitemap** — replace the `sitemap({...})` call:
```javascript
sitemap({
  filter: (page) => !page.includes('/thank-you') && !page.includes('/studio'),
  entryLimit: 1000,
  serialize(item) {
    const path = new URL(item.url).pathname;
    if (lastmodMap[path]) item.lastmod = lastmodMap[path];
    return item;
  },
}),
```
(`@astrojs/sitemap` already splits into `sitemap-0.xml` + `sitemap-index.xml`; `entryLimit` keeps files within limits. If per-collection files are wanted later, add `chunks`.)

- [ ] **Step 3: Verify**
```bash
cd site && npm run build
grep -o '<loc>https://kom-usa.com/services/locksmith/</loc>' dist/sitemap-0.xml
grep -c "<lastmod>" dist/sitemap-0.xml
```
Expected: service/blog/etc. URLs present; `<lastmod>` entries present when Sanity has docs.

- [ ] **Step 4: Commit**
```bash
git add site/astro.config.mjs
git commit -m "Phase C: chunked sitemap with Sanity _updatedAt lastmod"
```

---

### Task 4: Dynamic robots.txt route

**Files:**
- Delete: `site/public/robots.txt`
- Create: `site/src/pages/robots.txt.ts`

- [ ] **Step 1: Remove the static file** so the route owns it:
```bash
cd site && git rm public/robots.txt
```

- [ ] **Step 2: Create `src/pages/robots.txt.ts`**:
```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = site?.href.replace(/\/$/, '') ?? 'https://kom-usa.com';
  // Crawling stays allowed so search engines can see the pre-launch noindex
  // header. Do NOT Disallow here.
  const body = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap-index.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
```

- [ ] **Step 3: Verify**
```bash
cd site && npm run build && cat dist/robots.txt
```
Expected: shows `Sitemap: https://kom-usa.com/sitemap-index.xml`, no `Disallow`.

- [ ] **Step 4: Commit**
```bash
git add site/src/pages/robots.txt.ts site/public/robots.txt
git commit -m "Phase C: dynamic robots.txt referencing the sitemap index"
```

---

### Task 5: IndexNow key + verification route

**Files:**
- Create: IndexNow key verification route (per `astro-seo` skill output, typically `src/pages/[key].txt.ts` via a helper).
- Modify: `site/astro.config.mjs` (IndexNow options — done in Task 1; confirm key here).

- [ ] **Step 1: Generate an IndexNow key** (a UUID-like hex string). Store it as `INDEXNOW_KEY` in `.env` and Netlify env (it is not secret, but keep it configurable).

- [ ] **Step 2: Add the key verification route** using the `astro-seo` skill's `createIndexNowKeyRoute()` helper (it serves `/<key>.txt` containing the key). Follow the skill's exact filename/usage.

- [ ] **Step 3: Wire the key** into the `seoGraph()` IndexNow options in `astro.config.mjs` (host `kom-usa.com`, key from `INDEXNOW_KEY`). The integration submits built URLs after each build.

- [ ] **Step 4: Verify**
```bash
cd site && npm run build && ls dist/*.txt
```
Expected: the `<key>.txt` file exists in `dist`. (Actual IndexNow pings only matter post-launch once the site is indexable; pre-launch they harmlessly submit noindex URLs.)

- [ ] **Step 5: Commit**
```bash
git add site/src/pages site/astro.config.mjs site/.env.example
git commit -m "Phase C: IndexNow key route + auto-submission"
```

---

### Task 6: Auto-generated OG images (Satori + Sharp)

**Files:**
- Create: `site/src/lib/og-template.ts`
- Create: `site/src/pages/og/[...slug].jpg.ts`
- Modify: `site/src/components/seo/Seo.astro` (derive OG URL from page slug)

**Interfaces:**
- Produces: `/og/<slug>.jpg` 1200×675 JPEG per page; `<Seo>` sets `og:image` to it.

- [ ] **Step 1: OG template** `src/lib/og-template.ts` — Satori JSX + font buffer:
```typescript
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

// Nunito Sans weights ship with @fontsource; point at the installed woff/ttf.
const fontBold = readFileSync('node_modules/@fontsource/nunito-sans/files/nunito-sans-latin-800-normal.woff');

export async function renderOg({ title }: { title: string }): Promise<Buffer> {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: { width: 1200, height: 675, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: '#F7F7F2' },
        children: [
          { type: 'div', props: { style: { color: '#2F6B3B', fontSize: 30, fontWeight: 800, letterSpacing: 2 }, children: 'KOM USA · METRO DETROIT' } },
          { type: 'div', props: { style: { color: '#33383E', fontSize: 64, fontWeight: 800, marginTop: 24, lineHeight: 1.1 }, children: title } },
        ],
      },
    },
    { width: 1200, height: 675, fonts: [{ name: 'Nunito Sans', data: fontBold, weight: 800, style: 'normal' }] },
  );
  return sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer();
}
```
(If the woff path differs, use the `.ttf` under `@fontsource/nunito-sans/files/`; Satori prefers ttf/otf/woff.)

- [ ] **Step 2: OG endpoint** `src/pages/og/[...slug].jpg.ts`:
```typescript
import type { APIRoute } from 'astro';
import { renderOg } from '../../lib/og-template';
import { getServices, getArticles } from '../../lib/sanity';
import { business } from '../../data/business';

export async function getStaticPaths() {
  const services = await getServices();
  const articles = await getArticles();
  return [
    { params: { slug: 'home' }, props: { title: business.tagline } },
    ...services.map((s) => ({ params: { slug: `services/${s.slug}` }, props: { title: s.title } })),
    ...articles.map((a: any) => ({ params: { slug: `blog/${a.slug}` }, props: { title: a.title } })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const jpeg = await renderOg({ title: (props as { title: string }).title });
  return new Response(jpeg, { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' } });
};
```

- [ ] **Step 3: Point `<Seo>` at the dynamic OG URL** — default `ogImage` derives from the page path: `home` → `/og/home.jpg`, `/services/locksmith` → `/og/services/locksmith.jpg`. Add that mapping in `Seo.astro` (fall back to `/og/home.jpg`).

- [ ] **Step 4: Verify**
```bash
cd site && npm run build
ls dist/og/home.jpg dist/og/services/locksmith.jpg
grep -o 'og:image" content="https://kom-usa.com/og/services/locksmith.jpg"' dist/services/locksmith/index.html
```
Expected: JPEGs generated (~1200×675); `og:image` points at them. Open a JPEG to eyeball the design.

- [ ] **Step 5: Commit**
```bash
git add site/src/lib/og-template.ts site/src/pages/og site/src/components/seo/Seo.astro
git commit -m "Phase C: auto-generated 1200x675 OG images via Satori + Sharp"
```

---

### Task 7: RSS feed for the blog

**Files:**
- Create: `site/src/pages/rss.xml.ts`
- Modify: `site/src/components/seo/Seo.astro` (auto-emit `<link rel="alternate" type="application/rss+xml">`)

- [ ] **Step 1: RSS route** `src/pages/rss.xml.ts`:
```typescript
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getArticles } from '../lib/sanity';
import { business } from '../data/business';

export const GET: APIRoute = async ({ site }) => {
  const articles = await getArticles();
  return rss({
    title: `${business.name} — Blog & Updates`,
    description: 'News, tips, and updates from the KOM USA crew.',
    site: site?.href ?? 'https://kom-usa.com',
    items: (articles as any[]).map((a) => ({
      title: a.title,
      link: `/blog/${a.slug}/`,
      pubDate: a.date ? new Date(a.date) : new Date(),
      description: a.excerpt ?? '',
    })),
  });
};
```
(Note: full-body RSS requires rendering Portable Text to HTML per item; if desired, map `a.body` through `@portabletext/to-html`. Excerpt-only is acceptable for a small blog — keep YAGNI unless the owner wants full content.)

- [ ] **Step 2: Emit discovery link** — add to `Seo.astro` head: `<link rel="alternate" type="application/rss+xml" title="KOM USA Blog" href="/rss.xml" />` (or rely on the `<Seo>` package option if it supports RSS discovery).

- [ ] **Step 3: Verify**
```bash
cd site && npm run build && head -20 dist/rss.xml
```
Expected: valid RSS 2.0 (empty `<item>` set until articles exist; add one in Studio to confirm items render).

- [ ] **Step 4: Commit**
```bash
git add site/src/pages/rss.xml.ts site/src/components/seo/Seo.astro
git commit -m "Phase C: blog RSS feed + discovery link"
```

---

### Task 8: Legacy 301 redirect map

**Files:**
- Modify: `site/public/_redirects`

**Interfaces:**
- Consumes: owner-provided Wix `kom.construction` URL inventory.

- [ ] **Step 1: Gather the inventory** (owner prerequisite). If unavailable, ship only the confirmed rules below and leave the documented placeholders commented, as today.

- [ ] **Step 2: Add confirmed 301s** to `public/_redirects` (keep the existing `/locksmith` rules). For each retired Wix section with no new equivalent, 301 to the closest page; for pages with an equivalent, map directly. Example (adjust to the real inventory):
```
# Legacy Wix (kom.construction) → kom-usa.com
/services            /#services              301
/contact             /contact/               301
/about               /about/                 301
/cleaning            /                       301
/memberships         /                       301
/houses-for-sale     /                       301
# ...one line per real old URL from GSC/Wix sitemap...
```
Guardrail: never launch with high-value old URLs unredirected (per the file's existing header note).

- [ ] **Step 3: Verify**
```bash
cd site && npm run build && grep -c "301" dist/_redirects
```
Expected: rules present in the published `_redirects`. Post-launch, spot-check a few with `curl -sI`.

- [ ] **Step 4: Commit**
```bash
git add site/public/_redirects
git commit -m "Phase C: legacy kom.construction 301 redirect map"
```

---

### Task 9: Performance defaults

**Files:**
- Modify: `site/src/layouts/BaseLayout.astro` (View Transitions + font preload)
- Audit: `site/src/**/*.astro` (raster `<img>` → Astro `<Image>` where local)

- [ ] **Step 1: View Transitions** — add to `BaseLayout.astro` `<head>`:
```astro
import { ClientRouter } from 'astro:transitions';
// ...in <head>:
<ClientRouter />
```
(Enables SPA-style navigation + link prefetch.)

- [ ] **Step 2: Font preload** — add to `<head>` a preload for the primary woff2 (adjust path to the `@fontsource/nunito-sans` file actually imported):
```astro
<link rel="preload" as="font" type="font/woff2" href="/_astro/nunito-sans-latin-700-normal.woff2" crossorigin />
```
(Confirm the emitted filename after a build; if hashed, preload via the imported asset URL instead.)

- [ ] **Step 3: Enable prefetch** in `astro.config.mjs`:
```javascript
prefetch: { defaultStrategy: 'viewport' },
```

- [ ] **Step 4: `<img>` → `<Image>` audit** — for any local raster images still using raw `<img>` (Sanity CDN images stay as `<img>` via `urlFor`, which already serves optimized formats), switch to `astro:assets` `<Image>` for responsive `srcset`/WebP/lazy. Confirm none of the homepage/service hero/gallery local images use raw `<img>`.

- [ ] **Step 5: Verify**
```bash
cd site && npm run build
grep -o 'astro-transition\|ViewTransition\|data-astro-transition' dist/index.html | head -1
grep -c "srcset" dist/index.html
```
Expected: View Transitions script present; responsive `srcset` on local images. Run a Lighthouse pass (preview server) and confirm Performance/SEO are green.

- [ ] **Step 6: Commit**
```bash
git add site/src/layouts/BaseLayout.astro site/astro.config.mjs site/src
git commit -m "Phase C: View Transitions, font preload, viewport prefetch, Image audit"
```

---

### Task 10: Final verification and deploy

- [ ] **Step 1:** `cd site && npm run build` — clean; **build-time SEO checks pass** (no H1/duplicate/alt/meta-length/internal-link failures). Fix any reported issues.
- [ ] **Step 2:** Preview (`npx astro preview --port 4330`) and confirm: `/sitemap-index.xml`, `/robots.txt`, `/rss.xml`, `/og/home.jpg`, `/<indexnow-key>.txt` all return valid output; JSON-LD validates in Google Rich Results Test (home + a service page); OG image renders.
- [ ] **Step 3:** Confirm the pre-launch `X-Robots-Tag: noindex` header is still in `netlify.toml` (must NOT be removed until launch).
- [ ] **Step 4:** Merge to `main`, push `kom-usa main` (+ `origin main`); confirm green deploy.
- [ ] **Step 5:** Record launch checklist in the spec/editor guide: remove the `noindex` header; submit `sitemap-index.xml` to Google Search Console + Bing Webmaster Tools; verify 301s resolve.
