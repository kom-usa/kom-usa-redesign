# KOM USA — Architecture Options: Trade-Off Summary

**Prepared for:** Michael (Owner), Ovidiu (Developer)
**Date:** 2026-07-22
**Purpose:** Decide the hosting and development environment before any new client-facing features are built.

---

## Why This Decision Matters Now

Every feature on the roadmap — the client portal ("My Area"), the membership/subscription club, and the AI maintenance triage — depends on this choice. Changing environments mid-project is expensive and disruptive. Choosing now costs nothing; choosing wrong after six months of development costs a full rebuild.

Two principles drive this evaluation:

1. **Security and vendor trust** — the platform holding customer data should be a large, established company.
2. **Consolidation over cost-cutting** — Michael is willing to pay a premium for a platform that covers the full stack under one roof. The cost of stitching together multiple cheap tools shows up later as maintenance burden, security gaps between integrations, and rebuilds when a vendor shuts down or changes pricing.

---

## The Options

### Option 1 — Current Stack (Astro + Netlify + Sanity)
*Already documented in `my-area-plan.md`. Included here for reference only.*

**Vendor trust:** Netlify is a well-funded startup (~1,000 employees, Series D, $200M+ raised) but is not a Fortune 500 company. Sanity is smaller still. Michael has already expressed concern about this.

**Security posture:** SOC 2 Type II certified. HTTPS/TLS everywhere. But authentication for a client portal would rely on Netlify Identity, a product that has not received major investment in several years.

**Limitations for the roadmap:**
- AI triage would require routing to a third-party AI provider (added complexity, added vendor)
- Subscription/membership requires a separate platform — **WooCommerce** (WordPress-based) is a proven option for this and has been validated on a similar project. It handles recurring billing, membership tiers, and integrates with Stripe/PayPal under the hood. Trade-off: requires running a WordPress instance, which adds WordPress as an additional vendor and attack surface to manage alongside Astro and Netlify
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
| Payments (subscription club) | Stripe via Firebase Extension | Google has no native payment processor — the official Firebase solution is the "Run Payments with Stripe" extension, which syncs subscription status to Firestore and Firebase Auth automatically |

**Trade-offs and limitations:**

*Advantages:*
- **Single vendor, one relationship.** Hosting, auth, database, serverless functions, and AI all live under one Google account, one billing statement, one support contract. This is the strongest consolidation story of any option.
- **Preferred by Michael (owner) — and aligns with his full development vision.** Michael's stated preference is to work entirely within the Google ecosystem: Google AI Studio to prototype and test the AI triage prompts, Gemini Code Assist (Google's coding assistant for VS Code) to write application code with Gemini's built-in awareness of Google Cloud and Firebase APIs, and Firebase Studio (Google's browser-based IDE with Gemini built in) as an option for development without local setup. This is a coherent, consolidated vision where the same Google account, the same AI model, and the same tooling covers every stage from development to deployment.
- **Firebase Security Rules** add a layer of access control at the database itself, not just in application code. Even if a Cloud Function has a bug, a malformed or unauthorized write can be blocked by the rules before it touches the data. This is a meaningful extra security layer that other options don't provide out of the box.
- **Firebase Extensions marketplace** provides officially Google-curated, maintained integrations for common needs — Stripe payments, SendGrid email, Twilio SMS, Algolia search. These are not third-party npm packages; they are reviewed integrations that are tested to work correctly with Firestore and Firebase Auth.
- **Firebase App Check** verifies that requests to your backend actually come from your app — not bots, scrapers, or abusers. Protects both your data and your Firestore billing.
- **Single console for everything.** Firebase Console + Google Cloud Console covers all monitoring, logging, alerting, IAM, and billing in one place. No context switching between vendor dashboards.
- **Firestore's document model fits KOM's data naturally.** A customer record has attached jobs; each job has line items, technician notes, timestamps. This is a natural document structure — not a forced fit.
- **Gemini AI is native** — building the maintenance triage feature requires no third-party AI vendor, no separate API key management, and no integration work. It is part of the same Google Cloud account.
- **Free tier is generous; at KOM's scale, infrastructure cost is negligible.** See Cost at Scale section.
- **Cloud Run as an escape hatch.** If Cloud Functions ever feel limiting, Google Cloud Run runs any containerised workload on the same billing account, same IAM, same monitoring. The exit ramp is within Google, not outside it.

*Disadvantages:*
- **Data layer lock-in is real.** Firestore's data model is proprietary — if KOM ever leaves Google, migrating Firestore data requires export and transformation work. Firebase Auth user records also require migration to a new auth provider. The frontend and Cloud Functions code (standard JS/TypeScript) move freely; it is the data and auth layers that create the dependency.
- **Firestore is less forgiving of bad data modeling than a relational database.** All databases require upfront modeling, but with a relational database you can write an ad-hoc JOIN later to compensate for a structural mistake. With Firestore, if the document structure is wrong, fixing it means migrating data — there are no joins, and querying across collections is limited. This means getting the data model right before writing code matters more here than it would with SQL.
- **Firebase is a specialised skillset.** Most JavaScript developers are more fluent in traditional SQL databases and REST APIs than in Firestore's document model and security rules. Hiring or onboarding future developers requires some Firebase-specific ramp-up.
- **Google has sunset products before** — though Firebase's enterprise revenue and 10+ year track record make this lower risk than a consumer product, it is worth acknowledging.

**Framework flexibility:** Firebase is backend-as-a-service. The frontend can be built in any modern framework (Next.js, React, Vue). Only the backend services — Firestore, Firebase Auth, and Cloud Functions — are Google-specific. The frontend code and business logic in Cloud Functions are standard JavaScript/TypeScript and move freely if the platform ever changes.

---

### Option 3 — Self-Hosted Kubernetes (k3s + Laravel or Node.js)

**What it is:** Rather than relying on a managed platform, this approach runs the entire application inside Docker containers orchestrated by k3s — a lightweight Kubernetes distribution — on Oracle Cloud's Always Free tier VMs. The application is built in Laravel (PHP) or Node.js, Cloudflare sits in front as CDN and cache, Stripe handles all subscription billing, and a full GitOps CI/CD pipeline (GitHub Actions → DockerHub → ArgoCD) automates deployments.

**Why this architecture:** The case for this option is about infrastructure ownership. Managed platforms like Firebase abstract away the server — you trade control for convenience. Kubernetes trades that convenience back for complete transparency: you own the runtime, the networking, the deployment pipeline, and secrets management. Nothing is hidden inside a vendor's black box. This is the preferred pattern in larger engineering organisations precisely because the same skills and tooling transfer across every future project, and it has been validated in production on the same stack at no infrastructure cost.

**Vendor trust:**
- **Oracle Cloud** (NYSE: ORCL): enterprise-grade infrastructure, publicly traded. The Always Free tier provides up to 4 ARM cores and 24GB RAM at no cost — real production capacity, not a trial.
- **Cloudflare** (NYSE: NET): sits in front of the self-hosted application as the CDN, cache, and DDoS mitigation layer. The origin server is never directly exposed to the internet — all traffic passes through Cloudflare's network first.
- **Stripe**: the industry standard for subscription and recurring billing. Privately held, processes hundreds of billions per year — used by Amazon, Google, and most major SaaS companies.
- **GitHub / DockerHub / Amazon SSM**: all widely adopted, enterprise-grade platforms with proven track records.

**Security posture:**
- Cloudflare sits in front of everything — the origin server is never directly exposed to the internet.
- Secrets managed via Amazon SSM Parameters Store + External Secrets Operator (ESO) — secrets are never stored in code or environment files, injected directly into Kubernetes pods at runtime.
- Kubernetes RBAC controls what each service can access internally.
- Container isolation — each component runs in its own pod with defined resource limits.
- Full control over security patches and dependency updates — nothing is managed for you by a platform without your knowledge.

**What it covers for KOM USA:**

| Requirement | Service | Notes |
|---|---|---|
| Hosting / runtime | k3s on Oracle Cloud (free) | Self-managed containers on Always Free ARM VMs |
| CDN / cache | Cloudflare (NYSE: NET) | Origin protected, global DDoS mitigation, publicly traded infrastructure company |
| Asset / file storage | Cloudflare R2 | S3-compatible object storage, no egress fees |
| Backend framework | Laravel (PHP) or Node.js | Laravel has mature packages for auth, subscriptions, REST APIs |
| Authentication | Google Auth + Microsoft Auth via Laravel Socialite | OAuth2, covers residential (Google) and commercial clients (Microsoft 365) |
| Subscription billing | Stripe via Laravel Cashier | Handles recurring billing, failed payments, invoices, trials out of the box |
| Database | PostgreSQL or MySQL (containerised) | Relational, standard SQL, fully portable |
| Secret storage | Amazon SSM Parameters Store (free tier) + ESO | Secrets injected into pods at deploy time, never in source code |
| CI/CD pipeline | GitHub Actions → DockerHub → ArgoCD | GitOps: push to repo → image built and pushed → ArgoCD auto-deploys to cluster |

**Trade-offs and limitations:**

*Advantages:*
- **Zero infrastructure cost.** Oracle Cloud Always Free tier covers enough capacity for KOM's full stack. The only ongoing costs are Stripe's transaction fees (2.9% + $0.30 per charge — standard for any payment option) and optional Cloudflare paid features.
- **No runtime vendor lock-in.** The application runs in standard Docker containers. If Oracle changes its free tier, the same containers move to any cloud provider or VPS in hours.
- **Full transparency.** Every layer is visible, auditable, and controllable. No platform hiding what happens to customer data or requests.
- **Enterprise-grade deployment pipeline.** GitOps via ArgoCD is the standard in larger engineering organisations — the skills and patterns learned here transfer directly to any future employer or client.
- **Stripe + Laravel Cashier is best-in-class for subscriptions.** Handles proration, dunning (failed payment retries), trial periods, tier upgrades, and invoicing — all the edge cases that matter for a real membership business.
- **Google + Microsoft auth** covers all client types: residential clients signing in with Google, commercial clients using Microsoft 365 accounts.

*Disadvantages:*
- **Highest operational complexity of any option.** This requires working knowledge of: Kubernetes, Docker, GitHub Actions, ArgoCD, External Secrets Operator, Amazon SSM, Cloudflare configuration, and either Laravel/PHP or a Node.js framework. Each is its own learning curve.
- **Infrastructure maintenance is your responsibility.** Certificate renewals, node failures, pod crashes, dependency CVEs — there is no support tier to call. You own the fix at any hour.
- **ARM architecture constraint.** Oracle's free tier runs on ARM (Ampere A1) processors. All Docker images must be built for ARM or multi-architecture. Some packages and base images behave differently on ARM than on standard x86 servers.
- **Single-node availability risk.** A k3s cluster on a single free VM has no high availability. A VM restart or hardware failure takes the site offline until the cluster recovers. Multi-node HA requires additional VMs.
- **Slowest path to first feature.** The entire infrastructure stack — k3s, ArgoCD, ESO, CI/CD pipeline, containerised database — must be built and validated before a single line of business logic ships. For a solo developer, this is weeks of infrastructure work before the portal or subscription club can be built.
- **Laravel is PHP.** If the current developer's background is JavaScript/TypeScript, this adds a language and framework shift on top of the infrastructure complexity.

**Who this is right for:** A developer or team with existing Kubernetes and DevOps experience building toward enterprise-scale, where infrastructure ownership and zero lock-in outweigh time-to-market. This is the architecture to grow into — not necessarily to start with.

---

## Head-to-Head on Michael's Priorities

| Priority | Option 1 (Astro + Netlify) | Option 2 (Google / Firebase) | Option 3 (k3s + Laravel) |
|---|---|---|---|
| **Vendor trust / size** | Startup — legitimate concern | Google (Fortune 5) | Oracle (NYSE) + Cloudflare (NYSE) + Stripe (private, S-1 filed 2026) |
| **Security baseline** | SOC 2, adequate for marketing | Enterprise-grade, HIPAA-eligible, App Check, Security Rules | Highest control — every layer owned; responsibility falls on the developer |
| **Vendor consolidation** | Low — 4+ vendors | High — one Google relationship | Medium — several vendors, all well-established |
| **Client portal (My Area)** | Possible but limited | Excellent (Firebase Auth + Security Rules) | Excellent (Laravel Socialite — Google + Microsoft OAuth) |
| **AI maintenance triage** | Requires third-party vendor | Gemini native — no extra vendor | Any external API (OpenAI, Gemini, etc.) via standard HTTP |
| **Long-term flexibility** | Low | Medium — data layer tied to Google | Highest — standard Docker containers, portable anywhere |
| **Who to call when it breaks** | Netlify support (community-tier only on free plan) | Google Cloud paid support — Production tier ~$100/month for 1-hour critical response, 24/7 phone | No vendor to call — developer owns every fix at any hour |
| **Data ownership** | KOM owns data; Netlify and Sanity act as processors | KOM owns data; Google acts as processor — DPA available, data stays in US region of your choice | KOM owns data; stored on your own Oracle VM — maximum ownership |
| **Backup & disaster recovery** | Managed by Netlify / Sanity | Must be explicitly configured — not automatic; point-in-time recovery available for a fee | Developer must build and maintain backup system; no managed option |
| **Cost to switch platforms** | Low — static site, limited data | 1–2 weeks at current scale (auth export + Firestore migration script) | Hours — Docker containers move to any cloud provider |
| **Developer availability** | Moderate (Astro is niche) | Moderate (Firebase is specialised) | High (Laravel and Node.js widely known) — but DevOps/Kubernetes skills required on top |
| **Path to full web app** | Significant rework required | Natural evolution within Firebase | Natural — Kubernetes scales horizontally without architecture changes |
| **Infrastructure cost** | Netlify free tier | Firebase free tier | $0 (Oracle Always Free) |
| **Time to first feature** | Fast — already partially built | Medium | Slow — full infrastructure stack must be built before any business logic ships |
| **Current team familiarity** | High (existing codebase) | Low | Low — requires Kubernetes, Docker, ArgoCD, PHP/Laravel or Node.js |

---

## Cost at Scale

*Pricing sourced directly from [Firebase pricing](https://firebase.google.com/pricing) and [Oracle Cloud Always Free tier](https://www.oracle.com/cloud/free/) as of July 2026.*

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

**The billing risk:** Firebase has no hard spending cap by default. The per-read cost ($0.06 per 100K) sounds trivial, but a single misconfigured real-time listener, an inefficient query that reads every document instead of filtering server-side, or a security misconfiguration that allows scraping can silently generate millions of billable reads. This is well-documented and has caught many teams off guard. Google Cloud budget alerts can notify when thresholds are hit, and a Cloud Function can be configured to disable billing automatically at a hard ceiling — though disabling billing suspends the entire project, so it is a last-resort safeguard rather than a routine control. Firebase App Check significantly reduces the scraping risk by blocking unauthorized clients from reaching the backend at all.

### Option 3 — k3s on Oracle Cloud

Oracle Cloud Always Free tier includes 4 ARM cores and 24GB RAM — enough to run the full application stack. No base infrastructure cost.

| | 500 clients | 5,000 clients | 50,000 clients |
|---|---|---|---|
| Oracle Cloud (k3s host) | $0 | $0 | $0 (may need paid tier at this scale) |
| Cloudflare CDN + R2 | $0 (free tier) | $0 | ~$5 |
| Amazon SSM (secrets) | $0 (free tier) | $0 | $0 |
| DockerHub | $0 (free tier) | $0 | $0 |
| Stripe transaction fees | 2.9% + $0.30/charge | 2.9% + $0.30/charge | 2.9% + $0.30/charge |
| **Monthly total** | **~$0** | **~$0** | **~$5** |

Stripe's transaction fees apply to any payment option regardless of architecture — they are not an infrastructure cost.

### Bottom line

**Infrastructure cost is not a meaningful differentiator at KOM's scale.** Firebase runs free; Option 3 runs at $0. Neither is a budget concern.

The real cost question is **developer time** — a platform that delays the first feature by weeks costs far more than any infrastructure bill. The meaningful financial risk with Firebase is unpredictable billing spikes from inefficient queries; Firebase App Check and budget alerts mitigate this. Option 3 has zero infrastructure cost but the highest setup investment before anything ships.

---

## Architectural Considerations

### Incident Response and Support

**Option 2 (Firebase):** Google Cloud support is tiered and paid. The free tier provides documentation and community forums only — no response SLA. The Production support tier ($100/month or 3% of monthly bill, whichever is higher) includes 1-hour response time for critical issues and 24/7 phone support. For a business-critical system, budget for this from day one. The infrastructure itself is managed and monitored by Google — most failures are Google's responsibility to fix, not KOM's.

**Option 3 (k3s):** No vendor support tier exists. When something breaks, the developer owns the diagnosis and fix at any hour. There is no support contract to escalate to. This is the principal operational risk of Option 3.

---

### Data Architecture and the HCP Relationship

A key architectural advantage that simplifies both options: **HCP remains the source of truth for all job history data.** The new platform does not need to import or migrate historical job records. Firebase (Option 2) or the k3s database (Option 3) stores only two things: client identity (auth) and membership status. Job history is fetched from the HCP API at request time.

This means:
- No bulk data migration from HCP when the portal launches
- Clients create new accounts on the new platform; their job history appears automatically via the HCP API
- If KOM ever leaves HCP, the job history layer is replaced by swapping one API integration — the rest of the platform is unaffected

The only data that lives permanently in the new platform is auth credentials and subscription records.

---

### Data Residency and Compliance

**Where customer data is stored:** Both options store data in the United States by default. Firebase/Google Cloud allows explicit region selection (e.g., `us-central1`). The k3s option stores data on Oracle Cloud's US-based ARM VMs.

**Compliance obligations:** KOM collects client names, addresses, and service history. A privacy policy update is required regardless of which platform is chosen — this is a legal requirement, not a technical one. For Michigan-based residential clients, CCPA applies to California residents in the client base. Google Cloud provides a Data Processing Agreement (DPA) for Firebase projects on the Blaze plan. Oracle Cloud provides equivalent agreements for enterprise use.

**Who owns the data:** In all options, KOM owns its customer data. Google and Oracle act as data processors, not owners. This should be confirmed in the signed DPA before going live.

---

### Backup and Disaster Recovery

**Option 2 (Firebase):** Firestore does NOT automatically back up data by default. Daily exports to Google Cloud Storage must be explicitly configured — this is a setup task that should happen before any client data is written. Google also offers point-in-time recovery (PITR), which allows restoring Firestore to any second within the past seven days. PITR costs extra but is strongly recommended for a production client portal. Without either of these configured, an accidental deletion is permanent.

**Option 3 (k3s):** Database backups (PostgreSQL or MySQL) are entirely the developer's responsibility. Automated backup jobs must be written and scheduled, restore procedures must be tested, and backup files must be stored off-node (Cloudflare R2 or Oracle Object Storage). This is additional infrastructure work that must be completed before going live. The upside: full control over backup frequency, retention, and restore speed.

---

### Cost of Leaving Option 2

If KOM chose Option 2 and later needed to migrate off Google, the realistic scope at KOM's scale:

- **Auth migration:** Firebase provides a bulk export of user records in JSON format with hashed passwords. Importing into a new auth provider (Auth0, Clerk, etc.) is a documented process. Some users may need to reset passwords depending on the target system. At 500–5,000 clients, this is a day or two of developer work.
- **Database migration:** Firestore exports to Google Cloud Storage in JSON format. Transforming that into a relational schema for a SQL database requires a migration script. At KOM's data volume, this is days, not months.
- **Code changes:** Cloud Functions are standard Node.js/TypeScript — they move to any serverless platform with minimal changes. The frontend is standard JavaScript — no changes needed.
- **Total realistic estimate at KOM's current scale:** 1–2 weeks of developer time. The lock-in concern is real but not catastrophic at this size. It becomes more significant as the Firestore data model grows in complexity over years.

---

## Recommendation

### In plain terms

Think of this as a build vs. buy decision.

**Option 2 (Google)** is buying a fully managed service. Google handles the infrastructure, the security updates, the scaling, and the monitoring. You pay Google — indirectly through their pricing — for that convenience. The platform works out of the box and gets KOM to market faster. The trade-off is that KOM is a tenant in Google's ecosystem. If Google raises Firebase prices, changes its terms, or discontinues a service, KOM adapts to Google's decision or rebuilds. That is not a reason to avoid Option 2 — Google has strong incentives to keep Firebase running — but it is the nature of the relationship.

**Option 3 (self-hosted)** is building and owning the infrastructure. KOM's application runs on KOM's servers (via Oracle Cloud). Nobody can raise the price. Nobody can change the terms. The platform doesn't disappear because a vendor made a business decision. The trade-off is that ownership comes with responsibility — the developer maintains the infrastructure, handles failures, and builds features that Option 2 provides out of the box. This takes longer to set up and requires more technical expertise to operate.

**For a business owner, the question is not which option is more technically elegant. It is: how much do you value independence from a vendor versus speed to market?** Option 2 gets something in front of clients sooner. Option 3 means KOM owns its platform permanently, with no single company able to disrupt it.

---

### Technical summary

**Option 1 does not meet the bar.** Even with WooCommerce added for subscriptions, it remains multiple vendors stitched together (Astro, Netlify, Sanity, WooCommerce/WordPress, a third-party AI service). It made sense as a starting point, not as a long-term platform.

**Option 2 (Google / Firebase) is the strongest choice for where KOM is right now.** It satisfies both of Michael's stated principles: Google is Fortune 5, and one vendor covers hosting, auth, database, functions, and AI under a single relationship. Michael — the owner and final decision-maker — has expressed a preference for it. Firebase Security Rules and App Check add security layers that the other options don't provide without additional tooling. The trade-off is data layer lock-in: Firestore and Firebase Auth are not easily portable if KOM ever leaves Google. The frontend and business logic code, however, remain in standard JavaScript and move freely.

**Option 3 (k3s + Laravel) is the right architecture to grow into, not to start with.** It offers the most infrastructure ownership, zero platform lock-in, and the cheapest runtime cost. The trade-off is weeks of DevOps setup before the first feature ships — and ongoing responsibility for every layer of the stack. For a team with existing Kubernetes experience this is the natural home. For a team building toward that expertise, Option 2 ships faster and grows the business while the skills develop.

**The core question:** How much time can the team invest in infrastructure before the first feature needs to ship? Option 2 minimises that time and satisfies Michael's priorities today. Option 3 is the longer-term play.

---

*Related document: `my-area-plan.md` (portal scope and HCP findings)*
