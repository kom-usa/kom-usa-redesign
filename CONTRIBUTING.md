# Contributing

This repository powers the live [kom-usa.com](https://kom-usa.com) site for KOM Construction LLC. It's a private client project, not open to public contributions — please don't open pull requests unless you've been given push access by the KOM USA team.

## For collaborators with push access

### Setup

```sh
cd site
npm install
npm run dev       # http://localhost:4321
```

Node 22.12+ is required (see `site/package.json` `engines`). Copy `site/.env.example` to `site/.env` and set the `SANITY_*` values for CMS-backed local development. Without a Sanity project ID, the build uses the code-owned fallback content.

### Before opening a PR

- `npm run astro check` — type-checks the project and validates content schemas
- `npm run build` — confirms the production build succeeds
- Test CMS changes both with Sanity configured and with the code fallback when they touch data fetching or dynamic routes

### Branches

- `main` — production, auto-deploys to kom-usa.com via Netlify
- `preview` — optional static branch deploy for content and design review before merging to `main`

### Content vs. code changes

Most content (services, articles, locations, projects, FAQs, and testimonials) is managed by staff in Sanity — see [`docs/EDITOR-GUIDE.md`](docs/EDITOR-GUIDE.md). Business contact details, form behavior, and pricing guardrails remain code-owned. Change schemas or fallback data only for structural work.
