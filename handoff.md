# Handoff — KOM USA site (2026-07-03)

## Goal

Two workstreams, both implementation-complete:

1. **DONE — Lead-capture redesign.** Site rebuilt as a "share info → we call you" funnel (Mr. Handyman-style layout, KOM design system), 3 residential services only (locksmith, water heaters, chimney care), published pricing, $10-off coupon wired to a hidden form field, real Google reviews (4.7★/58). Merged to `main`, pushed, live at https://kom-usa-redesign.netlify.app via verified GitHub→Netlify auto-deploy. Netlify Forms `request-call` + `request-service` registered and collecting.
2. **DONE (branch, pre-merge) — Storyblok CMS integration.** Non-technical staff can now publish articles, service content, location pages, projects, FAQs, and testimonials without touching code. Spec: `docs/superpowers/specs/2026-07-03-storyblok-cms-design.md`. Implementation plan: `docs/superpowers/plans/2026-07-03-storyblok-cms-integration.md`. All 10 plan tasks implemented on branch `feat/storyblok-cms`; task briefs/reports in `.superpowers/sdd/task-1-brief.md` … `task-10-brief.md` (+ matching `-report.md` files).

## Current state

- Branch: `feat/storyblok-cms`, ready for merge to `main`. Task 10 (final task — publish pipeline, editor guide, verification) is complete.
- Stack: Astro 7 static + gated SSR preview mode, Tailwind v4, Starwind, in `site/`. `@storyblok/astro@10` installed and wired.
- Storyblok space (`KOM-USA`) is seeded: 3 services, 7 FAQs, 1 published blog article (`blog/welcome-to-the-new-kom-usa-site`), 1 draft location (`locations/warren`) used as the staff worked example.
- Publish pipeline is live: Storyblok webhook "Netlify production rebuild" (fires on `story.published`/`unpublished`/`deleted`/`moved`) → Netlify build hook "storyblok-publish" (branch `main`, id `6a47eed6f4cfc5f6ff50ff84`) → new production deploy. Verified end-to-end on 2026-07-03: publish at 17:20:09Z triggered a deploy at 17:20:20Z that reached `ready` at 17:20:50Z (17s build). Content-parity check against production `/blog/` is expected to 404 until this branch merges to `main` (deferred; content parity already verified locally against `astro preview` and directly against the Storyblok CDN API).
- Staff-facing docs: `docs/EDITOR-GUIDE.md` — plain-English guide covering login, the six content sections, writing/publishing a blog post, editing prices, building a location page from the Warren draft, adding FAQs/testimonials/projects, the preview screen, what's locked (phone/email/hours/$10 offer), and who to contact.
- All business facts still flow from `site/src/data/business.ts`. Offer string is defined in `site/src/data/offer-client.ts` and imported by business.ts. These remain code-only (not CMS-editable) by design.
- Dev/preview servers: `.claude/launch.json` → `kom-usa-site` (astro dev :4321), `kom-usa-preview` (astro preview :4330).
- Pre-existing working-tree items not part of CMS work, still unresolved — do not touch without asking: uncommitted deletion of `locksmith-prices.jpeg`, untracked `docs/kom-usa-website-granular-tasks.tsv`, untracked `Before & After Photos/`.

## Files in flight

None from the CMS branch — Task 10 work (`site/scripts/storyblok-webhook.mjs`, `docs/EDITOR-GUIDE.md`) is committed. Remaining work is the post-merge checklist below (owned by the finishing skill / controller, not a subagent).

## Failed attempts / gotchas (so you don't re-lose this time)

- **Astro dev server HMR can leave `.reveal` animations broken** (elements stuck at opacity 0 with `.in` applied, observer never re-runs). Not a code bug — always confirm rendering issues against `npx astro preview` (production build) before "fixing" anything.
- **`npx astro build` only works from `site/`** — the Bash tool resets cwd between calls; always `cd /…/kom-usa-redesign/site` explicitly.
- **`curl` to localhost can silently fail as "command not found" in the sandboxed shell** — use `node -e "fetch(...)"` instead when checking local preview server routes.
- **A stale local build can look like a CMS-content bug** — `astro build` fetches Storyblok content at build time; if you edit content via the Management API and then build, force a clean rebuild (`rm -rf dist node_modules/.astro .astro`) before trusting the output, or check the CDN API directly first.
- Netlify site ID `7a28abed-6def-4bbf-86ca-aaf96e642c38`; repo `gabe-mann/kom-usa-redesign`; site already linked with base=`site`, branch `main` — do not re-run `netlify init`.

## Next step (post-merge checklist)

1. Merge `feat/storyblok-cms` → `main`, push (production deploys and goes CMS-live).
2. Fast-forward `preview` branch to `main`, push (preview branch redeploys with identical code in SSR mode).
3. Owner setup: `PREVIEW_ACCESS_KEY` env var in Netlify branch-deploy context; Storyblok Visual Editor default location; add first real staff account or share login.
4. Re-run the Task 10 Step 3 end-to-end publish check against production (was deferred pre-merge — deploy pipeline itself is already verified working).
5. Update memory (`kom-usa-project.md`): CMS live, schemas scripted, editor guide location.

Owner context: Gabe is tech-savvy (talk normally, no metaphors); plain-English writing is reserved for staff-facing docs like the editor guide. Persistent memory lives at `~/.claude/projects/-Users-gabrielmann-Documents-ClaudeCode-kom-usa-redesign/memory/`.
