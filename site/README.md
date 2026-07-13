# site/ — KOM USA Astro app

The Astro application for [kom-usa.com](https://kom-usa.com). See the [repo root README](../README.md) for project overview, tech stack, and deployment details.

## Commands

Run from this directory (`site/`):

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro ...` | Run Astro CLI commands, e.g. `astro check` |

## Environment variables

`STORYBLOK_TOKEN` — Storyblok content API token. When unset, the build runs fully static with no CMS integration; data helpers in `src/lib/storyblok.ts` degrade to empty results. Copy `.env.example` (if present) to `.env` for local development.

## Structure

```
src/
├── pages/       Routes
├── components/  Astro/UI components
├── data/        Business facts (phone, email, hours, pricing) — single source of truth
├── layouts/     Page layouts
├── lib/         Storyblok data helpers
├── storyblok/   CMS-driven component bindings
└── middleware.ts

public/          Static assets
scripts/         Storyblok webhook + tooling
```

## Notes

- Start the dev server in background mode: `astro dev --background`. Manage it with `astro dev stop`, `astro dev status`, `astro dev logs`.
- `astro build` fetches Storyblok content at build time — if content looks stale after a CMS edit, force a clean rebuild (`rm -rf dist node_modules/.astro .astro`) or check the CDN API directly first.
