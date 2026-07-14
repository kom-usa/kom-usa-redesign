# KOM USA Website Handoff

Last updated: July 14, 2026

## Read this first

KOM USA is intentionally **not launched**. The public domain currently shows a temporary Coming Soon page while the complete Astro site continues to be developed on `main`.

Do not assume the deployment section in the root `README.md` is current. During this temporary arrangement, this handoff is the deployment source of truth.

## Current live state

| Purpose | Branch | URL | Current behavior |
| --- | --- | --- | --- |
| Public production | `coming-soon` | <https://kom-usa.com> | Branded Coming Soon page |
| Stable working-site preview | `main` | <https://main--kom-usa-redesign.netlify.app> | Complete Astro site under development |
| Pull request review | Feature branch PR | Netlify-generated `deploy-preview-*` URL | Review an individual change before merging |

Verified on July 14, 2026:

- `https://kom-usa.com` returns `200` and the Coming Soon page.
- Production sends `X-Robots-Tag: noindex, nofollow`.
- Deep production paths such as `/about/` also display the Coming Soon page, so unfinished routes are not exposed through the custom domain.
- `https://main--kom-usa-redesign.netlify.app` returns `200` and displays the complete working site.
- DNS and Google Workspace mail records were not changed.

## What was changed

A dedicated `coming-soon` branch was created from `kom-usa/main` and pushed to the official repository.

- Branch: `coming-soon`
- Commit: `fe01b64c84451060df39f89f965c63597a94683b`
- Commit title: `Add temporary KOM USA coming-soon site`
- GitHub: <https://github.com/kom-usa/kom-usa-redesign/commit/fe01b64c84451060df39f89f965c63597a94683b>

That branch changes `netlify.toml` to publish only the static `coming-soon/` directory. The directory contains:

- `index.html` — accessible Coming Soon page with Maintenance and Construction phone paths
- `styles.css` — responsive KOM USA styling using the established colors and Nunito Sans
- `project.jpg` — optimized real KOM USA project image
- `logo.svg` and `favicon.svg`
- `_redirects` — serves the placeholder for every public route
- `robots.txt` — blocks crawling during the temporary state
- `fonts/` — local font files; the page does not depend on a third-party font service

The complete Astro application was not deleted or replaced. It remains on `main` under `site/`.

## Netlify configuration

- Netlify project: `kom-usa-redesign`
- Netlify site ID: `7a28abed-6def-4bbf-86ca-aaf96e642c38`
- Connected repository: `https://github.com/kom-usa/kom-usa-redesign`
- Production branch: `coming-soon`
- Enabled branch deploy: `main` only
- Deploy Previews: enabled for pull requests against the production branch or enabled branch-deploy branches
- Auto publishing: enabled

The published Coming Soon deploy is commit `fe01b64` and was successfully processed with one redirect rule and three header rules.

## Normal coding workflow while Coming Soon is public

1. Make website changes on a feature branch or `main`, according to the requested scope.
2. Commit the changes to the official KOM USA repository.
3. For feature branches, open a pull request against `main` to receive a Netlify Deploy Preview.
4. Merge or push the accepted work to `main`.
5. Verify the stable working site at <https://main--kom-usa-redesign.netlify.app>.
6. Confirm that <https://kom-usa.com> still shows Coming Soon.

Important remote warning: this local clone has both an official `kom-usa` remote and a personal-fork `origin` remote. Before pushing, verify that the destination is:

```text
https://github.com/kom-usa/kom-usa-redesign.git
```

Do not assume `origin` is the official destination.

## Netlify credit rules

The team is on Netlify's credit-based Free plan. The owner does not want routine development to consume production-deploy credits.

- Successful production deploy: **15 credits**
- Branch deploy: **0 deploy credits**
- Deploy Preview: **0 deploy credits**
- Requests, bandwidth, and compute can still consume small amounts of credits while any Netlify URL is being served.

Billing snapshot on July 14, 2026:

- 117.6 of 300 credits remained.
- 12 prior production deploys consumed 180 credits.
- Web requests consumed 0.8 credits.
- Bandwidth consumed 1.6 credits.
- Compute consumed 0.1 credits.
- No credit card was saved to the Netlify team.
- The current allotment expires July 23, 2026.

To avoid unnecessary credits:

- Keep `coming-soon` frozen unless the public placeholder genuinely needs a change.
- Do not click **Trigger deploy** for production during ordinary development.
- Push normal site work to `main`; its branch deployment does not consume production-deploy credits.
- Do not change Netlify's production branch until launch is explicitly approved.
- Do not use Netlify Agent Runners or AI Gateway without explicit approval.

If the Free plan reaches zero credits, Netlify can pause every project on the team. There is no automatic monetary charge without a saved payment method, but the public Coming Soon page could become unavailable.

## Launch procedure

Only perform this after explicit launch approval:

1. Confirm the desired release commit is on the official `kom-usa/main` branch.
2. Verify the complete site at <https://main--kom-usa-redesign.netlify.app>, including forms, navigation, mobile layout, metadata, and critical routes.
3. In Netlify, open **Project configuration → Build & deploy → Continuous deployment → Branches and deploy contexts**.
4. Change the production branch from `coming-soon` to `main`.
5. Save the configuration.
6. Trigger one production deploy. A successful production deploy currently costs 15 credits.
7. Verify `https://kom-usa.com`, `https://www.kom-usa.com`, forms, redirects, response headers, and the production deploy commit.
8. Do not remove the `coming-soon` branch until the launch has been stable and the owner approves cleanup.

The custom domain does not need to be disconnected or reconnected during launch.

## Rollback procedure

If the launched site must be hidden again:

1. Prefer publishing the previously successful Coming Soon deploy from Netlify's deploy history when an immediate rollback is needed; Netlify documents rollbacks of an existing deploy as not consuming a new production-deploy charge.
2. Change the production branch back to `coming-soon` before additional Git-triggered production deployments occur.
3. Verify the Coming Soon page, `noindex` header, and deep-route behavior.

## DNS and email guardrail

Website hosting and authoritative DNS are deliberately separate:

- The site is hosted by Netlify.
- GoDaddy remains authoritative for `kom-usa.com` DNS.
- The apex currently points to Netlify at `75.2.60.5`.
- `www` points to `kom-usa-redesign.netlify.app`.
- Google Workspace MX records remain in the GoDaddy zone.

Do not change nameservers, MX records, or the Google Workspace mail configuration as part of website deployment work. A prior Netlify DNS change interrupted incoming email. Website branch switching requires no DNS change.

## Application architecture

- Astro 7 static marketing site in `site/`
- Sanity CMS and schemas in `studio/`
- Astro Sanity client at `site/src/lib/sanity.ts`
- Code-owned fallbacks for services and homepage FAQs
- Business facts in `site/src/data/business.ts`
- Netlify Forms for lead capture
- Brevo for contact synchronization and acknowledgement email

Maintenance phone: `248-264-3631`

Construction phone: `248-215-2634`

Email: `contact@kom-usa.com`

## Local verification

From `site/`:

```sh
npm run astro check
npm run build
npm run preview
```

When changing the content data layer, also build without `SANITY_PROJECT_ID` to confirm code-owned fallback behavior. Do not commit secrets or `.env` contents.

## Agent completion checklist

Before handing off any website change:

- Confirm the Git destination is the official `kom-usa` repository.
- Keep normal work off the `coming-soon` branch.
- Run checks proportional to the change, including `npm run astro check` and `npm run build` for site code.
- Verify the appropriate Deploy Preview or `main` branch deployment.
- Confirm `kom-usa.com` still shows Coming Soon unless launch was explicitly approved.
- Report any Netlify production deploy before triggering it because it consumes credits.
- Leave GoDaddy nameservers and Google Workspace records untouched.
