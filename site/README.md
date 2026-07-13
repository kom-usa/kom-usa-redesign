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

Copy `.env.example` to `.env` and set `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_API_VERSION` for CMS-backed local development. `SANITY_API_READ_TOKEN` is only needed for a private dataset. When no project ID is set, services and FAQs use code-owned fallbacks and optional CMS collections are empty.

## Structure

```
src/
├── pages/       Routes
├── components/  Astro/UI components
├── data/        Business facts (phone, email, hours, pricing) — single source of truth
├── layouts/     Page layouts
├── lib/         Sanity data and image helpers
└── sanity/      Portable Text rendering

public/          Static assets
scripts/         Sanity seed + service integrations
```

## Notes

- Start the dev server in background mode: `astro dev --background`. Manage it with `astro dev stop`, `astro dev status`, `astro dev logs`.
- `astro build` fetches published Sanity content at build time. A Sanity publish must be followed by a Netlify rebuild before the production site changes.
