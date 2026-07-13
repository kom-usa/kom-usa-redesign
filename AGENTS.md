# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single Astro static site. All application code and npm scripts live in `site/` — run every command from there (the root `netlify.toml` sets `base = "site"`, and `astro build` only works from `site/`). Node `>=22.12` is required (the VM already has a compatible Node). Dependencies are installed by the update script (`npm install` in `site/`).

Non-obvious notes for developing here:

- **No test framework.** There are no Vitest/Jest/Playwright tests and no `test`/`lint` npm scripts. The lint/type-check equivalent is `npx astro check` (type-checks + validates content schemas). CI runs it via `.github/workflows/astro-check.yml`. `astro check` currently reports 0 errors; a few deprecation/`is:inline` hints are expected and harmless.
- **Runs fully static with no secrets.** `npm run dev` (http://localhost:4321) and `npm run build` work without any environment variables. `STORYBLOK_TOKEN` and the other vars in `site/.env.example` are optional — without a token the Storyblok integration is not registered and CMS helpers return empty results; the build stays static. See `site/README.md` for CMS/preview details.
- **Service pages are under `/services/<slug>`** (e.g. `/services/locksmith`), not `/<slug>`. Static routes include `/`, `/about`, `/contact`, `/projects`, `/locations`, `/thank-you`.
- **Lead forms are Netlify Forms.** `request-call` and `request-service` POST to `/thank-you` with `data-netlify="true"`. Netlify only actually captures submissions in production; locally the POST simply serves the thank-you page (a 200), so the end-to-end funnel is still demonstrable in dev.
- **Dev server:** `site/AGENTS.md` suggests `astro dev --background` (manage with `astro dev stop/status/logs`). Plain `npm run dev` also works. HMR can occasionally break `.reveal` scroll animations — use `npm run build && npm run preview` to verify true production rendering.
