# KOM USA — Architecture Options: Trade-Off Summary

**Prepared for:** Michael (Owner), Ovidiu (Developer)
**Date:** 2026-07-21
**Purpose:** Decide the hosting and development environment before any new client-facing features are built.

---

## Why This Decision Matters Now

Every feature on the roadmap — the client portal ("My Area"), the membership/subscription club, and the AI maintenance triage — depends on this choice. Changing environments mid-project is expensive and disruptive. Choosing now costs nothing; choosing wrong after six months of development costs a full rebuild.

Two principles drive this evaluation:

1. **Security and vendor trust** — the platform holding customer data should be a large, established company.
2. **Consolidation over cost-cutting** — Michael is willing to pay a premium for a platform that covers the full stack under one roof. The cost of stitching together multiple cheap tools shows up later as maintenance burden, security gaps between integrations, and rebuilds when a vendor shuts down or changes pricing.

---

## The Three Options

### Option 1 — Current Stack (Astro + Netlify + Sanity)
*Already documented in `my-area-plan.md`. Included here for reference only.*

**Vendor trust:** Netlify is a well-funded startup (~1,000 employees, Series D, $200M+ raised) but is not a Fortune 500 company. Sanity is smaller still. Michael has already expressed concern about this.

**Security posture:** SOC 2 Type II certified. HTTPS/TLS everywhere. But authentication for a client portal would rely on Netlify Identity, a product that has not received major investment in several years.

**Limitations for the roadmap:**
- AI triage would require routing to a third-party AI provider (added complexity, added vendor)
- Subscription/membership requires a separate payment platform — another vendor to manage
- As the site evolves from static to dynamic (client portal, AI, real-time data), Astro's "static-first" design becomes a friction point

**Best suited for:** A marketing-only site with minimal dynamic features. The current landing page phase.

---

### Option 2 — Google Ecosystem (Firebase + Google Cloud)

**What it is:** Firebase is Google's application development platform. It covers hosting, authentication, database, serverless functions, and AI — all under the Google Cloud umbrella. Firebase has been a Google product since 2014.

**Vendor trust:** Google (Alphabet) is a top-five company by market cap. Firebase infrastructure runs on the same data centers that power Google Search, Gmail, and YouTube. This is the opposite of "small random company" risk. Firebase has survived as a revenue-generating enterprise product since 2014 — unlike Google's consumer experiments, it serves paying business customers and has continued to receive investment.

**Security posture:**
- SOC 2 Type II, ISO 27001, PCI DSS Level 1, HIPAA-eligible
- Firebase Auth is built on Google Identity Platform — production-grade, the same underlying technology stack Google uses for its enterprise identity products
- All data encrypted at rest and in transit by default
- Google Cloud Armor provides DDoS protection and WAF capabilities at the infrastructure level

**What it covers for KOM USA:**

| Requirement | Google Service | Notes |
|---|---|---|
| Hosting | Firebase Hosting | CDN-backed, HTTPS automatic |
| Authentication (My Area) | Firebase Auth | Email/password, Google sign-in, MFA — production grade |
| Customer data storage | Cloud Firestore | Real-time NoSQL database |
| Serverless business logic | Cloud Functions | Node.js/TypeScript, scales to zero |
| AI maintenance triage | Gemini API / Vertex AI | Native Google AI — no third-party vendor needed |
| Email / notifications | No built-in option | Would still need Brevo, SendGrid, or similar |
| Payments (subscription club) | TBD | KOM services and KOM building materials are separate businesses — payments for the services subscription club are not yet defined |

**Trade-offs and limitations:**

*Advantages:*
- Single vendor relationship for hosting, auth, database, and AI — reduces attack surface and vendor management overhead
- Google's enterprise support tiers are real (compare this to Netlify's community forums)
- Free tier is generous; at KOM's scale, infrastructure cost is negligible
- Gemini AI is deeply integrated — building the triage feature is straightforward, not bolted on
- Real-time data sync (Firestore) supports future features like live service status, appointment updates

*Disadvantages:*
- **Vendor lock-in is real.** Firestore's data model is proprietary. If KOM ever leaves Google, migrating customer data requires significant work. Firebase Auth credentials cannot be easily exported to another system.
- **NoSQL learning curve.** The database (Firestore) is a document store, not a traditional table-based database. Complex queries (e.g., "all commercial accounts with overdue invoices") require careful data modeling up front.
- **Not the web developer's default tool.** Most Next.js / React tutorials and senior developers are more fluent in Cloudflare or Vercel than Firebase. Hiring or contracting future developers is slightly harder.
- Google has sunset many products before — though Firebase's enterprise revenue makes this low risk, it is worth naming.

**Framework flexibility:** Firebase is backend-as-a-service. The frontend can be built in any modern framework (Next.js, React, Vue). Google does not mandate Angular.

---

### Option 3 — Cloudflare + Next.js + TypeScript

**What it is:** Next.js is the most widely used React framework for production web apps (backed by Vercel). Cloudflare is the internet's largest CDN and DNS operator, with a growing application platform (Pages for hosting, Workers for serverless, D1 for database). The two are connected via the OpenNext adapter.

**Vendor trust:**
- **Cloudflare** (NYSE: NET): publicly traded, 3,500+ employees, infrastructure-grade company. Their network proxies a significant portion of global web traffic. They operate their own global data center network. Security is not a feature for Cloudflare — it is the product.
- **Next.js / Vercel**: Vercel is a well-funded startup (~$2.5B valuation). Next.js itself is open source (MIT license) — if Vercel disappeared, the framework continues. This is meaningfully different from Netlify Identity, which has no independent existence.

**Security posture:**
- Cloudflare: SOC 2 Type II, ISO 27001, PCI DSS, HIPAA-eligible. DDoS mitigation at the network layer (not an add-on — it's the baseline product)
- Authentication options: Cloudflare Access (enterprise-grade zero-trust), or Auth.js (open source), or third-party (Auth0, Clerk)
- All traffic terminates at Cloudflare's edge before reaching your application — the origin is never directly exposed

**What it covers for KOM USA:**

| Requirement | Cloudflare Service | Notes |
|---|---|---|
| Hosting | Cloudflare Pages | Global CDN, free tier for most KOM traffic volumes |
| Serverless logic | Cloudflare Workers | Runs at the edge (fastest possible response time) |
| Database | Cloudflare D1 (SQLite) | Simple, relational — good fit for customer records |
| Session / cache | Cloudflare KV | Fast key-value store for auth tokens, rate limiting |
| AI maintenance triage | Workers AI (Llama, etc.) or Gemini/OpenAI API | Cloudflare has built-in AI models; can also call external |
| Authentication | Auth.js or Cloudflare Access | Not built-in like Firebase — requires an additional choice |
| Payments (subscription club) | TBD | KOM services and KOM building materials are separate businesses — payments for the services subscription club are not yet defined |

**Trade-offs and limitations:**

*Advantages:*
- **Most portable option.** Next.js is the industry standard. D1 uses SQLite's query language and file format — if KOM ever needs to migrate off Cloudflare, the schema and data transfer cleanly. Compare this to Firestore, which has no standard export path.
- **Largest talent pool.** Any experienced React developer can work in this stack. Onboarding new developers is easiest here.
- **Security is Cloudflare's core product.** You are not buying security as a feature from a hosting company — you are hosting with a security company that also does hosting.
- **Edge-native performance.** Pages and Workers run in 300+ cities worldwide. The site loads near-instantly for any user.
- **No framework lock-in.** TypeScript + Next.js follows industry conventions; no proprietary APIs to learn.

*Disadvantages:*
- **More assembly required.** Firebase gives you auth + database + functions in one package. With Cloudflare you pick and configure each piece. More powerful, but more initial setup work.
- **Cloudflare D1 is newer.** D1 (Cloudflare's database) is a relatively young product. It works well for read-heavy workloads but lacks some advanced features of mature databases (e.g., full-text search, complex joins at scale). For KOM's current scope this is not a concern.
- **Auth is a separate decision.** Firebase Auth is battle-tested and integrated. With Cloudflare you need to choose and configure an auth provider — more flexibility, more work.
- **Cloudflare Workers edge runtime has constraints.** Server-side code runs in a restricted environment (not full Node.js). Most common packages work fine, but occasionally a package built for traditional servers needs a workaround.

---

## Head-to-Head on Michael's Priorities

| Priority | Option 1 (Astro + Netlify) | Option 2 (Google / Firebase) | Option 3 (Cloudflare + Next.js) |
|---|---|---|---|
| **Vendor trust / size** | Startup — legitimate concern | Google (Fortune 5) | Cloudflare (NYSE) + open-source Next.js |
| **Security baseline** | SOC 2, adequate for marketing | Enterprise-grade, HIPAA-eligible | Enterprise-grade, HIPAA-eligible, DDoS-native |
| **Vendor consolidation** | Low — Astro + Netlify + Sanity + third-party AI = 4+ vendors | High — hosting, auth, database, functions, AI all under Google | Medium-High — Cloudflare covers hosting, workers, database, AI; auth is a separate choice |
| **Client portal (My Area)** | Possible but limited (Netlify Identity aging) | Excellent fit (Firebase Auth) | Excellent fit (Auth.js / Cloudflare Access) |
| **AI maintenance triage** | Requires third-party AI vendor | Gemini native, tightly integrated | Workers AI built-in or any external API |
| **Long-term flexibility** | Low — tied to Netlify's static model | Medium — Google lock-in on data layer | High — open standards, portable data |
| **Developer availability** | Moderate (Astro is niche) | Moderate (Firebase is specialized) | High (Next.js is industry standard) |
| **Path to full web app** | Significant rework required | Natural evolution within Firebase | Natural evolution within Cloudflare |
| **Current team familiarity** | High (existing codebase) | Low | Medium |

---

## Cost at Scale

*Pricing sourced directly from [Firebase pricing](https://firebase.google.com/pricing), [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/), and [Cloudflare D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) as of July 2026.*

### Assumptions

- **10% monthly active rate** — residential service clients check the portal after a job, not daily
- **2 sessions/month** per active user; each session triggers ~12 DB reads (auth check + profile + 10 job history records)
- **Maintenance requests** — 10% of active users submit one per month; each triggers 2 DB writes and 1 AI triage call (~300 input / ~100 output tokens)
- Marketing site pages are CDN-cached — no per-request DB cost

### Monthly usage at each scale

| | 500 clients (now) | 5,000 clients | 50,000 clients |
|---|---|---|---|
| Active users/month | 50 | 500 | 5,000 |
| Portal sessions | 100 | 1,000 | 10,000 |
| DB reads | 1,200 | 12,000 | 120,000 |
| DB writes | 10 | 100 | 1,000 |
| Function invocations | 105 | 1,050 | 10,500 |
| AI triage calls | 5 | 50 | 500 |

### Option 2 — Firebase (Blaze pay-as-you-go)

Firebase's free tier resets daily: **50K Firestore reads/day** (≈1.5M/month), **20K writes/day** (≈600K/month), **2M Cloud Function invocations/month**, **50K Firebase Auth MAUs**.

At every scale above, usage falls entirely within those free tiers.

| | 500 clients | 5,000 clients | 50,000 clients |
|---|---|---|---|
| Firestore reads | $0 (1,200 of 1.5M free) | $0 (12K of 1.5M free) | $0 (120K of 1.5M free) |
| Firestore writes | $0 | $0 | $0 |
| Cloud Functions | $0 | $0 | $0 |
| Firebase Auth | $0 (under 50K MAU) | $0 | $0 |
| Gemini 2.5 Flash AI | $0.002 | $0.02 | $0.17 |
| **Monthly total** | **~$0** | **~$0** | **~$0.17** |

**The billing risk:** Firebase has no hard spending cap by default. The per-read cost ($0.06 per 100K) sounds trivial, but a single misconfigured real-time listener, an inefficient query that reads every document instead of filtering server-side, or a security misconfiguration that allows scraping can silently generate millions of billable reads. This is well-documented and has caught many teams off guard. Budget alerts can be set, but they notify after the fact.

### Option 3 — Cloudflare (Workers Paid plan)

Flat $5/month includes: **10M Worker requests/month**, **25 billion D1 rows read/month**, **50M D1 rows written/month**.

| | 500 clients | 5,000 clients | 50,000 clients |
|---|---|---|---|
| Workers requests | $0 (105 of 10M included) | $0 (1,050 of 10M) | $0 (10,500 of 10M) |
| D1 reads | $0 (1,200 of 25B included) | $0 | $0 |
| D1 writes | $0 (10 of 50M included) | $0 | $0 |
| Workers AI triage | ~$0 (within plan limits) | ~$0 | ~$0 |
| Base plan | $5 | $5 | $5 |
| **Monthly total** | **$5** | **$5** | **$5** |

At 50,000 clients, usage still represents less than 0.001% of Cloudflare's included limits. A billing surprise would require catastrophically broken code generating hundreds of millions of requests — which would also be obvious from monitoring before the bill arrived.

### Bottom line

**Infrastructure cost is not a meaningful differentiator at KOM's scale.** Firebase runs free; Cloudflare runs at $5/month. Neither is a budget concern.

The real cost question is **developer time** — a platform that requires specialized knowledge to build on or hire for costs far more than $5/month. The meaningful financial risk with Firebase is unpredictable billing spikes from inefficient queries. Cloudflare's flat model eliminates that risk entirely.

---

## Recommendation

**Option 1 does not meet the bar.** Four vendors stitched together (Astro, Netlify, Sanity, a third-party AI service) is exactly the fragmentation Michael wants to avoid. It made sense as a starting point, not as a long-term platform.

**If consolidation and AI integration are the top priorities:** Option 2 (Google / Firebase) wins. Hosting, auth, database, functions, and AI all live under one Google relationship. The trade-off is proprietary data lock-in — Firestore and Firebase Auth are not easily portable to another platform later.

**If long-term flexibility and developer talent availability matter more:** Option 3 (Cloudflare + Next.js) is the stronger call. Cloudflare still covers the vast majority of the stack, the code follows open standards, and any experienced React developer can work in it. Auth requires one additional choice, but that's a one-time decision. Cloudflare's security is arguably more credible than Firebase's because it is Cloudflare's founding product — not a feature of a hosting plan.

**Both Option 2 and Option 3 are premium, consolidated, enterprise-grade platforms.** The decision between them comes down to one question: do you want maximum integration (Google) or maximum portability (Cloudflare)?

---

## Suggested Next Step

Before committing to Option 2 or 3:

1. **Define the AI triage output** — what does the AI actually produce when a client submits a maintenance request? A priority score (1–5)? A category (electrical / plumbing / HVAC / general)? A suggested response time (same-day / within 48h / routine)? The answer determines whether a general-purpose model (Workers AI or Gemini API, off-the-shelf) is sufficient, or whether the model needs to be trained on KOM's historical job data (Vertex AI, significantly more complex and expensive). This is a product decision that directly changes the technical scope.

2. **Define what a club member gets** — the data model and billing integration depend entirely on the membership structure. Specifically: Is it a flat monthly fee for all members, or are there tiers (e.g., Basic / Priority / Commercial)? Does membership include a set number of service calls per year, or unlimited priority scheduling, or a discount on labor rates? The answer determines whether the database needs to track usage quotas per member (more complex, favors Firestore's flexible schema) or just a membership status flag (simple, works fine with D1).

---

*Related document: `my-area-plan.md` (portal scope and HCP findings)*
