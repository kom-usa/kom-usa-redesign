# CLAUDE.md — Part 2: Astro + Starwind UI Website Design & SEO Rules

> **Read first:** `CLAUDE-PART-1-CONTENT-OPERATIONS.md` must be read before this file. Part 1 defines the content model, publishing safety, Git workflow, image pipeline, validation gates, admin/editor boundaries, and Netlify deployment assumptions. This file begins only after that operational foundation is understood.

This file defines the default implementation standard for all small-business Astro websites built with Claude Code. Use it for local service businesses, law firms, professional services, trades, clinics, consultants, restaurants, nonprofit organizations, and other polished local-business websites.

## Core Mission

Build every site as a fast, accessible, SEO-ready, visually distinctive Astro website that deploys cleanly to Netlify.

The final site must feel custom to the business, not like a generic template. It should combine strong local SEO structure, polished visual hierarchy, original brand direction, Starwind UI components, and Astro's static-first performance model.


## Grill Me First: Design Discovery Interview

Before designing any page, component, animation, brand system, or layout, the agent must run a short business-specific discovery interview.

This section exists to prevent generic websites. A good Astro site should be shaped by the business model, audience, service area, trust signals, and conversion goal before visual design begins.

If Part 1 already collected these answers, do not ask again. Use the Part 1 discovery summary and only ask targeted follow-up questions that affect design, SEO, content structure, or conversion.

### Required Opening Questions

Ask these first:

1. What type of business is this website for?
2. What is the #1 action visitors should take?
3. Who is the ideal customer/client/patient/donor?
4. What should the visitor feel within the first 5 seconds: trust, urgency, calm, excitement, reassurance, authority, affordability, premium quality, local familiarity, or something else?
5. What websites or screenshots should the design learn from, and what specifically should be copied or avoided?

### Universal Design Questions

Ask these for every project:

1. What are the top services, offers, or pages that need to be visually emphasized?
2. What makes the business meaningfully different from competitors?
3. What objections stop people from contacting or buying?
4. What proof should be visible above the fold: reviews, years in business, licenses, awards, case studies, photos, languages, guarantees, press, or community ties?
5. Should the site feel modern, traditional, premium, warm, bold, calm, editorial, practical, luxury, playful, or minimal?
6. Are there brand colors, fonts, logos, photos, icons, or design references that must be used?
7. Are there brand styles to avoid?
8. What content will exist at launch, and what content will grow over time?
9. Will the site need search, blog/resource cards, generated Open Graph images, or recurring content templates?
10. Are there accessibility, legal, privacy, medical, industry, or advertising limits that affect wording or design?

### Business-Type Design Questions

#### Law Firm / Legal Services

- Should the design emphasize authority, compassion, urgency, discretion, multilingual accessibility, or founder credibility?
- Which practice areas should dominate the homepage?
- Should attorney/team profiles be prominent or secondary?
- What disclaimers must appear near forms and legal information?
- Should the visual style feel traditional, modern, boutique, community-focused, high-end, or advocacy-driven?
- What client fears should the homepage answer immediately?

#### Handyman / Contractor / Home Services

- Should the design prioritize phone calls, estimate requests, emergency service, or project photos?
- Which services are most profitable or most searched locally?
- Should the visual style feel rugged, clean, premium, neighborhood-friendly, or fast-response?
- What proof matters most: before/after images, licenses, insurance, reviews, warranties, service trucks, team photos, or completed projects?
- Should customers be able to upload photos with estimate requests?

#### Medical / Wellness / Care

- Should the design emphasize calm, clinical credibility, warmth, privacy, transformation, or convenience?
- What services or conditions should be easiest to find?
- What claims must be avoided?
- Should provider credentials, appointment booking, insurance, or patient education be most prominent?
- What patient concerns should be answered before the first CTA?

#### Restaurant / Hospitality

- Should the design emphasize menu, reservations, ordering, atmosphere, events, or location?
- What should be visible immediately on mobile: hours, call button, directions, reserve button, menu, or order link?
- Should photography lead the design, or should typography/brand atmosphere lead?
- Are seasonal menus, private events, catering, or specials important?

#### Nonprofit / Community Organization

- Should the design emphasize mission, donations, volunteering, events, impact stories, or resources?
- What proof of impact should appear early?
- Which audience is primary: donors, clients, volunteers, members, partners, or press?
- Should the tone feel urgent, hopeful, institutional, grassroots, warm, or bold?

#### E-Commerce / Product Business

- Should the design prioritize product discovery, brand story, conversion, comparison, education, or repeat purchases?
- What categories, collections, filters, or product stories matter most?
- What trust details should appear near purchase CTAs: shipping, returns, warranty, reviews, guarantees, secure checkout, support?
- Does the store need WooCommerce, Shopify, Stripe, affiliate links, or another backend integration?

### Required Design Brief Before Coding

After the interview, write a brief design plan before implementing:

```md
## Design Brief

- Business type:
- Primary conversion goal:
- Audience:
- Desired first impression:
- Visual direction:
- Core pages/sections:
- Homepage hierarchy:
- Trust signals to feature:
- SEO/service pages needed:
- Animation style:
- Component strategy:
- Image/OG image strategy:
- Accessibility/compliance notes:
- Assumptions:
```

Do not begin detailed visual implementation until this design brief exists. If the user gives incomplete information, make practical assumptions and label them clearly.


## Required Stack

Use this stack unless the user explicitly says otherwise:

- **Framework:** Astro
- **UI foundation:** Starwind UI components
- **Styling:** Tailwind CSS v4 through the Astro project setup
- **Language:** TypeScript where applicable
- **Content:** Astro content collections for blog posts, service pages, case studies, team profiles, locations, FAQs, testimonials, and resource content
- **Deployment:** Netlify
- **Forms:** Netlify Forms or a verified form endpoint
- **Images:** Astro image optimization wherever possible, with Sharp for custom preprocessing, generated Open Graph exports, thumbnails, and batch image cleanup when needed
- **SEO:** Centralized SEO component, structured data, sitemap, robots.txt, Open Graph images, canonical URLs, and local-business schema
- **Analytics:** Plausible, Fathom, Google Analytics, or another lightweight approved analytics option

Do not build new projects as a single `index.html` file. Do not use Tailwind CDN. Do not create generic React-style client-heavy pages unless an interactive island is truly necessary.

## Flexible Astro-First Ecosystem Rule

Starwind UI is the default foundation, not a cage. The agent may incorporate any library, component pattern, animation, or visual treatment that works well with Astro **as long as the final result remains Astro-first**.

Use this decision order:

1. Prefer native `.astro` components, Starwind UI source components, Tailwind CSS v4, semantic HTML, and CSS transitions.
2. If a pattern from another ecosystem is better, adapt it into Astro instead of forcing the whole page into React.
3. Use React, Svelte, Vue, Solid, or another island only for the smallest interactive part that truly needs client-side state.
4. Never convert an Astro page into a client-rendered app just to use an animation or component demo.
5. Any borrowed pattern must be customized to the business brand, content, audience, and local market.

Allowed sources of inspiration and implementation include:

- Starwind UI components and Starwind Pro blocks
- Astro integrations and official Astro examples
- shadcn-style component patterns adapted into Astro
- 21st.dev-style interaction ideas, animation ideas, and premium visual patterns when they can be recreated cleanly
- React components used through `@astrojs/react` as isolated islands only
- Motion One, GSAP, Lenis, Swup, View Transitions, or similar libraries only when justified
- CSS-only animation patterns, scroll-triggered reveals, and microinteractions
- Vanilla TypeScript for small interactions
- Netlify-compatible serverless functions only when a static site cannot handle the requirement

The goal is flexibility with discipline: use whatever creates the best site, but ship the least JavaScript possible.

## Always Do First

Before writing code:

1. Inspect the existing project structure.
2. Confirm whether the project is already Astro.
3. Check `package.json`, `astro.config.*`, `src/`, `public/`, and any existing design system files.
4. Check `brand_assets/`, `public/brand/`, `public/images/`, `src/assets/`, and any uploaded design references.
5. Identify the business type, location, audience, services, calls to action, and trust signals.
6. If a reference image is provided, match it closely. If no reference is provided, design from scratch using the craft rules below.
7. Use Starwind UI as the component foundation, but customize it so the finished site does not look like a stock component library.

## Starwind UI Rules

Starwind UI is the default UI system. It provides accessible Astro components styled with Tailwind CSS v4 and gives direct control over component source code. Use this to create custom-feeling sections while preserving consistency and accessibility.

### Use Starwind UI For

- Buttons
- Cards
- Accordions
- Alerts
- Badges
- Breadcrumbs
- Carousels
- Forms
- Inputs
- Textareas
- Selects
- Tabs
- Dialogs and sheets when needed
- Tables
- Tooltips
- Theme toggles
- Navigation/sidebar patterns when appropriate

### Customization Rules

- Do not leave Starwind components in their default visual state.
- Customize tokens, spacing, border radii, typography, shadows, and interaction states to match the business.
- Prefer native `.astro` components over client-side JavaScript.
- Use JavaScript only when required for interaction.
- Keep components accessible: keyboard navigation, visible focus states, semantic HTML, ARIA only where needed.
- Maintain dark mode support only if the site design calls for it. Do not add a dark-mode toggle by default for every local business.


## External Component and Animation Adaptation Rules

When adapting components, blocks, or animations from React, 21st.dev-style examples, shadcn-style examples, Framer Motion demos, GSAP demos, or any other source:

### Adaptation Priorities

1. Rebuild the structure as `.astro` components whenever possible.
2. Replace generic props and demo content with business-specific content.
3. Convert default colors, shadows, borders, and spacing into the project brand system.
4. Keep animation progressive-enhancement friendly: the page must still work without JavaScript.
5. Use Astro client directives intentionally: `client:load` only when needed immediately, `client:visible` for below-the-fold interactive islands, and `client:idle` for non-critical enhancements.
6. Prefer `Astro.slots`, typed props, content collections, and reusable section components over large monolithic components.

### React Island Rules

React is allowed, but only as an island inside Astro.

Use React when:

- The interaction requires local state that would be awkward in vanilla JavaScript.
- A high-quality component or animation cannot reasonably be recreated in `.astro`.
- The island is limited to a small part of the page, such as a calculator, complex carousel, animated comparison, interactive map, scheduler, command menu, or advanced testimonial/gallery interaction.

Do not use React for:

- Static hero sections
- Static service cards
- Static FAQ content
- Static testimonials
- Basic navigation
- Basic forms that Netlify can handle
- Decorative animation that CSS can handle

### Animation Library Rules

The agent may use animation libraries only when the result is meaningfully better than CSS.

Use this hierarchy:

1. CSS transitions and keyframes
2. Astro View Transitions for page navigation polish
3. Vanilla TypeScript with Intersection Observer for reveals
4. Motion One or similar lightweight animation tools
5. GSAP only for complex sequencing, SVG animation, or high-value storytelling sections
6. Framer Motion only inside a React island when React is already justified

Never add a heavy animation dependency for simple fades, slides, hover effects, or scroll reveals.

### Visual Inspiration Rules

The agent may study polished external designs, including 21st.dev-style components, but must not paste in a generic block unchanged.

Every adapted visual pattern must answer:

- Why does this pattern fit the business?
- What brand tokens were changed?
- How does it support conversion, trust, or comprehension?
- Does it preserve Astro's performance advantage?
- Does it remain accessible with keyboard and reduced-motion settings?

If the answer is unclear, simplify the pattern.

## Astro Architecture

Use this project structure as the default target:

```txt
src/
  assets/
    images/
    fonts/
  components/
    common/
    layout/
    sections/
    seo/
    starwind/
  content/
    blog/
    services/
    locations/
    team/
    testimonials/
    faqs/
    case-studies/
  data/
    business.ts
    navigation.ts
    site.ts
  layouts/
    BaseLayout.astro
    ServiceLayout.astro
    BlogLayout.astro
    LocationLayout.astro
  pages/
    index.astro
    about.astro
    contact.astro
    services/
    locations/
    blog/
    robots.txt.ts
    rss.xml.ts
    llms.txt.ts
  styles/
    global.css
```

Keep business facts in `src/data/business.ts` so names, phone numbers, locations, hours, services, and social links are not duplicated across templates.


### Astro Integration Flexibility

Use Astro integrations when they improve the project without undermining performance.

Common allowed integrations:

- `@astrojs/sitemap` for sitemap generation
- `@astrojs/rss` when the site has articles/resources
- `@astrojs/mdx` when richer editorial content is useful
- `@astrojs/react` only for isolated React islands
- `@astrojs/netlify` when the project needs Netlify adapter behavior
- `@astrojs/image`/native Astro assets depending on the Astro version and project setup
- Pagefind or `astro-pagefind` for static search when the site has enough content to justify search

Do not install integrations speculatively. Add them only when the site needs them.

## Netlify Requirements

Every Astro site must be prepared for Netlify deployment.

### Required Files

Create or update:

```txt
netlify.toml
public/_headers
public/_redirects
```

### `netlify.toml` Baseline

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    No-Vary-Search = "key-order, params=(\"utm_source\" \"utm_medium\" \"utm_campaign\" \"utm_content\" \"utm_term\")"
```

### Redirect Rules

- Preserve old URLs with 301 redirects whenever redesigning or migrating a site.
- Add redirects for renamed service pages, changed blog URLs, and old contact/about URLs.
- Never delete high-value URLs without a redirect.
- Use `public/_redirects` for simple migrations and `netlify.toml` for more complex rules.

Example:

```txt
/old-service-page/ /services/new-service-page/ 301
/old-contact.html /contact/ 301
```

### Netlify Forms

For basic lead forms, use Netlify Forms unless the project requires a CRM or custom backend.

Required form fields for local businesses:

- Name
- Email
- Phone
- Service needed
- Message
- Consent/notice language when appropriate

For law firms, do not imply attorney-client privilege is created by submitting a form. Include a short disclaimer near the form.

## SEO Foundation

Every page must have a centralized SEO implementation. Do not scatter metadata across pages.

### Required Metadata Per Page

Each indexable page needs:

- Unique `<title>`
- Unique meta description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Open Graph image alt text
- Twitter/X card metadata when appropriate
- Robots meta defaults
- JSON-LD structured data
- Breadcrumb data when nested

### Central SEO Component

Create a reusable SEO component in `src/components/seo/Seo.astro` or use an approved SEO graph package if already installed.

The SEO component must handle:

- Title templates
- Descriptions
- Canonicals using `Astro.site`
- Noindex support
- Open Graph metadata
- Social card images
- JSON-LD graph injection
- Alternate language URLs if multilingual
- RSS discovery links when a blog exists
- Markdown alternate links when markdown endpoints exist

- Schema map and AI-discovery links when implemented
- Build-time validation for duplicate titles/descriptions, H1 count, internal links, metadata length, alt text, and schema validity where tooling exists

### Title and Description Rules

- Titles should generally be 30–65 characters when possible.
- Meta descriptions should generally be 70–160 characters when possible.
- Every page must have a distinct search intent.
- Avoid boilerplate titles like `Home | Company Name`.
- Use human-focused titles, not keyword-stuffed strings.

Good examples:

```txt
Farmington Hills Immigration Lawyers | Mann Immigration Law
Emergency Plumbing Repair in Royal Oak | Company Name
Estate Planning Attorney in Ann Arbor | Company Name
```

Bad examples:

```txt
Home
Services
Best Lawyer Attorney Law Firm Legal Help Michigan
```

## Structured Data Rules

Use JSON-LD. Prefer a connected `@graph` rather than isolated schema snippets.

### Required Sitewide Entities

Include as appropriate:

- `WebSite`
- `Organization` or `LocalBusiness`
- `ProfessionalService`, `LegalService`, `HomeAndConstructionBusiness`, `Dentist`, `MedicalBusiness`, or the closest relevant subtype
- `WebPage`
- `BreadcrumbList`
- `ImageObject`
- `Person` for attorneys, owners, doctors, staff, or authors
- `Article` or `BlogPosting` for articles
- `FAQPage` for real FAQ sections
- `Service` for service pages
- `Place` or local business location entities for location pages

### Local Business Schema

For local businesses, include:

- Business name
- URL
- Logo
- Image
- Phone
- Address
- Geo coordinates if known
- Opening hours if available
- Area served
- SameAs links
- Price range if appropriate
- Services offered

### Law Firm Schema

For law firms, use `LegalService` or a more specific legal schema pattern where appropriate. Include:

- Practice areas
- Attorneys or founder profiles
- Office address
- Phone number
- Consultation CTA
- Bar/admission details only when verified
- Disclaimer pages where needed

Do not invent credentials, awards, reviews, case results, attorney admissions, or legal claims.

## Sitemaps, Indexing, and Discovery

Every production site must include:

- `@astrojs/sitemap`
- `robots.txt`
- Sitemap reference in `robots.txt`
- RSS feed when the site has a blog/resources section
- Per-collection sitemap grouping when the site has substantial content
- `lastmod` dates where feasible
- Proper 404 page
- Redirect map for migrations

### Recommended Discovery Files

Where appropriate, add:

- `/llms.txt`
- Schema map endpoint
- Markdown alternates for articles/resources
- RSS feed with full content for articles

These help AI agents and search/discovery systems understand the site’s content more reliably.

## Astro SEO + Content Intelligence Stack

Use the following ecosystem when it improves the Astro project. These tools are not decorative add-ons. They support discoverability, structured data, content quality, site search, performance, and shareability.

### Required: `@jdevalk/seo-graph-core` and `@jdevalk/astro-seo-graph`

Use `seo-graph` as the default structured data system for Astro websites. Prefer a connected schema.org `@graph` over scattered one-off JSON-LD snippets.

The agent must create stable `@id` references for connected entities such as:

- `WebSite`
- `WebPage`
- `Organization` or the most specific applicable local-business subtype
- `LocalBusiness`, `LegalService`, `ProfessionalService`, `HomeAndConstructionBusiness`, `MedicalBusiness`, `Restaurant`, or another accurate subtype when applicable
- `SiteNavigationElement`
- `BreadcrumbList`
- `Person` for attorneys, founders, providers, authors, and team members
- `Service` for service pages
- `Article`, `BlogPosting`, or `NewsArticle` for editorial content
- `FAQPage` only when the visible page contains real FAQ content
- `ImageObject` for primary images, logos, and Open Graph images

Implementation expectations:

- Create a reusable SEO layer rather than duplicating metadata manually in every page.
- Keep business facts in one canonical data source and reference them across metadata, schema, contact sections, footer, and location pages.
- Use the most specific accurate schema.org type available. Do not default to generic `Organization` or `LocalBusiness` when a more precise entity fits.
- Do not invent addresses, coordinates, reviews, credentials, awards, author details, legal admissions, case results, medical claims, or certifications.
- Include `SearchAction` on `WebSite` only when the site has real on-site search.
- Validate schema during development when tooling exists.
- Make schema match visible page content. Do not mark up content that users cannot see.

Recommended file structure:

```txt
src/
  components/
    seo/
      Seo.astro
      SiteSeo.astro
  lib/
    seo/
      ids.ts
      graph.ts
      site.ts
      local-business.ts
      services.ts
      articles.ts
      breadcrumbs.ts
      images.ts
```

### Required QA Workflow: `jdevalk/skills`

When available, use `jdevalk/skills` as a launch and publishing QA workflow. Treat these as agent checks, not visual components.

Run the relevant skills before launch and before publishing important new content:

- `astro-seo` for technical Astro SEO coverage.
- `metadata-check` for page titles, meta descriptions, Open Graph copy, schema descriptions, service descriptions, and CTAs.
- `readability-check` for homepage copy, service pages, legal pages, medical pages, FAQs, location pages, and blog posts.
- `content-seo` for blog posts, resource guides, service pages, practice area pages, and location landing pages.
- `astro-github-actions` when the project needs CI checks before Netlify deployment.

Content standards:

- Write for real customers, not search engines only.
- Keep local-business copy clear, specific, and practical.
- For law firms, immigration firms, medical providers, trades, and professional services, explain technical terms in plain language.
- Prefer concrete proof, process, service detail, and locality over generic claims.
- Reduce dense paragraphs, vague adjectives, and unsupported superlatives.
- Use headings that answer customer questions.

### Conditional: `astro-pagefind`

Use `astro-pagefind` when the site has enough content to justify static search. Do not add search to small brochure sites unless the client requests it.

Add Pagefind when the site includes one or more of the following:

- 15+ blog posts or resource articles
- Large FAQ/resource centers
- Many service pages
- Practice area or case-type libraries
- Attorney, provider, staff, or team directories
- Multiple location landing pages
- Documentation, guides, or knowledge-base content

Implementation expectations:

- Add Pagefind through the Astro integration.
- Prefer Pagefind's current component-based UI where appropriate.
- Style the search interface with the site's Starwind/Tailwind design system.
- Exclude low-value pages, utility pages, thank-you pages, legal boilerplate, and duplicate content from indexing when appropriate.
- Ensure the search index works after static Netlify builds.
- Add `SearchAction` schema to the `WebSite` entity only when search is present.
- Keep search lightweight and accessible.

### Conditional/Recommended: `vercel/satori`

Use `vercel/satori` for branded Open Graph and social preview images when a site has shareable content. This is especially useful for law firms, service businesses, local guides, blog-heavy sites, location pages, attorney/team bios, case studies, and resource centers.

Use Satori for:

- Homepage social card
- Service page cards
- Practice area cards
- Blog/resource article cards
- Location page cards
- Attorney, provider, founder, or team bio cards
- Case study cards
- Seasonal campaign or event cards

Satori card standards:

- Generate consistent 1200×630 Open Graph images.
- Use the project logo, brand colors, typography, local visual motifs, and page-specific title.
- Include business name and optional category, service, location, author, or CTA.
- Build simplified static OG card components instead of reusing full page components.
- Respect Satori's limited HTML/CSS support.
- Load local font data in supported formats.
- Generate images at build time where possible for Netlify static deploys.
- Do not use browser-only APIs, hooks, animation, complex CSS, or heavy page layouts inside Satori cards.

Suggested output paths:

```txt
public/og/home.png
public/og/services/[slug].png
public/og/blog/[slug].png
public/og/locations/[slug].png
public/og/team/[slug].png
```

### Recommended Pairing: Satori + Sharp

Use Satori and Sharp together when the project needs branded social images, generated thumbnails, or build-time image processing beyond Astro's standard image optimization.

Plain-language model:

- **Satori designs the image.** It turns a simplified HTML/CSS/JSX-style card into an SVG.
- **Sharp prepares the file.** It converts, resizes, crops, compresses, and exports the image as a web-ready PNG, JPEG, WebP, or AVIF.
- **Astro publishes the image.** The SEO component references the final generated image in `og:image`, `twitter:image`, schema `ImageObject`, and the sitemap where appropriate.
- **Netlify builds the result.** Generated assets must be created during build or committed to the repo so the static deploy is reliable.

Use Sharp for:

- Converting Satori SVG output into PNG or JPEG for Open Graph/social cards.
- Resizing oversized uploaded images before they enter the Astro asset pipeline.
- Creating thumbnails for blog indexes, service cards, attorney/team cards, project galleries, and resource libraries.
- Converting JPG/PNG uploads into WebP or AVIF for normal site imagery.
- Normalizing dimensions and crop ratios for cards, hero images, headshots, and project photos.
- Batch-processing imported images from an admin/editor workflow.

Recommended build flow:

```txt
Content frontmatter
  ↓
Astro content collection
  ↓
Satori OG card template
  ↓
Sharp converts SVG to PNG/JPEG
  ↓
Generated image saved to public/og/ or an approved generated-assets path
  ↓
Astro SEO component outputs og:image, twitter:image, and ImageObject schema
  ↓
Netlify builds and publishes the static site
```

Implementation expectations:

- Prefer generated social cards for content-heavy sites, law firms, resource centers, service/location pages, attorney/team bios, and guides.
- Keep Satori templates separate from normal website components. Do not try to render full page components as OG images.
- Use simple layouts, supported CSS, local fonts in supported formats, and static data only.
- Use Sharp only where it adds value beyond Astro's built-in image optimization.
- Do not add Sharp merely because it sounds advanced; use it for custom preprocessing, generated OG images, uploaded-image cleanup, batch conversions, or thumbnail generation.
- For generated social images, use consistent 1200×630 output unless the project has a documented reason to use another standard.
- Keep generated image filenames stable and slug-based so links do not change unexpectedly.

### Decision Hierarchy

Use these tools with discipline:

1. `seo-graph` belongs in the default SEO architecture for nearly every Astro project.
2. `jdevalk/skills` belongs in the agent QA checklist before launch and before publishing important content.
3. `satori` should be used when branded social sharing matters or the site has content that will be shared.
4. `astro-pagefind` should be used only when content depth justifies on-site search.

Do not add dependencies just because they are available. Add them when they improve SEO, clarity, conversion, maintainability, or shareability without undermining Astro's performance advantage.

## Content Collections

Use Astro content collections to enforce structure.

### Default Collections

Create collections only when needed:

- `services`
- `locations`
- `blog`
- `team`
- `testimonials`
- `faqs`
- `case-studies`

### Frontmatter Standards

Each content item should include appropriate fields:

```ts
{
  title: string,
  description: string,
  slug?: string,
  publishDate?: Date,
  updatedDate?: Date,
  serviceArea?: string[],
  featuredImage?: ImageMetadata,
  imageAlt?: string,
  noindex?: boolean,
  canonical?: string,
  category?: string,
  relatedServices?: string[],
  faqs?: Array<{ question: string; answer: string }>
}
```

Validate titles, descriptions, images, and required fields with Zod. Fail the build for missing required SEO fields.

## Content Strategy for Local Businesses

Build pages around real customer questions, service intent, and local trust.

### Required Core Pages

Most local-business sites should include:

- Home
- About
- Services index
- Individual service pages
- Location/service-area pages when relevant
- Contact
- Blog/resources if the business will publish consistently
- Privacy policy
- Terms/disclaimer page when appropriate

### Homepage Structure

Default homepage sections:

1. Hero with clear business category, local area, and primary CTA
2. Trust strip with concrete proof points
3. Services overview
4. Why choose us
5. Process or how it works
6. Featured testimonials/reviews if real reviews are available
7. Local service area section
8. FAQ section
9. Final CTA

Do not use every section blindly. Match the business and available content.

### Service Page Structure

Each service page should answer:

- What the service is
- Who needs it
- Common problems it solves
- What the process looks like
- Why this provider is credible
- Local area served
- Pricing or quote process if available
- FAQs
- CTA

### Local SEO Rules

- Use city, region, and service-area wording naturally.
- Do not create thin doorway pages for every suburb.
- Location pages must contain unique, useful local content.
- Include embedded map only when it helps users and does not harm performance.
- Show NAP information consistently: name, address, phone.
- Add real local proof: landmarks, neighborhoods, service areas, courts, counties, industries, or customer types when accurate.

## Writing Rules for SEO and AI Extraction

Write content for humans first, then make it easy for search engines and AI systems to extract.

- Lead each paragraph with the main point.
- Keep most sentences under 20 words.
- Use one idea per paragraph.
- Use descriptive headings.
- Avoid filler words.
- Avoid generic claims like “we care about quality.” Prove it with specifics.
- Use plain language for service explanations.
- Answer common questions directly.
- Do not stuff keywords.
- Do not invent testimonials, reviews, awards, guarantees, credentials, or statistics.

## Design Direction

Every site must look polished, professional, and specific to the business.

### Anti-Generic Guardrails

- Do not use default Tailwind blue/indigo as the primary brand color.
- Do not use generic SaaS gradients for every business.
- Do not use the same layout rhythm for every homepage.
- Do not use stock phrases like “solutions for your business” without context.
- Do not create floating cards, bento grids, or glassmorphism unless the brand supports it.
- Do not use random icons as decoration. Icons must clarify meaning.
- Do not use generic smiling business stock photos when real local imagery or better abstract imagery would work.

### Brand System

For every site, define:

- Primary color
- Secondary color
- Accent color
- Background color
- Text color
- Muted text color
- Border color
- Surface color
- Elevated surface color
- Shadow system
- Border-radius scale
- Spacing scale
- Heading font
- Body font
- Button styles
- Link styles
- Form styles

If brand assets exist, derive the system from them. If not, create a brand system based on the business category, audience, and local market.

### Typography

- Use distinct but compatible heading and body typography.
- Heading fonts should match the business: authoritative for law firms, practical for trades, warm for care businesses, refined for professional services.
- Body text must be highly readable.
- Use tight tracking on large display headings only when appropriate.
- Avoid tiny body text. Default body copy should usually be 16–18px.
- Maintain generous line height for readability.

### Layout

- Use clear section hierarchy.
- Keep CTAs visible and repeated naturally.
- Use asymmetric details, editorial layouts, local imagery, custom dividers, or unique spacing to prevent template feel.
- Every section must have a reason to exist.
- Use whitespace intentionally.
- Make mobile layouts excellent, not merely acceptable.

### Visual Depth

Use a layering system:

- Base background
- Subtle alternate background
- Elevated cards
- Floating callouts
- Modal/sheet layer when needed

Use color-tinted layered shadows instead of generic `shadow-md`.

## Animation and Interaction Rules

Animations must improve clarity and perceived quality without hurting performance.

### Allowed Animation Properties

Only animate:

- `transform`
- `opacity`
- `filter` only when lightweight and justified

Avoid animating:

- Width
- Height
- Top/left/right/bottom
- Box-shadow
- Large blur effects
- Layout-affecting properties

### Motion Standards

- Respect `prefers-reduced-motion`.
- Avoid scroll-jacking.
- Avoid animation libraries unless required.
- Prefer CSS transitions and small Astro islands.
- Do not use `transition-all`.
- Use purposeful reveal animations sparingly.
- Keep animations subtle for law firms and professional services.
- Trades and local services can use slightly more energetic interaction, but never gimmicky motion.

### Interaction States

Every clickable element must have:

- Hover state
- Focus-visible state
- Active state
- Disabled state where applicable

Focus states must be visible and accessible.

## Image Rules

- Use Astro `<Image>` or `<Picture>` where possible.
- Use Sharp for custom preprocessing when images need resizing, cropping, compression, format conversion, thumbnail generation, Satori export conversion, or admin-upload cleanup before Astro builds.
- Provide accurate alt text.
- Use empty alt only for decorative images.
- Avoid heavy above-the-fold images unless optimized.
- Set image dimensions to prevent layout shift.
- Use responsive sizes.
- Use WebP/AVIF for site images where supported.
- Use PNG or JPEG for generated Open Graph images because social platforms support them reliably.
- Do not use unoptimized full-resolution stock photos.
- Do not use Sharp as a replacement for Astro image optimization when Astro already handles the requirement cleanly.

### Open Graph Images

Every important page should have a 1200×630 or 1200×675 Open Graph image.

OG images should include:

- Business name or logo
- Page title or service name
- Brand colors
- Subtle local/business-specific visual treatment

Use generated OG images where feasible so new pages do not ship without social images.

## Accessibility Rules

- Use semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`.
- One visible `<h1>` per page.
- Headings must follow a logical hierarchy.
- Labels required for form controls.
- Do not rely on placeholder text as labels.
- Maintain color contrast.
- Use accessible names for icon buttons.
- Ensure mobile menus are keyboard accessible.
- Do not trap focus except in modals/dialogs.
- Add skip link to main content.

## Performance Rules

Astro should ship minimal JavaScript by default.

- No client-side JavaScript unless required.
- Use Astro islands only for interactive components.
- Keep third-party scripts minimal.
- Load maps, chat widgets, reviews widgets, and embeds lazily.
- Avoid large animation libraries.
- Avoid heavy sliders above the fold.
- Preload critical local fonts.
- Use `font-display: swap`.
- Use Netlify immutable caching for `/_astro/*` assets.
- Test Lighthouse or equivalent where practical.

## Component Patterns

Build reusable components for:

- `Header.astro`
- `Footer.astro`
- `Hero.astro`
- `SectionHeader.astro`
- `ServiceCard.astro`
- `TrustBar.astro`
- `TestimonialCard.astro`
- `FAQAccordion.astro`
- `CTASection.astro`
- `ContactForm.astro`
- `Breadcrumbs.astro`
- `LocalBusinessSchema.astro` or schema utility
- `Seo.astro`

Use Starwind components internally when appropriate, but keep project-level components business-specific.

## Business-Type Design Guidance

### Law Firms

Tone: authoritative, calm, clear, trustworthy.

Design cues:

- Deep neutrals, refined blues/greens/burgundy/gold where appropriate
- Strong typography
- Clear practice-area navigation
- Attorney/founder credibility
- Contact CTA visible but not aggressive
- Disclaimers where appropriate

Avoid:

- Gimmicky animation
- Overpromising outcomes
- Fake case results
- Excessive stock courthouse imagery

### Handyman and Home Services

Tone: practical, reliable, direct.

Design cues:

- Warm neutrals, durable accent colors, practical iconography
- Before/after galleries if real images exist
- Service area clarity
- Easy quote request
- Phone-first mobile experience

Avoid:

- Overly corporate SaaS styling
- Thin service pages
- Fake project photos

### Medical, Wellness, and Care Businesses

Tone: warm, reassuring, credible.

Design cues:

- Softer color palette
- Calm spacing
- Clear services and appointment flow
- Staff trust signals
- Accessibility emphasis

Avoid:

- Unsupported health claims
- Overly playful visuals
- Confusing booking paths

### Restaurants and Hospitality

Tone: sensory, local, inviting.

Design cues:

- Strong photography
- Menu clarity
- Hours/location prominence
- Reservation/order CTA
- Local personality

Avoid:

- Hiding practical information
- Heavy animations that slow mobile users

## Reference Image Rules

If a reference image is provided:

- Match layout, spacing, typography, color, and hierarchy closely.
- Preserve the visual concept unless the user asks for changes.
- Use real brand assets where available.
- Do not add extra sections or features that conflict with the reference.
- Screenshot the page locally, compare, fix mismatches, and repeat.

If no reference image is provided:

- Create a custom design direction from the business type, audience, services, location, and assets.
- Use high-craft layouts and Starwind UI components as a foundation.
- Avoid template-like sameness.

## Local Development and Screenshot Workflow

Use the project’s Astro dev server.

```bash
npm install
npm run dev
```

Default local URL is usually:

```txt
http://localhost:4321
```

If the project uses a different port, follow the running dev server output.

When screenshotting:

- Always screenshot localhost, never `file:///`.
- Test desktop and mobile widths.
- Check spacing, type scale, colors, button states, header behavior, and form layout.
- Compare against reference images if provided.
- Do at least two visual QA passes for reference-matching work.

## QA Checklist Before Final Response

### Build and Code

- `npm run build` passes.
- No TypeScript errors.
- No missing imports.
- No unused placeholder sections.
- No console errors from avoidable code.
- No broken internal links.

### SEO

- Unique titles and descriptions.
- Canonical URLs correct.
- One H1 per page.
- Sitemap generated.
- Robots.txt references sitemap.
- Structured data present and valid.
- Breadcrumb schema where needed.
- OG image present for key pages.
- Service/location pages have real content depth.

### Accessibility

- Keyboard navigation works.
- Focus-visible states are obvious.
- Form labels exist.
- Color contrast is acceptable.
- Alt text is accurate.
- Mobile nav is accessible.

### Performance

- Minimal JavaScript shipped.
- Images optimized.
- Fonts optimized.
- Third-party scripts minimized.
- Netlify caching headers configured.
- No layout shift from unsized images.

### Design

- The site feels specific to the business.
- Colors are custom and brand-appropriate.
- Typography has hierarchy.
- Spacing is consistent.
- CTAs are clear.
- Components do not look like untouched defaults.
- Mobile design is polished.


## Source-Aware Implementation Rule

When the user provides links, documentation, screenshots, or examples, read them before implementing. Do not rely on memory when the linked documentation may have changed.

For Astro SEO, prioritize the documented full-stack approach:

- Central SEO component
- Connected JSON-LD graph
- Astro content collections with typed validation
- Per-collection sitemaps where useful
- Git-based `lastmod` when feasible
- IndexNow where appropriate
- RSS for articles/resources
- `robots.txt` with sitemap and schema map references when implemented
- Markdown alternates and `llms.txt` for agent discovery where useful
- Redirects and 404 handling for migrations
- Lightweight analytics and validation workflows

For Starwind UI, prioritize its core model:

- Native Astro components
- Tailwind CSS v4
- Source-owned components that can be customized
- TypeScript support
- Accessibility and keyboard navigation
- Consistent patterns, not untouched defaults

## Hard Rules

- Build Astro websites, not static one-file HTML demos.
- Deploy assumptions must target Netlify.
- Use Starwind UI as the default component system.
- Do not use Tailwind CDN.
- Do not use `transition-all`.
- Do not animate layout properties.
- Do not invent business facts, reviews, credentials, awards, or statistics.
- Do not create thin local doorway pages.
- Do not ship pages without SEO metadata.
- Do not ship forms without clear labels and working submission strategy.
- Do not ignore brand assets.
- Do not use generic template copy.
- Do not overuse JavaScript in Astro.
- Do not reject useful React/21st.dev-style/third-party visual ideas automatically; adapt them into Astro-first components when they improve the site.
- Do not install client-side dependencies unless the benefit is clear.
- Do not let animation or visual novelty override accessibility, SEO, page speed, or conversion clarity.

## Final Output Standard

When finished, summarize:

1. What was changed.
2. Which files were created or edited.
3. Any assumptions made.
4. Build/test results.
5. Remaining items the user must provide, such as real images, reviews, credentials, service areas, or legal disclaimers.
