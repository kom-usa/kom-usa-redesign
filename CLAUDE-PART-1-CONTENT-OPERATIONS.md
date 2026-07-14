# CLAUDE.md — Part 1: Astro Content Operations, Publishing Safety, and Source of Truth

Read this file **before designing or redesigning anything**.

This is the operational foundation for Astro websites that need editable content, blog publishing, resource libraries, service pages, attorney/team pages, location pages, and long-term SEO growth. The design system comes after this file. Visual polish is not useful if the content model, publishing path, image handling, SEO metadata, and deployment checks are fragile.

This file is especially important for local businesses, law firms, professional service firms, clinics, contractors, restaurants, nonprofits, consultants, and other small organizations that need a site they can keep publishing to without breaking pages.

---

## Core Principle

The website must have a single durable source of truth.

Astro handles the static build, but the content model, editor state, validation, image pipeline, generated Open Graph assets, Git workflow, SEO metadata, and Netlify deployment path must all agree on the same rules.

The agent must build the plumbing before adding AI writing tools, rich formatting, animation, or advanced design effects.

---

## Relationship to the Design File

This is **Part 1**.

The Astro + Tailwind design file is **Part 2** (`CLAUDE-PART-2-ASTRO-DESIGN.md`).

The required workflow is:

1. Read this Part 1 file.
2. Understand the project content model, publishing path, and deployment model.
3. Confirm whether the site needs an editor/admin workflow or only repo-based content editing.
4. Establish schemas, validation, image handling, and publishing safeguards.
5. Then read the Part 2 design file and begin visual implementation.

Do not start with animations, page sections, component libraries, or visual redesign until the content and publishing model is clear.

---

## Grill Me First: Pre-Build Discovery Interview

Before creating content schemas, page structures, publishing workflows, or design systems, the agent must interview the user based on the type of business being built.

The goal is not to delay work. The goal is to prevent generic websites, missing content requirements, weak SEO, wrong calls to action, and fragile publishing workflows.

If the user already provided some answers, do not ask again. Use the known answers and only ask for missing or unclear information.

### Required First Question

Start with:

> What type of business is this website for, and what is the primary action visitors should take?

Examples of primary actions:

- Call the office
- Submit a consultation form
- Book an appointment
- Request an estimate
- Order online
- Visit a location
- Read resources before contacting the business
- Join a mailing list

### Universal Questions for Every Business

Ask these before planning the site:

1. What is the business name, location, service area, and preferred phone/email/contact method?
2. What are the top 3–7 services or offers that should drive the website?
3. Who is the ideal customer or client?
4. What problems are visitors usually trying to solve when they arrive?
5. What makes this business different from competitors?
6. What proof of trust exists: reviews, testimonials, years in business, licenses, awards, certifications, case studies, photos, media mentions, guarantees, or community involvement?
7. What tone should the site have: premium, friendly, urgent, calm, traditional, modern, practical, warm, bold, or understated?
8. What websites should be used as references, and what specifically should be copied or avoided from them?
9. What pages already exist, and which URLs must be preserved with redirects?
10. Will the site need blog posts, resources, news updates, FAQs, location pages, service pages, or team profiles?
11. Who will update the site after launch: developer, business owner, staff, admin editor, or AI-assisted workflow?
12. What forms are needed, and where should submissions go?
13. What images, logos, brand colors, fonts, and other assets already exist?
14. Are there legal, medical, privacy, accessibility, compliance, or advertising restrictions?
15. What should the site absolutely not say, imply, or visually resemble?

### Law Firm / Legal Services Questions

Ask these for law firms, immigration firms, solo attorneys, legal clinics, and related legal service websites:

1. What practice areas should be treated as primary revenue or lead-generation pages?
2. What jurisdictions, courts, agencies, or geographic areas does the firm serve?
3. Who are the attorneys, founders, accredited representatives, paralegals, or team members that should appear publicly?
4. Which credentials, bar admissions, memberships, awards, languages, or years of experience are verified and safe to display?
5. What consultation process should the site promote: free consult, paid consult, phone screening, online form, in-office appointment, or referral-only intake?
6. What disclaimers are required on forms, footer, blog posts, and practice area pages?
7. Are there practice areas where the site must avoid promises, outcome guarantees, or overly aggressive language?
8. What languages should the site support or signal?
9. What common client questions should become FAQ or resource content?
10. What intake details should never be requested through a public form?

### Handyman / Contractor / Home Services Questions

Ask these for handyman services, construction, repair, cleaning, landscaping, HVAC, plumbing, electrical, roofing, remodeling, and similar businesses:

1. What exact services should be listed, and which are most profitable?
2. What jobs does the business not accept?
3. What service areas, cities, or neighborhoods should be emphasized?
4. Should the CTA be call now, request estimate, schedule service, emergency service, or upload photos?
5. Are before/after photos, project galleries, warranties, licenses, insurance, or certifications available?
6. Is pricing shown, estimated, hidden, or explained through ranges?
7. Are emergency, same-day, seasonal, or recurring services offered?
8. What trust concerns do customers usually have before hiring?
9. Should the site support image uploads for estimate requests?
10. Which services need their own SEO landing pages?

### Medical / Wellness / Care Questions

Ask these for clinics, therapists, dentists, med spas, wellness providers, home care, and related businesses:

1. What services, conditions, treatments, or appointment types should be featured?
2. Who are the providers, and what credentials are verified?
3. What claims must be avoided or softened for compliance and accuracy?
4. What insurance, payment, financing, or booking information should be visible?
5. Should the CTA be book appointment, call, request consult, patient portal, or referral?
6. What patient concerns need to be addressed early on the page?
7. Are there accessibility, HIPAA, consent, or privacy requirements for forms?
8. What content requires medical review or a last-reviewed date?
9. Should the site include conditions/treatments libraries, FAQs, or provider pages?
10. What emergency or urgent-care disclaimers are required?

### Restaurant / Hospitality Questions

Ask these for restaurants, cafes, catering, hotels, venues, private dining, and hospitality businesses:

1. What should visitors do first: reserve, order online, view menu, call, book event, or get directions?
2. What menu, hours, location, parking, dietary, and reservation details must be easy to find?
3. What atmosphere should the site communicate?
4. Are food, interior, event, or staff photos available?
5. Are online ordering, gift cards, catering, delivery, reservations, or event inquiries needed?
6. Should menus be editable as content, PDFs, structured data, or external links?
7. Are there recurring events, specials, seasonal menus, or private dining packages?
8. What local or cultural story should the site tell?
9. What platforms must be linked: Toast, OpenTable, Resy, DoorDash, Google Business Profile, Instagram, or others?
10. What information must be visible on mobile without scrolling too far?

### Nonprofit / Community Organization Questions

Ask these for nonprofits, associations, foundations, religious organizations, and community groups:

1. What is the mission in one sentence?
2. What should visitors do: donate, volunteer, attend, register, contact, learn, or apply?
3. Who are the audiences: donors, clients, members, volunteers, partners, press, or the public?
4. What programs or services need their own pages?
5. What proof of impact is available: numbers, stories, testimonials, reports, photos, partners?
6. Are donation platforms, event tools, newsletters, or member portals needed?
7. What accessibility, language, privacy, or safety concerns apply?
8. What content needs regular updates: events, news, campaigns, resources, reports?

### E-Commerce or Product Business Questions

Ask these when the website sells products, catalogs inventory, or sends buyers to product pages:

1. Is this a full store, catalog, quote-request site, affiliate site, or product landing page?
2. What products, categories, variants, and filters are needed?
3. What platform handles checkout, inventory, payments, taxes, and customer accounts?
4. Should Astro connect to Shopify, WooCommerce, Stripe, Snipcart, a headless CMS, or another backend?
5. What product information must be structured: price, availability, SKU, images, dimensions, materials, shipping, returns, reviews?
6. What trust signals are needed near product CTAs?
7. What product schema and merchant metadata are required?
8. What should happen when products are out of stock or discontinued?

### Output After the Interview

After asking and receiving answers, summarize the project in this format before implementation:

```md
## Project Discovery Summary

- Business type:
- Primary audience:
- Primary conversion action:
- Secondary conversion actions:
- Core services/offers:
- Service area/location:
- Trust signals:
- Required content collections:
- Required forms:
- Required disclaimers/compliance rules:
- SEO priorities:
- Image/brand assets available:
- Admin/editor needs:
- Netlify/deployment assumptions:
- Design direction:
- Things to avoid:
```

If the user cannot answer every question, proceed with reasonable assumptions, clearly mark those assumptions, and keep the architecture flexible enough to revise later.

---

## What This Adds Beyond a Normal Website Redesign

Most redesign prompts focus on the public website: layout, pages, navigation, colors, typography, components, CTAs, and SEO tags.

This file focuses on the system behind the site:

- How posts and pages are stored.
- What metadata is required before publishing.
- How drafts differ from committed Git content.
- How to prevent stale browser tabs from overwriting newer edits.
- How images are imported, renamed, validated, and optimized.
- How publishing behaves like a real Git client.
- How local build checks prevent broken content from reaching Netlify.
- How private admin/editor tooling stays separate from the public static site.

For small-business websites, this creates a safer long-term content workflow instead of a one-time static redesign.

---

## When This File Applies

Use this file whenever the project includes any of the following:

- Blog posts
- Resource articles
- News updates
- Practice area pages
- Service pages
- Location pages
- Case studies
- Attorney or team profiles
- FAQ libraries
- Landing pages
- Client education materials
- Any local admin/editor workflow
- Any Git-based publishing workflow
- Any AI-assisted content creation workflow

For a very small brochure site with no recurring publishing, the full admin system may not be necessary. Even then, the schema, image, metadata, and build-gate rules should still be followed.

---

## Content Model

Posts, pages, and other content entries should live in Astro content collections or another clearly typed content layer.

Markdown or MDX files may be used, but frontmatter must be treated like an API contract, not optional decoration.

### Required Base Fields

Every content entry must include:

- `title`
- `description`
- `date` or `updatedDate`, depending on content type
- `slug`
- `tags` or a clear taxonomy field where relevant
- `draft` or `status` where unpublished content exists
- `canonical` when the canonical URL differs from the generated route

### Required Production Fields

Production-ready posts and pages should include:

- Hero image
- Hero image alt text
- SEO title when different from visible title
- SEO description when different from visible description
- Open Graph image or generated OG image reference
- Author or reviewer when relevant
- Practice area, service, location, or content category where relevant
- Last reviewed date for legal, medical, financial, or highly time-sensitive content

### Slug Rules

- Slugs must be stable.
- Slugs must map directly to public URLs.
- Do not casually change slugs after publishing.
- If a slug changes, add a redirect.
- Use kebab-case.
- Avoid dates in slugs unless the site has a strong editorial reason.

### Validation Rules

The build must fail before publishing if:

- Required metadata is missing.
- A slug is duplicated.
- A hero image path is broken.
- Hero image alt text is missing.
- A canonical URL is malformed.
- A required schema field is missing.
- A draft is accidentally included in production output.
- Content has invalid dates or future dates without an explicit scheduled publishing system.

The editor should feel simple, but the schema should be strict.

If the content file is valid, Astro can build it. If the content file is invalid, the pipeline stops early.

---

## Content Collections by Site Type

The agent should model content around the business, not around generic blog templates.

### Law Firm

Recommended collections:

- `practiceAreas`
- `attorneys`
- `team`
- `blog`
- `resources`
- `faqs`
- `locations`
- `testimonials`

Recommended fields:

- Case type
- Applicable forms or agencies where useful
- Jurisdiction or service area
- Attorney reviewer
- Last reviewed date
- Disclaimer flag
- Urgency level
- Related services
- Related FAQs

### Home Services / Contractor / Handyman

Recommended collections:

- `services`
- `projects`
- `locations`
- `blog`
- `faqs`
- `testimonials`

Recommended fields:

- Service category
- Service area
- Before/after images
- Materials or brands where relevant
- Estimate CTA
- Emergency availability
- Related services

### Medical / Wellness

Recommended collections:

- `services`
- `providers`
- `conditions`
- `resources`
- `locations`
- `faqs`

Recommended fields:

- Provider reviewer
- Medical disclaimer flag
- Last reviewed date
- Symptoms or conditions treated
- Insurance/payment notes where appropriate
- Appointment CTA

### Restaurant / Hospitality

Recommended collections:

- `menuItems`
- `events`
- `privateDining`
- `blog`
- `locations`
- `faqs`

Recommended fields:

- Hours
- Menu category
- Dietary information
- Reservation CTA
- Location
- Event date

---

## Editor State

If a local admin/editor tool exists, draft/editor state must stay separate from the Markdown files committed to Git.

The same post can exist in different lifecycle states:

1. Saved in the editor database.
2. Written to a Markdown/MDX file.
3. Committed and pushed to Git.
4. Built successfully by Astro.
5. Deployed to the public Netlify site.

These states are not the same thing.

A post can be saved locally without being committed. A post can be committed without being deployed. A deployed page can lag behind the latest Git commit if a build fails.

The UI must make these differences visible.

### Required UI State Labels

The editor/admin UI should clearly distinguish:

- Draft saved locally
- Ready to publish
- Publish in progress
- Committed to Git
- Build pending
- Build failed
- Deployed
- Needs review
- Stale revision
- Publish rejected because content changed elsewhere

Do not show a vague “saved” message when the content has not been committed or deployed.

---

## Autosave and Multiple Open Editors

Autosave creates a conflict risk.

The same post can be open in two tabs, edited in both, and saved out of order. The system must not silently overwrite newer content.

### Required Revision Rule

Every save and publish request must include the revision the editor is editing.

If the server has a newer revision, reject the request and show a conflict message instead of overwriting newer content.

The conflict workflow should let the user:

- Review the newer version.
- Copy their unsaved changes.
- Reload the current version.
- Manually merge when needed.

Stale revision handling must be implemented before rich formatting tools, AI drafting tools, image generation, or advanced editing features.

Protecting content comes first.

---

## Git Publish Path

The publish flow must behave like a real Git client.

Do not simply write a file and push optimistically.

### Required Git Safeguards

The publishing system must:

1. Set Git author name and email from environment variables.
2. Apply token authentication consistently to fetch and push.
3. Repair or recreate the branch checkout if `HEAD` gets into a bad state.
4. Fetch from origin before writing content.
5. Fast-forward from origin before writing content.
6. Write only the intended file or files.
7. Validate the changed content.
8. Commit only the intended post/page/image files.
9. Push back to the source repository.
10. Report commit and deployment status clearly.

Most failures in this layer are normal Git state problems inside a long-running process or container. Do not treat them as Astro bugs unless Astro itself fails during the build.

### Commit Rules

Commits should be small and traceable.

Good examples:

- `Add blog post about family green cards`
- `Update asylum practice area page`
- `Add attorney profile for Jane Smith`
- `Fix hero image alt text on waivers page`

Bad examples:

- `update site`
- `content changes`
- `fix`
- `ai changes`

---

## Image Pipeline

Hero images and content images should live in the Astro asset tree whenever possible.

Preferred location:

```txt
src/assets/images/
  posts/
  services/
  team/
  locations/
  case-studies/
  og/
```

This lets Astro optimize images, generate variants, and catch broken references during local checks.

### Image Import Rules

When an image is imported, uploaded, or selected:

1. Copy it into the repo.
2. Rename it to a stable kebab-case filename.
3. Store it in the correct content-type folder.
4. Attach the final asset path to frontmatter.
5. Require alt text before publishing.
6. Run content checks before commit.
7. Let Astro handle optimization at build time.

Use Sharp as a preprocessing tool when uploaded or imported images need deterministic cleanup before they enter the Astro build. This includes resizing very large photos, cropping to approved ratios, converting JPG/PNG uploads to WebP or AVIF, creating thumbnails, normalizing headshot/project-gallery dimensions, and converting generated Satori SVG cards into PNG or JPEG.

Do not depend on temporary download URLs, editor-container-only files, untracked uploads, or loose public files unless there is a clear reason.

### Filename Rules

Use descriptive kebab-case names:

```txt
family-green-card-consultation.jpg
farmington-hills-immigration-law-office.webp
bathroom-tile-repair-before-after.jpg
jane-smith-attorney-profile.jpg
```

Avoid:

```txt
IMG_3028.jpg
screenshot.png
final-final.png
image1.webp
```

### Alt Text Rules

Alt text should describe the image specifically and naturally.

Good:

```txt
Attorney meeting with a family about an immigration case in Farmington Hills
```

Bad:

```txt
Image
SEO immigration lawyer green card attorney best law firm
```

### Generated Open Graph Image Rules

When the site uses generated social images, treat them as part of the content pipeline rather than as one-off design files.

Use Satori to generate simplified branded SVG cards from structured page data, then use Sharp to convert those SVG outputs into social-platform-ready PNG or JPEG images.

Generated OG images should:

- Use stable slug-based filenames.
- Usually output at 1200×630.
- Include the page title, business name, logo or brand mark, and optional service/category/location.
- Use the site's real brand colors and typography.
- Be generated at build time or committed to a predictable generated-assets folder.
- Be referenced by frontmatter or by the central SEO component.
- Feed `og:image`, `twitter:image`, and schema `ImageObject` where appropriate.

Do not manually create a disconnected social image for each page unless the project explicitly requires custom art direction. Automated Satori + Sharp generation is preferred for blogs, resource libraries, service pages, location pages, attorney/team pages, and other repeatable content types.

---

## SEO Metadata and Schema Contract

Content frontmatter must feed the central SEO system.

The agent must not create visual pages first and then bolt on SEO later.

Each page should be able to generate:

- `<title>`
- Meta description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Twitter/social preview tags where used
- Structured data graph
- Breadcrumbs
- Sitemap entry
- RSS entry where applicable
- Markdown/LLM alternate where applicable

### Required Structured Data Behavior

Use the connected structured data system from the Part 2 design file.

For business websites, content should connect to:

- `WebSite`
- `WebPage`
- `Organization` or accurate local-business subtype
- `Service`
- `Person`
- `Article` / `BlogPosting` / `NewsArticle`
- `FAQPage` only when real visible FAQs exist
- `BreadcrumbList`
- `ImageObject`
- `SearchAction` when site search exists

Schema must be generated from typed content data, not copied manually into random page files.

---

## Build Gate

A local build gate must run before anything deploys.

Minimum checks:

```bash
npm run check
npm run build
```

Recommended checks where available:

```bash
npm run astro check
npm run lint
npm run test
npm run validate:content
npm run validate:seo
npm run validate:schema
npm run validate:images
```

The system should block publishing when required checks fail.

AI-assisted writing features are useful, but they sit on top of this plumbing. Without checks, AI tools make it faster to create broken content.

---

## Netlify Deployment Rules

All Astro sites should be deployable through Netlify unless the project specifies otherwise.

The agent must ensure:

- The build command is correct.
- The publish directory is correct.
- Environment variables are documented.
- Forms are Netlify-compatible or use an approved external endpoint.
- Redirects are handled through Netlify redirects or project routing rules.
- Preview deploys are available for review.
- Failed builds are treated as publish failures, not ignored.

Recommended default:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

---

## Admin App Security and Privacy Guardrails

Only the static site output should be public.

The admin/editor app must remain private.

### Required Guardrails

- Keep tokens out of posts, pages, generated content, logs, and client-side bundles.
- Keep private hostnames, internal paths, local network details, and deploy credentials out of public content.
- Use environment variables for Git auth, deploy credentials, API keys, and Git identity.
- Do not expose editor APIs publicly without authentication.
- Do not put private client facts into AI prompts unless the user explicitly provides them for public content.
- Do not log full sensitive form submissions.
- Do not allow urgent legal, medical, or confidential matters to be submitted without proper disclaimers and routing.

### Law Firm-Specific Guardrails

For legal websites:

- Display clear attorney-client relationship disclaimers on forms.
- Warn users not to submit confidential or urgent documents through general forms unless the firm has approved that workflow.
- Make emergency/removal/deadline language accurate and not fear-based.
- Do not imply guaranteed outcomes.
- Do not fabricate reviews, case results, attorney credentials, awards, or language fluency.
- Require review dates and reviewer fields for legal guides when appropriate.

---

## AI-Assisted Features

AI features are allowed, but they must sit above the validated content system.

Use AI for:

- Drafting outlines
- Suggesting page sections
- Rewriting dense copy into plain language
- Generating meta descriptions
- Creating FAQ drafts
- Suggesting internal links
- Creating schema candidates from approved content
- Suggesting alt text for human review

Do not let AI bypass:

- Required frontmatter
- Human review for legal/medical/financial content
- Revision checks
- Image validation
- Build checks
- Git commit safeguards
- Form disclaimers
- Privacy rules

---

## Recommended Build Order

For a rebuild or new project, implement in this order:

1. Project structure and Astro configuration.
2. Content collections and frontmatter schemas.
3. Source checks for slugs, metadata, images, and drafts.
4. Basic layouts for content rendering.
5. Simple editor/admin save flow, if needed.
6. Revision checks for stale editor tabs.
7. Image import and preprocessing pipeline.
8. Git publish path.
9. Local build gate.
10. Netlify deploy configuration.
11. SEO graph, sitemap, RSS, robots, llms.txt, and related outputs.
12. Astro + Tailwind visual design system.
13. Animations and advanced components.
14. AI-assisted drafting, summaries, or content helpers.

Do not implement AI helpers before the content validation and publishing path are safe.

---

## Agent Pre-Design Checklist

Before designing, answer these questions from the existing repo or user requirements:

- Is this already an Astro project?
- Is the site static-only, or does it need a private editor/admin workflow?
- What content types exist?
- Which content types will be updated regularly?
- Where will content live: Markdown, MDX, CMS, database, or hybrid?
- What metadata is required for each content type?
- How are images stored and optimized?
- What is the Git source of truth?
- How does Netlify deploy the site?
- Are preview deploys required?
- Are there forms, and where do submissions go?
- Are there legal, medical, financial, privacy, or accessibility constraints?
- What checks must pass before publishing?

If these answers are unknown, make a best-effort assumption based on the repo and document it before coding.

---

## Design Handoff Rule

After this Part 1 foundation is understood, continue to the Astro + Tailwind design file (`CLAUDE-PART-2-ASTRO-DESIGN.md`).

The design agent must preserve these operational constraints while implementing layout, branding, animation, components, SEO, and Netlify deployment.

A visually impressive website that cannot be safely edited, validated, committed, built, and deployed is not complete.
