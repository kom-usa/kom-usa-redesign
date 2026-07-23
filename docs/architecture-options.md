# KOM USA — Architecture Plan

**Prepared for:** Michael (Owner), Ovidiu (Developer)
**Date:** 2026-07-23
**Purpose:** Document the agreed architecture direction and the path to production.

---

## The Direction

The platform will be built on **containers**. This decision is made. What follows in this document is how that works, why it is the right call, and what the remaining choices are.

- The application is packaged into Docker containers — portable, versioned, and runnable on any major cloud provider
- A Kubernetes cluster manages those containers in production — handling availability, scaling, and deployments
- A standard PostgreSQL database stores customer data — the same format used across most of the web, exportable anywhere
- Oracle Cloud's free tier is the starting environment — the full stack gets built and proven at zero cost before any cloud provider is paid

**The only open question is which cloud provider hosts the production environment.** Google Cloud (GKE) is the current preference and is the focus of Phase 2. AWS and Azure are equally capable alternatives covered in the provider comparison below. The architecture is identical regardless of which is chosen — same containers, same pipeline, same database format.

**A note on Firebase:** Firebase and Google Cloud are two different products from the same company. Firebase is ruled out. Using Google Cloud with containers is a completely different path with none of Firebase's constraints. This distinction is explained further below.

---

## How It Works — Plain Language

Think of the application as goods packed inside a standardised shipping container. The container holds everything needed to run — code, settings, dependencies — sealed and labelled with a version number. It can be loaded onto any server without repacking.

- **The factory (GitHub Actions):** When code is updated, the factory automatically packages it into a new numbered container — `my-website:1.3` — and sends it to the warehouse
- **The warehouse (DockerHub):** Stores every version. Version 1.0, 1.1, 1.3 are all there, ready to deploy or restore
- **The yard (Kubernetes / GKE):** Manages which containers are running. Restarts them if they crash, scales up under load, replaces old versions with new ones
- **The reception desk (Traefik):** When a visitor arrives at `komusa.com`, Traefik reads the request and routes it to the right container — website, client portal, API — invisibly
- **The dock worker (ArgoCD):** Watches the warehouse. When a new container version arrives, it deploys automatically. To roll back: point it at the previous version. Live in under a minute
- **The security checkpoint (Cloudflare):** All traffic passes through Cloudflare before reaching the yard. Bots and attackers are filtered before they touch the application

---

## What Was Ruled Out and Why

### Option 1 — Current Stack (Astro + Netlify + Sanity)

Built for a marketing site. As the roadmap adds a client portal, membership billing, and AI triage, this stack requires bolting on additional vendors for each feature. It was the right starting point, not the long-term platform.

### Option 2 — Firebase

Firebase is Google's bundled product suite: Firestore (proprietary database), Firebase Auth, and Cloud Functions. It was evaluated and ruled out for three reasons:

1. **No rollback model.** A broken deployment cannot be restored to a previous version the way a container can. Rolling back means redeploying old code and hoping the data written since is still compatible.
2. **Proprietary database.** Firestore's format is Google-specific. Migrating out requires custom transformation work — it is not a standard SQL export.
3. **Specialist skillset.** Firebase requires knowledge that does not transfer from standard web development, narrowing the future developer pool.

This decision is final. The rest of this document covers the chosen path.

---

## The Architecture

### Phase 1 — Build on Oracle Cloud (Free Tier)

Oracle Cloud's Always Free tier provides server capacity at no cost — currently 2 OCPU cores and 12GB RAM for new accounts (reduced from 4 OCPU / 24GB in early 2026; verify current allocation on sign-up). This is enough to run the full application stack for development and demonstration purposes.

The technology used here is identical to Phase 2. The same containers, the same deployment pipeline, the same database structure. The only difference is the server it runs on. When Phase 2 begins, the containers move to Google Cloud. Nothing inside them changes.

**How a visitor reaches the site during Phase 1:**

1. Client visits `komusa.com`
2. Cloudflare receives the request, filters threats, forwards to the Oracle server
3. Traefik routes the request to the correct container
4. The container responds — the client sees the website

**What runs on the Oracle server:**

| Component | Technology | Notes |
|---|---|---|
| Container management | k3s (lightweight Kubernetes) | Same model as Google Cloud's GKE — different scale |
| Traffic routing | Traefik | Routes visitors to the correct container, handles HTTPS automatically |
| Application | Node.js | Standard backend — any developer can read and work with it |
| Login | Google OAuth via Passport.js | Standard library in the Node.js container — clients sign in with their Google account |
| Payments | Stripe | Recurring billing, trials, invoices, failed payment handling |
| Database | PostgreSQL (containerised) | Standard SQL — same format used in Phase 2 |
| Deployment pipeline | GitHub Actions → DockerHub → ArgoCD | Code update → container built → deployed automatically |
| CDN / security | Cloudflare | In front of everything throughout both phases |

**Limitation:** Oracle's free tier is a single server. If it restarts, the site is briefly offline. This is acceptable for building and demonstrating the system. It is not the production setup.

---

### Phase 2 — Production on Google Cloud (or AWS / Azure)

Once the system is built and demonstrated on Oracle, it moves to a managed cloud provider for production. Google Cloud is the current preference. The cloud provider manages the infrastructure — server health, availability across multiple locations, automatic updates. The development team manages the application.

**What moves from Phase 1 to Phase 2:**

| What | Change |
|---|---|
| Application code | None — identical containers |
| Deployment pipeline | One field updated: cluster address points to the new provider |
| Database | Migrated from containerised PostgreSQL to the provider's managed database — same schema, same queries |
| Cloudflare | DNS record updated to point to the new provider — no other changes |
| Login / payments | None — Google OAuth and Stripe are external services, unaffected |

The migration is a configuration change, not a rebuild.

---

#### How Containerisation Works on Google Cloud

This is the full picture of how the container approach runs specifically on Google's infrastructure.

**Google Kubernetes Engine (GKE)** is the managed Kubernetes cluster — the yard that runs and manages the containers. Google provisions the servers, keeps them healthy, handles failures, and scales capacity up or down automatically. The development team tells GKE what to run; Google handles the fact that it keeps running.

**Google Artifact Registry** is Google's container warehouse — the equivalent of DockerHub but integrated directly into the Google Cloud account. When GitHub Actions builds a new container image, it can push it directly to Artifact Registry. ArgoCD then pulls from Artifact Registry and deploys to GKE. Everything stays within Google's network — faster, more secure, no external warehouse.

**Cloud SQL** is Google's managed PostgreSQL database. It is not a Google-specific format — it is standard PostgreSQL, the same database that runs on the Oracle server in Phase 1. The data moves with a standard SQL export and import. Cloud SQL handles automated backups, point-in-time recovery, and failover without any manual configuration.

**The full flow on Google Cloud:**

```
Developer pushes code to GitHub
        ↓
GitHub Actions builds a new container image (e.g. my-website:1.4)
        ↓
Image pushed to Google Artifact Registry
        ↓
ArgoCD detects the new image, deploys it to GKE
        ↓
GKE replaces the running container with the new version
        ↓
Cloudflare routes visitors to the updated application
        ↓
Application reads/writes data in Cloud SQL
```

If version 1.4 has a bug: ArgoCD points back to `my-website:1.3`. Previous version is live in under a minute. Cloud SQL data is unaffected.

**Everything under one Google account:**

One of the practical advantages of running on Google Cloud specifically is that GKE, Artifact Registry, Cloud SQL, Gemini (for AI triage), and Google OAuth all live under the same Google Cloud account — one billing statement, one IAM (access control) system, one set of logs and monitoring dashboards. This is the consolidation argument that was originally attractive about Firebase, achieved without any of Firebase's constraints.

**Production stack on Google Cloud:**

| Component | Google Cloud Service | Notes |
|---|---|---|
| Container management | GKE (Google Kubernetes Engine) | Google manages server health, scaling, availability |
| Container registry | Google Artifact Registry | Stores container images — integrated with GKE |
| Database | Cloud SQL (PostgreSQL) | Google manages backups, recovery, failover |
| Traffic routing | Traefik (inside GKE) | No change from Phase 1 |
| Application | Node.js containers | No change from Phase 1 |
| Login | Google OAuth via Passport.js (in container) | Standard library in the Node.js container — no Firebase Auth, no separate service |
| AI triage | Gemini API | Google's AI — same account, no extra vendor |
| Payments | Stripe | No change |
| CDN / security | Cloudflare | No change throughout both phases |
| Monitoring / logs | Google Cloud Logging + Monitoring | Built into the Google Cloud account |

---

## What Lives Where — Google vs. External

Every component in this system falls into one of three categories. Understanding this breakdown is the clearest way to see what the Google relationship actually covers, and what falls outside it.

---

### Category 1 — Google Cloud (all under one Google account)

These are Google's own managed services. They live in the Google Cloud console, appear on one Google billing statement, and are operated and maintained by Google.

| Component | Google Service | What it does |
|---|---|---|
| Container cluster | GKE (Google Kubernetes Engine) | Runs and manages all the application containers — Google handles server health, scaling, and availability |
| Container storage | Google Artifact Registry | Stores every version of the application container — integrated directly with GKE |
| Database | Cloud SQL (PostgreSQL) | Stores customer accounts, membership status, and construction materials data — Google handles backups, recovery, and failover |
| AI triage | Gemini API | Powers the maintenance triage feature — same Google account, no separate vendor |
| Monitoring & logs | Google Cloud Logging + Monitoring | Tracks errors, performance, and system health — built into the Google Cloud account |

**This is the core of the Google relationship.** Everything in this category is managed by Google, billed by Google, and supported by Google.

---

### Category 2 — External Services (non-negotiable, no Google equivalent)

These components are not Google products and cannot be replaced by anything in the Google Cloud catalogue. They are external by necessity, not by choice.

| Component | Service | Why it's external |
|---|---|---|
| Payment processing | Stripe | Google has no payment processor. Stripe handles all recurring billing, subscription tiers, failed payment retries, invoices, and trials. Non-negotiable for any payment architecture. |
| Job history | QuickBooks | Job history and financial records live in QuickBooks — the source of truth for all service data. The platform fetches this via the QuickBooks API at request time. HCP is a current operational tool whose role may reduce or be eliminated as the new platform matures. |
| Client login (Microsoft) | Microsoft OAuth | **Optional.** Only relevant if KOM has commercial clients who sign in with Microsoft 365 accounts. If the client base is residential, everyone logs in with Google and this is unnecessary. Add it only when there is a concrete need. |

---

### Category 3 — Open-Source Tools (run on Google's infrastructure, no vendor dependency)

These are not Google products. They are open-source tools that run as containers inside the GKE cluster — on Google's servers, but with no tie to Google. They would run identically on AWS or Azure if the cloud provider ever changes.

| Component | Tool | What it does |
|---|---|---|
| Traffic routing | Traefik | Receives incoming requests and directs them to the correct container — website, client portal, API. Also handles HTTPS certificates automatically. |
| Deployment automation | ArgoCD | Watches the container registry. When a new version is pushed, it deploys to GKE automatically. Rollback is pointing it at a previous version. |
| Application runtime | Node.js | The application itself runs inside a Node.js container. Standard, widely used — any developer can read and work with it. |
| Client login | Google OAuth (via Passport.js) | Clients sign in with their Google account. This is standard OAuth2 code running inside the Node.js container — a library call to Google's public login API. It is not Firebase Auth and requires no special Google Cloud service. A Google API key is registered once in the Google developer console; the login logic lives entirely in the application container. |

These tools add no lock-in. Removing any of them is straightforward, and replacing them with alternatives is a configuration change, not a rebuild.

---

### Category 4 — Infrastructure Tools (external by convention, Google alternatives exist)

These are external services that are industry-standard choices, but Google has its own equivalents. Either path works.

| Component | Current choice | Google alternative | Recommendation |
|---|---|---|---|
| CDN / security checkpoint | Cloudflare | Google Cloud Armor + Cloud CDN | Cloudflare — free tier is excellent, and having it sit independently in front of Google Cloud adds a security layer that doesn't depend on Google being operational |
| CI pipeline (build automation) | GitHub Actions | Google Cloud Build | GitHub Actions — industry standard, already where the code lives |
| Code repository | GitHub | Google Cloud Source Repositories | GitHub — industry standard |

None of these are wrong answers. If the preference is to keep everything within Google's ecosystem, Cloud Build and Cloud Armor are legitimate replacements. The recommendation for Cloudflare and GitHub is practical, not technical.

---

### Summary

| | Google account | External (no alternative) | Open-source on Google | External by convention |
|---|---|---|---|---|
| **Examples** | GKE, Cloud SQL, Gemini, Artifact Registry | Stripe, Microsoft OAuth, QuickBooks | Traefik, ArgoCD, Node.js | Cloudflare, GitHub |
| **Who operates it** | Google | Third-party vendor | Development team | Third-party vendor |
| **Replaceable?** | Yes — same containers move to AWS/Azure | No — these fill needs Google doesn't cover | Yes — open source, swap freely | Yes — Google alternatives exist |
| **Lock-in risk** | Low — standard containers and SQL | None — these are already integrations, not the platform | None | None |

---

## Choosing a Cloud Provider

All three major providers — Google Cloud, AWS, and Azure — run the same Kubernetes technology and support the same containers. The application code, the deployment pipeline, and the database format are identical on all three. The choice is a business decision: which company do you want to have a relationship with, and what does it cost?

**Google Cloud is the current preference** given the direction of this project. The relevant services are GKE (Kubernetes) and Cloud SQL (managed PostgreSQL). Importantly, this has nothing to do with Firebase — GKE and Cloud SQL are standalone infrastructure products, not part of Firebase's integrated platform. Using Google Cloud here means Google's servers, Google's reliability guarantees, and Google's support — without any of the Firebase lock-in.

*Estimates for a small production cluster: 2-node Kubernetes setup, managed PostgreSQL. Sourced from provider pricing calculators, July 2026.*

| | Google Cloud (GKE + Cloud SQL) | Azure (AKS + Azure DB) | AWS (EKS + RDS) |
|---|---|---|---|
| **Kubernetes management fee** | Free | Free | ~$73/mo |
| **Servers (2× small nodes)** | ~$25–50/mo | ~$30–60/mo | ~$30–60/mo |
| **Managed PostgreSQL** | ~$20–45/mo | ~$25–50/mo | ~$25–50/mo |
| **Estimated monthly total** | **~$45–95/mo** | **~$55–110/mo** | **~$130–180/mo** |
| **Enterprise market share** | Third (~12%) | Second (~22%) | Largest (~32%) |
| **Basic paid support** | ~$29/mo | ~$29/mo | ~$29/mo |
| **Stripe transaction fees** | 2.9% + $0.30/charge | 2.9% + $0.30/charge | 2.9% + $0.30/charge |

**Key points:**
- Google Cloud is the most cost-competitive of the three at KOM's scale — no Kubernetes management fee and the lowest compute costs
- AWS has the largest market share and talent pool but costs more at small scale due to its per-cluster fee
- Azure sits in the middle on both price and adoption
- Stripe fees apply regardless of provider — they are not an infrastructure cost
- Switching between providers after launch costs approximately one day of reconfiguration — the containers move, nothing is rebuilt

---

## Data Architecture — Two Business Branches

KOM USA operates two distinct lines of business. The database must treat them separately from the start.

**Services branch** (maintenance work — chimney care, lock changes, HVAC, and related): Job history and financial records are stored in QuickBooks, which is the source of truth for all service data. The platform fetches this via the QuickBooks API at request time — it does not store or replicate job records. The platform stores only client login credentials and membership status for this branch. HCP is a current operational tool; its role may reduce or be eliminated as the new platform matures and takes on more of the workflow.

**Construction materials branch** (separate business line): Inventory, orders, quotes, and project records for the materials branch need their own data model within Cloud SQL, designed independently. The scope of this side must be defined before the database schema is built.

A client may have one login giving access to both branches — service history on one side, materials orders on the other. The data behind each comes from a different source and must be designed separately.

---

## Common Questions

**Why Google OAuth, and when would Microsoft OAuth be added?**

Google OAuth is the right choice for KOM's client base. The distinction comes down to who the client is.

Residential clients (homeowners calling about chimney care, lock changes, HVAC) use personal email. The majority are on Gmail or have a Google account tied to their phone. Google sign-in for them is one click — they are already logged into Google on their device.

Commercial clients — contractors, property managers, office buildings, businesses — often run on Microsoft 365. Their company email is `@theircompany.com` managed through Outlook, and their IT departments typically want employees signing into external systems with their work account, not a personal Google account.

Microsoft OAuth becomes relevant when the commercial side of the business grows — specifically the construction materials branch, which is more likely to serve contractors and property managers than individual homeowners. It is not a day-one requirement. Adding it later is straightforward: it follows the same pattern in the same container, and results in a second login option on the page alongside Google. Build it when there is a concrete commercial client segment that needs it.

---

**Firebase was discussed earlier — how is using Google Cloud different?**

Firebase and Google Cloud are two products from the same company that share almost nothing in common. Firebase is a bundled toolkit with its own proprietary database, its own authentication system, and its own deployment model — all tightly coupled to Google's platform. Google Cloud is raw infrastructure: servers, networking, and managed services that you use on your own terms with your own stack. GKE is just Google's version of Kubernetes — it runs the same standard containers as AWS or Azure. Cloud SQL is just Google's managed PostgreSQL — the same standard database format. None of the Firebase constraints apply here.

---

**If we go with Google Cloud now, are we locked in the same way?**

No. The lock-in concern with Firebase came from its proprietary database format and non-container deployment model. With GKE and Cloud SQL, the data is standard PostgreSQL — exportable as plain SQL files — and the application runs in standard containers. If Google Cloud's pricing or terms ever become unfavorable, the same containers and the same database schema move to AWS or Azure. That migration takes roughly one day, not weeks. The architecture is designed so that the cloud provider is interchangeable from day one.

---

**Why Google Cloud over AWS or Azure?**

At KOM's scale, Google Cloud is the most cost-competitive of the three — no per-cluster Kubernetes management fee and slightly lower compute costs. If there is already a preference for working within the Google ecosystem, it also means a single vendor relationship covering the AI feature (Gemini), the infrastructure (GKE), and the database (Cloud SQL). AWS and Azure are equally valid technically — the difference is price, support preference, and business relationship. All three are covered in the comparison table above.

---

**Why Oracle first if we're going to Google Cloud anyway?**

Oracle's free tier lets the entire application get built, tested, and demonstrated before committing to a paid cloud provider. The containers built on Oracle are identical to the ones that run on Google Cloud — nothing is rebuilt or rewritten when the move happens. It is a free proving ground, not a detour.

**Is Oracle reliable enough for this?**

Oracle is one of the largest enterprise technology companies in the world — over $50 billion in annual revenue, publicly traded. Their cloud infrastructure is used by large enterprises globally. The free tier has been running with the same terms since 2019. That said, Phase 1 runs on a single server with no redundancy — appropriate for building and demonstrating, not for a production commitment. That is exactly why Phase 2 moves to Google Cloud.

**What if Google raises prices down the line?**

The containers running on GKE are standard Docker containers. If Google's pricing ever becomes unfavorable, the same containers move to AWS or Azure — the migration is a configuration change, not a rebuild. This is the fundamental difference from Firebase: with Firebase, a price change forces a rebuild because the data and architecture are Google-specific. With GKE and Cloud SQL, the data exports as standard SQL and the containers run anywhere.

**We already use Gmail and Drive — does this connect to those?**

Google Workspace (Gmail, Drive, Meet, Docs) and Google Cloud (GKE, Cloud SQL) share a brand but are separate products. The team continues using Workspace exactly as today. The only connection is that clients can sign in to the portal with their existing Google account — which works with or without any particular cloud provider.

**Can we still use Google's AI (Gemini) for the maintenance triage feature?**

Yes. Gemini is a standard web API — the application sends it a request and receives a response over HTTPS, like any other connected service. It is independent of which cloud provider the application runs on. Using Gemini does not require Firebase or any specific Google Cloud product.

---

*Related document: `docs/superpowers/specs/2026-07-13-customer-accounts-design.md` (portal scope and QuickBooks/HCP findings)*
