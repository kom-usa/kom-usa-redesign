# KOM USA Site Handoff

## Current architecture

- Astro 7 static marketing site in `site/`, deployed by Netlify from the repository root configuration.
- Sanity is the only CMS. The standalone Studio and schemas live in `studio/`.
- The Astro data client is `site/src/lib/sanity.ts`; published content is fetched at build time.
- Services and homepage FAQs have code-owned fallbacks so a missing or unavailable CMS does not break the build.
- Business contact details, operating hours, form behavior, pricing disclaimers, and service guardrails remain code-owned.
- Netlify Forms feed the lead workflow; Brevo handles contact sync and acknowledgement email.

## Local verification

From `site/`:

```sh
npm run astro check
npm run build
npm run preview
```

Set the variables documented in `site/.env.example` to verify published Sanity content. Also run the build without `SANITY_PROJECT_ID` when changing the data layer, to confirm fallback behavior.

## Content publishing

Staff edit and publish in the Sanity Studio. The production website updates after Netlify completes a new static build. See `docs/EDITOR-GUIDE.md` for the staff workflow.

## Operational notes

- Production domain: `https://kom-usa.com`
- Netlify site ID: `7a28abed-6def-4bbf-86ca-aaf96e642c38`
- Repository: `gabe-mann/kom-usa-redesign`
- Netlify base directory: `site`
