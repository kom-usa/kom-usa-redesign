# Contributing

This repository powers the live [kom-usa.com](https://kom-usa.com) site for KOM Construction LLC. It's a private client project, not open to public contributions — please don't open pull requests unless you've been given push access by the KOM USA team.

## For collaborators with push access

### Setup

```sh
cd site
npm install
npm run dev       # http://localhost:4321
```

Node 22.12+ is required (see `site/package.json` `engines`). Copy `.env.example` to `site/.env` and set `STORYBLOK_TOKEN` for CMS-backed local development — without it, the build runs fully static.

### Before opening a PR

- `npm run astro check` — type-checks the project and validates content schemas
- `npm run build` — confirms the production build succeeds
- Test the change against both static and SSR preview modes if it touches routing, middleware, or Storyblok data fetching

### Branches

- `main` — production, auto-deploys to kom-usa.com via Netlify
- `preview` — gated SSR preview environment for content and design review before merging to `main`

### Content vs. code changes

Most content (services, pricing, FAQs, testimonials) is managed by staff directly in Storyblok — see [`docs/EDITOR-GUIDE.md`](docs/EDITOR-GUIDE.md). Only touch `src/data/` or Storyblok schema/provisioning scripts for structural changes, not routine content updates.
