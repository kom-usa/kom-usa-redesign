# Storyblok CMS Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let non-technical staff publish articles, service content, location pages, projects, FAQs, and testimonials through Storyblok while the public site stays static, guarded, and visually unchanged.

**Architecture:** `@storyblok/astro@10` fetches published content at build time for the static production site; a `preview` branch builds SSR (`@astrojs/netlify@8`) with draft content and the Storyblok bridge for the visual editor. Content schemas and seed content are created by idempotent Node scripts against the Management API. Publishing fires a Storyblok webhook → Netlify build hook → rebuild.

**Tech Stack:** Astro 7 (static prod / server preview), @storyblok/astro 10, @astrojs/netlify 8, Storyblok Management API v1, Netlify build hooks.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-03-storyblok-cms-design.md` — binding.
- Business facts ONLY from `site/src/data/business.ts`: phone `313-804-0844`, email `contact@kom-usa.com` (Task 1 changes it from info@), hours `Mon–Sat 8am–5pm` (Task 1 changes from 8–6), service area, legal name, offer, Google rating. There is deliberately NO company-settings content type in Storyblok.
- Guardrails rendered from code on every service page: `pricingDisclaimer`, and for slug `locksmith` the deposit + distance-fee lines. Editors cannot remove them.
- Testimonial stories require `source_url`. Never fabricate reviews.
- Existing URLs keep working: `/services/locksmith|water-heaters|chimney-care` unchanged. No visual changes on day one (seeded content must reproduce current pages).
- Tokens: `STORYBLOK_TOKEN` (delivery/preview token; in `site/.env` AND Netlify env, all contexts), `STORYBLOK_MANAGEMENT_TOKEN` + `STORYBLOK_SPACE_ID` (local `site/.env` only). Both verified working. NEVER print tokens or commit `.env`.
- All commands run from `site/` (`cd /Users/gabrielmann/Documents/ClaudeCode/kom-usa-redesign/site` — Bash cwd resets between calls).
- Verification cycle per task: `npx astro build` green + stated checks; no test framework exists.
- Known trap: Starwind `outline` Button variant has a white background — add `bg-transparent` on dark backgrounds.
- Commit trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Work on branch `feat/storyblok-cms` off `main` (create in Task 1). Do NOT push `main` mid-work; production deploys on push.

---

### Task 1: Business-fact update (email + hours) — ships independently

**Files:**
- Modify: `site/src/data/business.ts` (email, emailHref, hoursShort, hours)
- Modify: `site/src/components/seo/Seo.astro` (openingHoursSpecification closes 17:00)
- Sweep: any rendered `info@kom-usa.com` or `8am–6pm`/`18:00`

**Interfaces:**
- Produces: `business.email === "contact@kom-usa.com"`, `business.hoursShort === "Mon–Sat 8am–5pm"`, `hours[0].time === "8:00 am – 5:00 pm"`.

- [ ] **Step 1: Create branch**

```bash
git checkout -b feat/storyblok-cms
```

- [ ] **Step 2: Apply edits**

In `site/src/data/business.ts`:

```ts
  email: "contact@kom-usa.com",
  emailHref: "mailto:contact@kom-usa.com",
  // ...
  hoursShort: "Mon–Sat 8am–5pm",
```

```ts
export const hours = [
  { days: "Monday – Saturday", time: "8:00 am – 5:00 pm" },
  { days: "Sunday", time: "Closed" },
];
```

In `site/src/components/seo/Seo.astro`, the `openingHoursSpecification` entry: `closes: "17:00"` (opens stays `"08:00"`).

- [ ] **Step 3: Sweep and verify**

```bash
grep -rn "info@kom-usa\|8am–6pm\|8am-6pm\|18:00" src/ && echo "FIX THE ABOVE" || echo CLEAN
npx astro build 2>&1 | tail -2
```
Expected: CLEAN (except any `18:00` that is not opening-hours related — inspect hits) and green build. Check built output: `grep -o 'contact@kom-usa.com' dist/contact/index.html | head -1`.

- [ ] **Step 4: Commit**

```bash
git add -A src/
git commit -m "Update business email to contact@kom-usa.com and hours to Mon–Sat 8–5"
```

---

### Task 2: Dependencies and dual-mode Astro config

**Files:**
- Modify: `site/package.json` (via npm install)
- Modify: `site/astro.config.mjs` (full replacement below)
- Modify: `site/netlify.toml` (preview context)
- Create: `site/src/storyblok/` (empty dir placeholder — components arrive in Tasks 5–7; create with a `.gitkeep`)

**Interfaces:**
- Produces: env-driven config — `STORYBLOK_PREVIEW=true` ⇒ `output: "server"` + Netlify adapter + livePreview; otherwise static. Storyblok component map: `service`, `article`, `location`, `project` → `src/storyblok/<PascalCase>.astro` (files created in later tasks; the map entries are added in those tasks, NOT here, so every intermediate build stays green).

- [ ] **Step 1: Install**

```bash
npm install @storyblok/astro@^10 @astrojs/netlify@^8
```

- [ ] **Step 2: Replace `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { storyblok } from '@storyblok/astro';
import netlify from '@astrojs/netlify';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const STORYBLOK_TOKEN = env.STORYBLOK_TOKEN ?? process.env.STORYBLOK_TOKEN;
// Preview deployments (branch `preview` on Netlify) render server-side with
// draft content and the visual-editor bridge. Production stays fully static.
const isPreview = (env.STORYBLOK_PREVIEW ?? process.env.STORYBLOK_PREVIEW) === 'true';

if (!STORYBLOK_TOKEN) {
  throw new Error('STORYBLOK_TOKEN is not set — add it to site/.env (see .env.example) or Netlify env.');
}

export default defineConfig({
  site: 'https://www.kom.construction',
  output: isPreview ? 'server' : 'static',
  adapter: isPreview ? netlify() : undefined,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    storyblok({
      accessToken: STORYBLOK_TOKEN,
      livePreview: isPreview,
      components: {
        // populated as storyblok components land: service, article, location, project
      },
    }),
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
    }),
  ],
});
```

- [ ] **Step 3: Add preview context to `site/netlify.toml`** (append; keep existing content)

```toml
# Branch "preview" renders server-side with Storyblok draft content for the
# visual editor. Never index it.
[context."preview".environment]
  STORYBLOK_PREVIEW = "true"

[context."preview"]
  command = "npm run build"
```

- [ ] **Step 4: Verify both modes build**

```bash
npx astro build 2>&1 | tail -2
STORYBLOK_PREVIEW=true npx astro build 2>&1 | tail -3
```
Expected: static build green (8 pages); preview build green producing a server bundle (`dist/` contains `.netlify` functions output, no per-page HTML requirement).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs netlify.toml src/storyblok/.gitkeep
git commit -m "Add Storyblok integration with static/SSR dual-mode config"
```

---

### Task 3: Schema provisioning script (`storyblok-setup.mjs`)

**Files:**
- Create: `site/scripts/storyblok-lib.mjs` (shared Management API client)
- Create: `site/scripts/storyblok-setup.mjs`

**Interfaces:**
- Consumes: `.env` vars `STORYBLOK_MANAGEMENT_TOKEN`, `STORYBLOK_SPACE_ID`.
- Produces: Storyblok components `service`, `article`, `location`, `project`, `faq`, `testimonial` + nestables `list_item`, `price_row`, `faq_item`; folders `services/`, `blog/`, `locations/`, `projects/`, `faqs/`, `testimonials/`. Idempotent: re-running updates schemas in place (PUT if name exists). Script exits non-zero on any API error.

- [ ] **Step 1: Create `site/scripts/storyblok-lib.mjs`**

```js
// Shared Management API client for setup/seed scripts. Reads site/.env directly
// so the scripts work without dotenv as a dependency.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#') && l.includes('='))
    .map((l) => l.split('=').map((s) => s.trim())),
);

export const SPACE_ID = env.STORYBLOK_SPACE_ID;
const TOKEN = env.STORYBLOK_MANAGEMENT_TOKEN;
if (!SPACE_ID || !TOKEN) {
  console.error('Missing STORYBLOK_SPACE_ID or STORYBLOK_MANAGEMENT_TOKEN in site/.env');
  process.exit(1);
}

const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`;

export async function mapi(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 1000));
    return mapi(method, path, body);
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} → HTTP ${res.status}: ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}
```

- [ ] **Step 2: Create `site/scripts/storyblok-setup.mjs`**

```js
// Idempotently creates/updates Storyblok component schemas and content folders.
// Run: node scripts/storyblok-setup.mjs
import { mapi } from './storyblok-lib.mjs';

const text = (name, opts = {}) => ({ type: 'text', display_name: name, ...opts });
const textarea = (name, opts = {}) => ({ type: 'textarea', display_name: name, ...opts });
const seoFields = {
  seo_title: text('SEO title (optional — defaults to the name)'),
  seo_description: textarea('SEO description (shows in Google)', { required: true }),
  seo_image: { type: 'asset', filetypes: ['images'], display_name: 'Social share image (optional)' },
};

const nestables = [
  { name: 'list_item', schema: { text: text('Item', { required: true }) } },
  {
    name: 'price_row',
    schema: {
      name: text('What it is', { required: true }),
      detail: text('Small print under the name (optional)'),
      price: text('Price (e.g. $129 or from $1,750)', { required: true }),
    },
  },
  {
    name: 'faq_item',
    schema: {
      question: text('Question', { required: true }),
      answer: textarea('Answer', { required: true }),
    },
  },
];

const contentTypes = [
  {
    name: 'article',
    schema: {
      title: text('Title', { required: true }),
      category: {
        type: 'option', required: true, display_name: 'Type',
        options: [
          { name: 'Blog post', value: 'blog' },
          { name: 'Company update', value: 'update' },
        ],
      },
      date: { type: 'datetime', required: true, display_name: 'Publish date shown on the site' },
      cover_image: { type: 'asset', filetypes: ['images'], display_name: 'Cover image' },
      excerpt: textarea('Short summary (shows on the blog list)', { required: true }),
      body: { type: 'richtext', required: true, display_name: 'Article text' },
      ...seoFields,
    },
  },
  {
    name: 'service',
    schema: {
      title: text('Page title', { required: true }),
      short_title: text('Short name (buttons, menus)', { required: true }),
      anchor_price: text('Headline price (e.g. "Unlocks from $129")', { required: true }),
      card_blurb: textarea('Card description (homepage services grid)', { required: true }),
      hero_intro: textarea('Intro paragraph at the top of the page', { required: true }),
      hero_image: { type: 'asset', filetypes: ['images'], display_name: 'Page photo' },
      includes: {
        type: 'bloks', display_name: 'What we handle (list)',
        restrict_components: true, component_whitelist: ['list_item'],
      },
      pricing: {
        type: 'bloks', display_name: 'Pricing rows',
        restrict_components: true, component_whitelist: ['price_row'],
      },
      pricing_note: textarea('Extra pricing note for this service (optional)'),
      faqs: {
        type: 'bloks', display_name: 'Common questions',
        restrict_components: true, component_whitelist: ['faq_item'],
      },
      ...seoFields,
    },
  },
  {
    name: 'location',
    schema: {
      city: text('City name', { required: true }),
      intro: { type: 'richtext', required: true, display_name: 'Intro for this city' },
      services_offered: {
        type: 'options', source: 'internal_stories', filter_content_type: ['service'],
        required: true, display_name: 'Services offered here',
      },
      featured_testimonials: {
        type: 'options', source: 'internal_stories', filter_content_type: ['testimonial'],
        display_name: 'Testimonials to feature (optional)',
      },
      featured_projects: {
        type: 'options', source: 'internal_stories', filter_content_type: ['project'],
        display_name: 'Projects to feature (optional)',
      },
      ...seoFields,
    },
  },
  {
    name: 'project',
    schema: {
      title: text('Project title', { required: true }),
      city: text('City', { required: true }),
      service_category: {
        type: 'option', display_name: 'Related service',
        options: [
          { name: 'Locksmith', value: 'locksmith' },
          { name: 'Water heater', value: 'water-heaters' },
          { name: 'Chimney care', value: 'chimney-care' },
          { name: 'Other', value: 'other' },
        ],
      },
      date: { type: 'datetime', display_name: 'When the job was done' },
      photos: { type: 'multiasset', filetypes: ['images'], required: true, display_name: 'Photos' },
      problem: textarea('The problem', { required: true }),
      work: textarea('What we did', { required: true }),
      result: textarea('The result', { required: true }),
      ...seoFields,
    },
  },
  {
    name: 'faq',
    schema: {
      question: text('Question', { required: true }),
      answer: textarea('Answer', { required: true }),
      placement: {
        type: 'option', required: true, display_name: 'Where it shows',
        options: [
          { name: 'Homepage', value: 'homepage' },
          { name: 'Not shown yet (saved for later)', value: 'unplaced' },
        ],
      },
    },
  },
  {
    name: 'testimonial',
    schema: {
      name: text('Customer first name + last initial (e.g. "Jordan P.")', { required: true }),
      city: text('City (optional)'),
      quote: textarea('What they said (their real words)', { required: true }),
      source_url: text('Link to the real review (required — e.g. the Google review)', { required: true }),
      service_category: {
        type: 'option', display_name: 'Related service',
        options: [
          { name: 'Locksmith', value: 'locksmith' },
          { name: 'Water heater', value: 'water-heaters' },
          { name: 'Chimney care', value: 'chimney-care' },
          { name: 'General', value: 'general' },
        ],
      },
    },
  },
];

const folders = [
  { name: 'Services', slug: 'services', default_root: 'service' },
  { name: 'Blog', slug: 'blog', default_root: 'article' },
  { name: 'Locations', slug: 'locations', default_root: 'location' },
  { name: 'Projects', slug: 'projects', default_root: 'project' },
  { name: 'FAQs', slug: 'faqs', default_root: 'faq' },
  { name: 'Testimonials', slug: 'testimonials', default_root: 'testimonial' },
];

const existing = (await mapi('GET', '/components/')).components;
for (const def of [...nestables.map((n) => ({ ...n, is_nestable: true, is_root: false })),
                   ...contentTypes.map((c) => ({ ...c, is_nestable: false, is_root: true }))]) {
  const payload = { component: { name: def.name, display_name: def.name, schema: def.schema, is_root: def.is_root, is_nestable: def.is_nestable } };
  const found = existing.find((c) => c.name === def.name);
  if (found) {
    await mapi('PUT', `/components/${found.id}`, payload);
    console.log(`updated component: ${def.name}`);
  } else {
    await mapi('POST', '/components/', payload);
    console.log(`created component: ${def.name}`);
  }
}

const stories = (await mapi('GET', '/stories/?folder_only=1&per_page=100')).stories;
for (const f of folders) {
  if (stories.find((s) => s.slug === f.slug)) {
    console.log(`folder exists: ${f.slug}`);
  } else {
    await mapi('POST', '/stories/', { story: { name: f.name, slug: f.slug, is_folder: true, default_root: f.default_root } });
    console.log(`created folder: ${f.slug}`);
  }
}
console.log('setup complete');
```

- [ ] **Step 3: Run and verify idempotency**

```bash
node scripts/storyblok-setup.mjs
node scripts/storyblok-setup.mjs
```
Expected: first run prints `created component: …` ×9 and `created folder: …` ×6; second run prints `updated component`/`folder exists` lines; both end `setup complete`, exit 0.

- [ ] **Step 4: Commit**

```bash
git add scripts/
git commit -m "Add idempotent Storyblok schema and folder provisioning script"
```

---

### Task 4: Seed content (`storyblok-seed.mjs`)

**Files:**
- Create: `site/scripts/storyblok-seed.mjs`

**Interfaces:**
- Consumes: `mapi`, `SPACE_ID` from `storyblok-lib.mjs`; folders/components from Task 3.
- Produces: published stories — `services/locksmith`, `services/water-heaters`, `services/chimney-care` (content copied verbatim from the current `services` array in `site/src/data/business.ts`), 7 `faqs/*` (from the current `faqs` array, placement `homepage`), 1 article `blog/welcome-to-the-new-kom-usa-site`; 1 **draft** `locations/warren` example. Skips any story whose slug already exists (idempotent). Hero images: skip asset upload — service hero images stay code-side in the route (Task 5 maps slug→existing local image as fallback when `hero_image` is empty).

- [ ] **Step 1: Create the script**

The script mirrors this shape (content abbreviated here ONLY for the three service objects — the implementer copies the exact strings from the current `site/src/data/business.ts` `services` array, which is the authoritative source at seed time; every other literal below is complete):

```js
import { mapi } from './storyblok-lib.mjs';

const folderIds = {};
for (const s of (await mapi('GET', '/stories/?folder_only=1&per_page=100')).stories) {
  folderIds[s.slug] = s.id;
}
const existingSlugs = new Set();
let page = 1;
while (true) {
  const res = await mapi('GET', `/stories/?per_page=100&page=${page}`);
  res.stories.forEach((s) => existingSlugs.add(s.full_slug ?? s.slug));
  if (res.stories.length < 100) break;
  page += 1;
}

async function seed(folderSlug, slug, name, content, { publish = true } = {}) {
  const full = `${folderSlug}/${slug}`;
  if (existingSlugs.has(full) || existingSlugs.has(slug)) {
    console.log(`exists, skipping: ${full}`);
    return;
  }
  await mapi('POST', `/stories/${publish ? '?publish=1' : ''}`, {
    story: { name, slug, parent_id: folderIds[folderSlug], content },
    ...(publish ? { publish: 1 } : {}),
  });
  console.log(`${publish ? 'published' : 'drafted'}: ${full}`);
}

const li = (textVal) => ({ component: 'list_item', text: textVal });
const row = (n, d, p) => ({ component: 'price_row', name: n, detail: d ?? '', price: p });
const qa = (q, a) => ({ component: 'faq_item', question: q, answer: a });
const rt = (paragraphs) => ({
  type: 'doc',
  content: paragraphs.map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p }] })),
});

// SERVICES — copy title/short_title/anchor_price/card_blurb(blurb)/hero_intro/
// includes/pricing rows/pricing notes/faqs VERBATIM from the `services` array
// in ../src/data/business.ts. pricing_note gets ONLY the water-heater
// "starting prices include installation…" line (the generic disclaimer and
// locksmith deposit/distance lines stay code-side and are NOT seeded).
await seed('services', 'locksmith', 'Locksmith Services', { component: 'service', /* …fields per business.ts… */ });
await seed('services', 'water-heaters', 'Water Heater Replacement', { component: 'service', /* …fields per business.ts… */ });
await seed('services', 'chimney-care', 'Chimney Care', { component: 'service', /* …fields per business.ts… */ });

// FAQS — the current 7 homepage FAQs from business.ts `faqs`, placement homepage.
// (Copy question/answer strings verbatim.)
/* seed('faqs', 'what-happens-after-i-send-the-form', …) ×7 */

await seed('blog', 'welcome-to-the-new-kom-usa-site', 'Welcome to the new KOM USA site', {
  component: 'article',
  title: 'Welcome to the new KOM USA site',
  category: 'update',
  date: new Date().toISOString().slice(0, 16),
  excerpt: 'A fresh site, published prices, and a faster way to reach us — here is what changed.',
  body: rt([
    'We rebuilt kom-usa from the ground up around one idea: make it easy to reach us. Tell us what you need, and a real person calls you back — usually the same day.',
    'You will find our standard prices for locksmith work, water heater replacement, and chimney care published right on the site. No surprises: we confirm your exact quote by phone before any work starts.',
    'This blog is where we will share company updates, seasonal reminders, and answers to the questions we hear most. Thanks for reading — and if you need us, the form is right on the homepage.',
  ]),
  seo_description: 'KOM USA launches a new website with published pricing for locksmith, water heater, and chimney services in Metro Detroit.',
});

await seed('locations', 'warren', 'Warren', {
  component: 'location',
  city: 'Warren',
  intro: rt([
    'KOM USA serves homeowners across Warren with locksmith service, water heater replacement, and chimney care — with our standard prices published up front.',
    'This is a draft example page. Edit the text, pick the services and testimonials to feature, then press Publish when it is ready.',
  ]),
  services_offered: [],
  seo_description: 'Locksmith, water heater, and chimney services for Warren, MI homes — upfront standard pricing from KOM USA. Request a call today.',
}, { publish: false });

console.log('seed complete');
```

Implementation notes (binding): publish via `POST /stories/?publish=1`; datetime format `YYYY-MM-DD HH:mm` is accepted as `new Date().toISOString().slice(0,16).replace('T',' ')` — use that replace. `services_offered` seeded empty because story UUID references are added by editors; the Warren draft is a worked example, not a finished page.

- [ ] **Step 2: Run, verify via delivery API**

```bash
node scripts/storyblok-seed.mjs
node scripts/storyblok-seed.mjs   # idempotency: all "exists, skipping"
node -e "
const t=require('fs').readFileSync('.env','utf8').match(/STORYBLOK_TOKEN=(.*)/)[1].trim();
fetch('https://api.storyblok.com/v2/cdn/stories?version=published&token='+t+'&per_page=25')
  .then(r=>r.json()).then(d=>console.log(d.stories.map(s=>s.full_slug)));
"
```
Expected: 3 services + 7 faqs + 1 article published (11 slugs); `locations/warren` absent from published list.

- [ ] **Step 3: Commit**

```bash
git add scripts/storyblok-seed.mjs
git commit -m "Seed Storyblok with current services, FAQs, and starter content"
```

---

### Task 5: CMS-driven service pages (+ nav)

**Files:**
- Create: `site/src/lib/storyblok.ts`
- Create: `site/src/storyblok/Service.astro`
- Create: `site/src/pages/services/[slug].astro`
- Delete: `site/src/pages/services/locksmith.astro`, `water-heaters.astro`, `chimney-care.astro`
- Modify: `site/src/data/business.ts` (remove `services` array + `ServiceDef`; ADD `serviceGuardrails` below; keep everything else)
- Modify: `site/src/layouts/ServicePage.astro` (accept CMS story instead of `ServiceDef`)
- Modify: `site/src/components/layout/Header.astro`, `Footer.astro`, `site/src/components/sections/Services.astro` (nav/grid from CMS)
- Modify: `site/astro.config.mjs` (add `service: 'storyblok/Service'` to the components map)

**Interfaces:**
- Consumes: seeded service stories; `pricingDisclaimer` from business.ts.
- Produces (used by Tasks 6–9):
  - `site/src/lib/storyblok.ts` exports:
    - `sbVersion(): "draft" | "published"` (draft iff `import.meta.env.STORYBLOK_PREVIEW === "true"`)
    - `getStories(contentType: string, opts?: Record<string,string>): Promise<ISbStoryData[]>` (getAll `cdn/stories`, `content_type`, sorted `first_published_at:desc` by default)
    - `getStory(fullSlug: string, opts?): Promise<ISbStoryData | null>` (null on 404)
    - `serviceNav(): Promise<{slug: string; title: string; shortTitle: string}[]>`
  - `business.ts` adds:

```ts
/** Code-side pricing guardrails appended to every service page, keyed by slug.
 *  Editors cannot remove these — that is deliberate. */
export const serviceGuardrails: Record<string, string[]> = {
  locksmith: [
    "A 50% deposit is required before a technician is dispatched.",
    "Jobs more than 25 miles from our location add a $50 distance fee.",
  ],
};
```

  - `ServicePage.astro` new props: `{ story: ISbStoryData; preselectService: string }` — renders `story.content.*` fields; pricing notes = `[pricingDisclaimer, story.content.pricing_note (if set), ...(serviceGuardrails[slug] ?? [])]`; hero image = `story.content.hero_image?.filename ?? localFallback[slug]` (local fallbacks: locksmith→door-lock.jpg, water-heaters→worker-electrical.jpg, chimney-care→fireplace-chimney.jpg, anything else→home-exterior.jpg).
  - `preselectService` mapping stays: locksmith→"Locksmith", water-heaters→"Water heater", chimney-care→"Chimney care", else→"Something else".

- [ ] **Step 1: `src/lib/storyblok.ts`**

```ts
import { useStoryblokApi } from "@storyblok/astro";
import type { ISbStoryData } from "@storyblok/astro";

export function sbVersion(): "draft" | "published" {
  return import.meta.env.STORYBLOK_PREVIEW === "true" ? "draft" : "published";
}

export async function getStories(
  contentType: string,
  opts: Record<string, string> = {},
): Promise<ISbStoryData[]> {
  const api = useStoryblokApi();
  return (await api.getAll("cdn/stories", {
    version: sbVersion(),
    content_type: contentType,
    sort_by: "first_published_at:desc",
    ...opts,
  })) as ISbStoryData[];
}

export async function getStory(fullSlug: string, opts: Record<string, string> = {}) {
  const api = useStoryblokApi();
  try {
    const { data } = await api.get(`cdn/stories/${fullSlug}`, { version: sbVersion(), ...opts });
    return data.story as ISbStoryData;
  } catch (e: any) {
    if (String(e?.status ?? e).includes("404")) return null;
    throw e;
  }
}

export async function serviceNav() {
  const stories = await getStories("service", { sort_by: "created_at:asc" });
  return stories.map((s) => ({
    slug: s.slug,
    title: s.content.title as string,
    shortTitle: s.content.short_title as string,
  }));
}
```

- [ ] **Step 2: Route `src/pages/services/[slug].astro`**

```astro
---
import { getStories } from "../../lib/storyblok";
import ServicePage from "../../layouts/ServicePage.astro";

export async function getStaticPaths() {
  const stories = await getStories("service");
  return stories.map((story) => ({ params: { slug: story.slug }, props: { story } }));
}

const { story } = Astro.props;
const preselectMap: Record<string, string> = {
  locksmith: "Locksmith",
  "water-heaters": "Water heater",
  "chimney-care": "Chimney care",
};
---

<ServicePage story={story} preselectService={preselectMap[story.slug] ?? "Something else"} />
```

- [ ] **Step 3: Rework `ServicePage.astro`, create `src/storyblok/Service.astro`**

`ServicePage.astro` keeps its existing markup/sections but reads from `story.content` per the Interfaces block (includes list = `content.includes.map(b => b.text)`, pricing rows = `content.pricing` bloks, FAQs = `content.faqs` bloks). SEO: `metaTitle = content.seo_title || content.title + " | KOM USA"`, `metaDescription = content.seo_description`. `src/storyblok/Service.astro` is the visual-editor wrapper:

```astro
---
import { storyblokEditable } from "@storyblok/astro";
const { blok } = Astro.props;
---
<div {...storyblokEditable(blok)}>
  <slot />
</div>
```

(The full-page render path stays `ServicePage.astro`; the editable wrapper matters on the preview branch where `StoryblokComponent` resolves `service` bloks. Register `service: 'storyblok/Service'` in astro.config now.)

- [ ] **Step 4: Nav + services grid from CMS**

- `Header.astro` + `Footer.astro`: replace `import { services } from "../../data/business"` with `import { serviceNav } from "../../lib/storyblok"` + `const services = await serviceNav();` — dropdown/footer render `service.title` → `/services/${service.slug}` exactly as before.
- `sections/Services.astro`: fetch `const stories = await getStories("service", { sort_by: "created_at:asc" })`; cards read `content.card_blurb`, `content.anchor_price`, `content.title`, image = `content.hero_image?.filename` via `<img>` with `loading="lazy"` or local fallback map (same map as ServicePage).
- `business.ts`: delete `services` array + `ServiceDef` interface; add `serviceGuardrails`; keep `pricingDisclaimer`, `serviceOptions`, `urgencyOptions`, and all other exports.

- [ ] **Step 5: Delete static pages, verify parity, commit**

```bash
rm src/pages/services/locksmith.astro src/pages/services/water-heaters.astro src/pages/services/chimney-care.astro
npx astro build 2>&1 | tail -3
```
Expected: green, and `dist/services/{locksmith,water-heaters,chimney-care}/index.html` all exist. Parity checks on built HTML: `grep -o '\$129' dist/services/locksmith/index.html | head -1`; `grep -c 'from \$1,750' dist/services/water-heaters/index.html` ≥1; `grep -c '50% deposit' dist/services/locksmith/index.html` ≥1 (guardrail survives); `grep -c '50% deposit' dist/services/chimney-care/index.html` = 0.

```bash
git add -A src/ astro.config.mjs
git commit -m "Drive service pages and nav from Storyblok with code-side guardrails"
```

---

### Task 6: Blog routes

**Files:**
- Create: `site/src/pages/blog/index.astro`
- Create: `site/src/pages/blog/[slug].astro`
- Create: `site/src/storyblok/Article.astro` (editable wrapper, same 5-line shape as Service.astro)
- Modify: `site/astro.config.mjs` (add `article: 'storyblok/Article'`)
- Modify: `site/src/components/layout/Footer.astro` (add `{ label: "Blog", href: "/blog" }` to quickLinks)

**Interfaces:**
- Consumes: `getStories("article")`, `getStory`, `renderRichText` from `@storyblok/astro`.
- Produces: `/blog/` index (cards: cover image or none, category chip "Blog post"/"Company update", date formatted `new Intl.DateTimeFormat("en-US", { dateStyle: "long" })`, title, excerpt, link `/blog/<slug>`), newest-first by `content.date`; empty state: "No posts yet — check back soon." `/blog/<slug>`: BaseLayout, title, date + category, cover image if set, `<div class="prose…" set:html={renderRichText(story.content.body)} />` styled with existing type tokens (kom-charcoal text, kom-field links, max-w-3xl). SEO title `content.seo_title || content.title + " | KOM USA Blog"`, description `content.seo_description || content.excerpt`, ogImage `content.seo_image?.filename ?? content.cover_image?.filename`.

- [ ] **Step 1: Build both routes + wrapper; register in config; add footer link.** Index sorts by `content.date` descending (string compare on ISO-ish `YYYY-MM-DD HH:mm` is fine). Both pages compose only existing design-system pieces (SectionHeader, card classes `border-border rounded-xl bg-white shadow-card`, `section-pad`, `reveal`).

- [ ] **Step 2: Verify**

```bash
npx astro build 2>&1 | tail -2
ls dist/blog/ && grep -o 'Welcome to the new KOM USA site' dist/blog/index.html | head -1
grep -o 'Welcome to the new KOM USA site' dist/blog/welcome-to-the-new-kom-usa-site/index.html | head -1
```
Expected: green; index lists the welcome article; article page renders; both appear in `dist/sitemap-0.xml`.

- [ ] **Step 3: Commit**

```bash
git add -A src/ astro.config.mjs
git commit -m "Add CMS-driven blog index and article pages"
```

---

### Task 7: Location and project routes

**Files:**
- Create: `site/src/pages/locations/index.astro`, `site/src/pages/locations/[slug].astro`
- Create: `site/src/pages/projects/index.astro`, `site/src/pages/projects/[slug].astro`
- Create: `site/src/storyblok/Location.astro`, `site/src/storyblok/Project.astro` (editable wrappers)
- Modify: `site/astro.config.mjs` (add both to components map)

**Interfaces:**
- Consumes: `getStories`, `getStory` with `resolve_relations: "location.services_offered,location.featured_testimonials,location.featured_projects"` (pass via opts in both the location getStaticPaths fetch and getStory); resolved stories arrive in `content.services_offered` as full story objects (fallback: if an entry is a plain UUID string, skip it).
- Produces:
  - `/locations/<slug>`: hero ("Home services in {city}, MI" eyebrow + `{city}` headline + intro richtext), service cards for `services_offered` (same card markup as homepage Services grid), testimonials block (quote, name, city, link `source_url` labeled "Read the original review"), projects strip if any, `LeadCallForm` (no preselect), service-area line from `business.serviceArea`. SEO description required field; title `content.seo_title || \`${city} Home Services | KOM USA\``.
  - `/locations/` index: list of published city links (card grid), intro sentence, LeadCallForm.
  - `/projects/<slug>`: photo grid (first photo as hero), Problem/What we did/Result sections (existing card styles), city + service chip, CTA band.
  - `/projects/` index: card per project (first photo, title, city, service chip), empty state "Project photos are coming soon."
- Empty published sets must not fail the build: `getStaticPaths` returning `[]` is valid; index pages render empty states.

- [ ] **Step 1: Build the four routes + two wrappers; register components.**
- [ ] **Step 2: Verify**

```bash
npx astro build 2>&1 | tail -2
ls dist/locations/ dist/projects/
```
Expected: green; `dist/locations/index.html` and `dist/projects/index.html` exist with empty states (Warren is draft ⇒ no `dist/locations/warren/` in production build); no project pages yet. Sanity: `STORYBLOK_PREVIEW=true npx astro build 2>&1 | tail -2` also green (SSR mode compiles the same routes).

- [ ] **Step 3: Commit**

```bash
git add -A src/ astro.config.mjs
git commit -m "Add CMS-driven location and project pages"
```

---

### Task 8: Homepage FAQ + gallery from CMS

**Files:**
- Modify: `site/src/components/sections/Faq.astro` (fetch CMS faqs)
- Modify: `site/src/components/sections/Gallery.astro` (projects with stock fallback)
- Modify: `site/src/data/business.ts` (delete the `faqs` array — now CMS-owned)

**Interfaces:**
- Consumes: `getStories("faq")` filtered `content.placement === "homepage"`, `getStories("project")`.
- Produces: `Faq.astro` renders CMS faqs with identical markup (details/summary accordion), ordered by story `position` (Storyblok's manual order — `sort_by: "position:asc"`); if zero homepage faqs published, section renders nothing (`{items.length > 0 && …}`). `Gallery.astro`: if ≥3 published projects, show latest 6 projects' first photos with title captions linking to `/projects/<slug>`; else current stock images + "Sample photo" labels unchanged.

- [ ] **Step 1: Implement both; remove `faqs` from business.ts; fix any leftover import (`grep -rn '\bfaqs\b' src/`).**
- [ ] **Step 2: Verify parity**

```bash
npx astro build 2>&1 | tail -2
grep -c 'What happens after I send the form' dist/index.html
grep -c 'Sample photo' dist/index.html
```
Expected: green; first grep ≥1 (seeded FAQ renders), second ≥1 (stock fallback still active — no projects published).

- [ ] **Step 3: Commit**

```bash
git add -A src/
git commit -m "Source homepage FAQs and gallery from Storyblok with fallbacks"
```

---

### Task 9: Preview branch with live editing

**Files:**
- Create: `site/src/middleware.ts`
- Modify: `site/src/pages/services/[slug].astro`, `blog/[slug].astro`, `locations/[slug].astro`, `projects/[slug].astro` (getLiveStory fallback)
- Modify: `site/.env.example` (+`PREVIEW_ACCESS_KEY` with comment), owner sets real value in `site/.env` and Netlify (branch-deploy context)

**Interfaces:**
- Consumes: `getLiveStory` from `@storyblok/astro`; `STORYBLOK_PREVIEW`, `PREVIEW_ACCESS_KEY` env.
- Produces:
  - `src/middleware.ts`: no-op unless `import.meta.env.STORYBLOK_PREVIEW === "true"`. In preview: sets `X-Robots-Tag: noindex, nofollow` on every response; allows the request if the URL has `_storyblok` param (visual editor), or `_preview` param equal to `PREVIEW_ACCESS_KEY` (then sets cookie `kom_preview=<key>`; HttpOnly, Path=/), or that cookie already valid; otherwise returns 404.
  - Each `[slug]` route top: `const liveStory = await getLiveStory(Astro); const story = liveStory ?? props.story ?? await getStory(...)` — in SSR mode `getStaticPaths` doesn't run, so the route must fetch by `Astro.params.slug` when `Astro.props.story` is undefined, and return `Astro.redirect` → 404 page when the story is null.
- [ ] **Step 1: Write middleware + route fallbacks exactly per Interfaces.**
- [ ] **Step 2: Local SSR smoke test**

```bash
STORYBLOK_PREVIEW=true PREVIEW_ACCESS_KEY=testkey npx astro build 2>&1 | tail -2
STORYBLOK_PREVIEW=true PREVIEW_ACCESS_KEY=testkey npx astro preview --port 4399 &   # via run_in_background
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4399/services/locksmith          # expect 404 (no key)
curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:4399/services/locksmith?_preview=testkey"  # expect 200
curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:4399/locations/warren?_preview=testkey"    # expect 200 — DRAFT story renders in preview
```
(If `astro preview` doesn't serve the Netlify adapter output, use `npx netlify serve` or `netlify dev` for this check and note which was used.)
- [ ] **Step 3: Create and push the branch; enable branch deploys**

```bash
git checkout -b preview && git push -u origin preview && git checkout feat/storyblok-cms
npx netlify api updateSite --data '{"site_id":"7a28abed-6def-4bbf-86ca-aaf96e642c38","body":{"build_settings":{"allowed_branches":["main","preview"]}}}'
```
Then tell the owner (plain steps, in the final report): set `PREVIEW_ACCESS_KEY` in Netlify (Branch deploys context), and in Storyblok → Settings → Visual Editor set location `https://preview--kom-usa-redesign.netlify.app/` with `?_preview=<key>` appended in the preview URL config.
NOTE: the `preview` branch at this point contains `feat/storyblok-cms` work — that is intended (it must contain the CMS code). After the final merge to main (finishing skill), fast-forward `preview` to main and push.
- [ ] **Step 4: Commit**

```bash
git add -A src/ .env.example
git commit -m "Add gated SSR preview mode with Storyblok live editing"
```

---

### Task 10: Publish→rebuild pipeline, editor guide, final verification

**Files:**
- Create: `site/scripts/storyblok-webhook.mjs`
- Create: `docs/EDITOR-GUIDE.md`
- Modify: `handoff.md` (mark CMS work state) — optional housekeeping

**Interfaces:**
- Consumes: `mapi` from storyblok-lib; Netlify CLI.
- Produces: Netlify build hook "storyblok-publish" + Storyblok webhook firing on `story.published`, `story.unpublished`, `story.deleted`, `story.moved` → that hook. Idempotent (checks existing by name).

- [ ] **Step 1: Create build hook + webhook script**

```js
// scripts/storyblok-webhook.mjs — register Storyblok→Netlify publish webhook.
// Usage: node scripts/storyblok-webhook.mjs <netlify-build-hook-url>
import { mapi } from './storyblok-lib.mjs';

const url = process.argv[2];
if (!url?.startsWith('https://api.netlify.com/build_hooks/')) {
  console.error('Pass the Netlify build hook URL as the first argument.');
  process.exit(1);
}
const existing = (await mapi('GET', '/webhook_endpoints/')).webhook_endpoints ?? [];
const found = existing.find((w) => w.name === 'Netlify production rebuild');
const payload = {
  webhook_endpoint: {
    name: 'Netlify production rebuild',
    endpoint: url,
    actions: ['story.published', 'story.unpublished', 'story.deleted', 'story.moved'],
    activated: true,
  },
};
if (found) {
  await mapi('PUT', `/webhook_endpoints/${found.id}`, payload);
  console.log('updated webhook');
} else {
  await mapi('POST', '/webhook_endpoints/', payload);
  console.log('created webhook');
}
```

```bash
HOOK=$(npx netlify api createSiteBuildHook --data '{"site_id":"7a28abed-6def-4bbf-86ca-aaf96e642c38","body":{"title":"storyblok-publish","branch":"main"}}' | python3 -c "import json,sys; print(json.load(sys.stdin)['url'])")
node scripts/storyblok-webhook.mjs "$HOOK"
```

- [ ] **Step 2: Write `docs/EDITOR-GUIDE.md`** — plain English, for staff. Required sections (write real prose for each; screenshots marked `[screenshot: …]` for the owner): Logging in · What you can edit (the six content types, one sentence each) · Writing and publishing a blog post (numbered steps ending "click Publish — the site updates itself in about a minute") · Editing service prices ("you can change the numbers; the fine print about deposits and phone quotes is automatic and can't be removed") · Creating a location page (start from the Warren draft example) · Adding FAQs, testimonials (the source link is required — paste the link to the real review), and project photos · The preview screen (how the visual editor shows changes before publishing) · What NOT to expect to edit (phone number, email, hours, the $10 offer — "ask Gabe; these are locked on purpose") · Who to contact when stuck.

- [ ] **Step 3: End-to-end publish test**

Update the seeded article via Management API (append " Today." to the excerpt), publish it, then watch Netlify:

```bash
node -e "…mapi PUT /stories/<id> with publish=1…"   # implementer writes this one-off inline using storyblok-lib
npx netlify api listSiteDeploys --data '{"site_id":"7a28abed-6def-4bbf-86ca-aaf96e642c38"}' | python3 -c "import json,sys; d=json.load(sys.stdin)[0]; print(d['state'], d.get('title'))"
```
Expected: a new deploy appears (title mentions the build hook) and reaches `ready`; `curl -s https://kom-usa-redesign.netlify.app/blog/ | grep -c 'Today.'` ≥1 after it finishes. (This tests against production AFTER the merge — if running pre-merge, verify the deploy fired and note that content parity lands with the merge.)

- [ ] **Step 4: Full verification + commit**

```bash
npx astro build 2>&1 | tail -2
grep -rn "info@kom-usa\|property.manage\|investor" src/ | grep -v legalName || echo CLEAN
```
Browser preview (production build via `astro preview`): `/`, `/blog/`, `/blog/welcome…`, `/services/*` ×3, `/locations/`, `/projects/`, `/contact`, `/about` all render; homepage FAQ shows CMS content; no console errors.

```bash
git add -A
git commit -m "Add publish webhook pipeline and staff editor guide"
```

---

### Post-merge steps (finishing skill / controller, not a subagent)

1. Merge `feat/storyblok-cms` → `main`, push (production deploys and goes CMS-live).
2. Fast-forward `preview` to `main`, push (preview branch redeploys with identical code in SSR mode).
3. Owner setup (relay in final message): `PREVIEW_ACCESS_KEY` env var in Netlify branch-deploy context; Storyblok Visual Editor default location; add first real staff account or share login.
4. Run the Task 10 Step 3 end-to-end check against production if it was deferred.
5. Update memory (`kom-usa-project.md`): CMS live, schemas scripted, editor guide location.
