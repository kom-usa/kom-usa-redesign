# KOM USA Website

[![Astro Check](https://github.com/kom-usa/kom-usa-redesign/actions/workflows/astro-check.yml/badge.svg)](https://github.com/kom-usa/kom-usa-redesign/actions/workflows/astro-check.yml)
[![Build](https://github.com/kom-usa/kom-usa-redesign/actions/workflows/build.yml/badge.svg)](https://github.com/kom-usa/kom-usa-redesign/actions/workflows/build.yml)
[![License](https://img.shields.io/badge/license-proprietary-blue)](LICENSE)

[kom-usa.com](https://kom-usa.com)'s source: the marketing and lead-capture site for **KOM USA** (KOM Construction LLC) — locksmith, water heater, and chimney services in Metro Detroit.

The site is a lead-capture funnel: visitors share their contact info and job details, and the KOM USA team calls them back. It's built with Astro and deploys to Netlify on every push to `main`. Content management is mid-migration from Storyblok to Sanity — see [`docs/superpowers/plans/2026-07-03-storyblok-cms-integration.md`](docs/superpowers/plans/2026-07-03-storyblok-cms-integration.md) for the plan.

## Tech stack

- [Astro 7](https://astro.build) — static site generation with gated SSR preview mode
- [Tailwind CSS 4](https://tailwindcss.com) + [Starwind](https://starwind.dev) components
- [Storyblok](https://www.storyblok.com) headless CMS (services, blog, locations, FAQs, testimonials)
- [Netlify](https://www.netlify.com) — hosting, forms (`request-call`, `request-service`), and CI deploys
- [Brevo](https://www.brevo.com) — lead CRM + customer acknowledgement emails (see [`docs/brevo-netlify-forms.md`](docs/brevo-netlify-forms.md))

## Project structure

```
site/               Astro application (see site/README.md for local dev)
├── src/
│   ├── pages/       Routes
│   ├── components/  Astro/UI components
│   ├── data/         Business facts (phone, email, hours, pricing) — single source of truth
│   ├── storyblok/    CMS-driven component bindings
│   └── lib/          Storyblok data helpers
├── public/          Static assets (incl. logo-email.png for transactional email)
├── netlify/functions/  formSubmitted → Brevo sync + acknowledgement email
└── scripts/          Storyblok webhook + Brevo setup tooling

docs/                Project docs: editor guide, roadmap, migration specs
netlify.toml         Netlify build & deploy config
```

## Local development

```sh
cd site
npm install
npm run dev       # http://localhost:4321
```

Other commands (run from `site/`):

| Command | Action |
| --- | --- |
| `npm run build` | Production build to `site/dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro check` | Type-check the project |

See [`site/README.md`](site/README.md) for Astro-specific notes.

## Deployment

Netlify auto-deploys `main` to production and `preview` to a gated SSR preview environment. Content publishes in Storyblok trigger a Netlify build hook for near-instant rebuilds — see [`docs/EDITOR-GUIDE.md`](docs/EDITOR-GUIDE.md) for the non-technical publishing workflow.

## Documentation

- [`docs/EDITOR-GUIDE.md`](docs/EDITOR-GUIDE.md) — plain-English guide for staff publishing content
- `docs/superpowers/` — migration specs and implementation plans
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — dev setup and PR process for collaborators with push access

## License

All rights reserved. See [LICENSE](LICENSE). This is a private client project — see [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening an issue or PR.
