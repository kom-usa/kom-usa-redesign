# KOM USA — Architecture Options: Trade-Off Summary

**Prepared for:** Michael (Owner), Ovidiu (Developer)
**Date:** 2026-07-23 (updated from 2026-07-22)
**Purpose:** Decide the hosting and development environment before any new client-facing features are built.

---

## Why This Decision Matters Now

Every feature on the roadmap — the client portal ("My Area"), the membership/subscription club, and the AI maintenance triage — depends on this choice. Changing environments mid-project is expensive and disruptive. Choosing now costs nothing; choosing wrong after six months of development costs a full rebuild.

Three principles drive this evaluation:

1. **Security and vendor trust** — the platform holding customer data should be a large, established company.
2. **Consolidation over cost-cutting** — the cost of stitching together multiple cheap tools shows up later as maintenance burden, security gaps between integrations, and rebuilds when a vendor changes pricing.
3. **Portability over convenience** — the platform should never be the reason a migration takes months. The right architecture makes switching cloud providers a one-day task, not a multi-week rebuild.

---

## Why Containers — The Core Argument

Before comparing options, it helps to understand the principle behind Options 3 and 4 — and why it matters more than any individual vendor choice.

**The idea in plain terms:**

Think of the application as goods packed inside a standardised shipping container. The container holds everything the application needs to run — the code, the settings, the dependencies — sealed and labelled with a version number. Just like a physical shipping container, it can be loaded onto any ship without repacking. The container does not care which ship it is on.

- **The factory (GitHub Actions):** When a developer saves new code, the factory automatically packages it into a new, numbered container — for example, `my-website:1.3` — and sends it to the warehouse.
- **The warehouse (DockerHub):** Stores every version of the container. Version 1.0, 1.1, 1.3 are all there, ready to be deployed or restored.
- **The yard (Kubernetes):** Manages which containers are running and on which servers. It restarts containers that crash, scales up when traffic increases, and replaces old versions with new ones.
- **The reception desk (Traefik):** When a visitor arrives at `komusa.com`, Traefik reads the request and routes it to the right container — the website, the client portal, the API — without the visitor seeing any of this.
- **The automated dock worker (ArgoCD):** Watches the warehouse. When a new container version arrives, it loads it onto the yard automatically. To roll back to a previous version, you point it at `my-website:1.0` — the previous version is live in under a minute.
- **The security checkpoint (Cloudflare):** Every visitor passes through Cloudflare before reaching the yard. Bots, scrapers, and attackers are filtered out before they ever touch the application.

**Why this matters:**

With this setup, a deployment is a single version number change. A rollback is the same. And if KOM ever needs to move to a different cloud provider — because of pricing, reliability, or a business decision — the containers move with it. Nothing inside them is tied to any specific vendor.

This is the reason most mid-size and large technology companies run this way. It is also the reason integrated managed services like Firebase create long-term risk: with Firebase, the database, the auth system, and the deployment pipeline are all Google-specific. There is no equivalent of changing a version number.

---

## The Options

### Option 1 — Current Stack (Astro + Netlify + Sanity)
*Already documented in `my-area-plan.md`. Included here for reference only.*

**Vendor trust:** Netlify is a well-funded startup (~1,000 employees, Series D, $200M+ raised) but is not a Fortune 500 company. Sanity is smaller still. Vendor stability is a stated priority for this project, and neither meets that bar.

**Security posture:** SOC 2 Type II certified. HTTPS/TLS everywhere. But authentication for a client portal would rely on Netlify Identity, a product that has not received major investment in several years.

**Limitations for the roadmap:**
- AI triage would require routing to a third-party AI provider — added complexity, added vendor
- Subscription/membership requires a separate platform; WooCommerce handles recurring billing and integrates with Stripe but adds WordPress as an additional vendor and attack surface alongside Astro and Netlify
- As the site evolves from static to dynamic (client portal, AI, real-time data), Astro's static-first design becomes a friction point

**Verdict: Does not meet the bar.** Built for a marketing site. The roadmap has outgrown it.

---

### Option 2 — Google Ecosystem (Firebase + Google Cloud)

**What it is:** Firebase is Google's application development platform. It covers hosting, authentication, database, serverless functions, and AI — all under the Google Cloud umbrella.

**Vendor trust:** Google (Alphabet) is a top-five company by market cap. Firebase infrastructure runs on the same data centers as Gmail and YouTube.

**Security posture:** SOC 2 Type II, ISO 27001, PCI DSS Level 1, HIPAA-eligible. Firebase Auth, App Check, and Security Rules provide layered protection.

**What it covers for KOM USA:**

| Requirement | Google Service | Notes |
|---|---|---|
| Hosting | Firebase Hosting | CDN-backed, HTTPS automatic |
| Authentication | Firebase Auth | Email/password, Google sign-in, MFA |
| Customer data storage | Cloud Firestore | Real-time NoSQL database |
| Application backend | Cloud Functions | Runs server-side logic — Node.js/TypeScript |
| AI maintenance triage | Gemini API / Vertex AI | Native — no third-party vendor |
| Payments | Stripe via Firebase Extension | No native Google payment processor |

**Why this option is no longer recommended:**

Firebase offers real convenience, and Google is a credible vendor. The problem is not Google's stability. The problem is what happens if KOM ever needs to leave — and what happens on an ordinary bad day in production.

*Scenario 1 — A bug breaks the client portal at 2am.*

With containers: point ArgoCD at the previous version. The site is restored in under a minute.

With Firebase: redeploy the previous version of the server code (3–5 minutes). Then check whether any data written since the bad deploy is compatible with the restored code. If it is not — and with Firebase's database model, this can happen — you now have a data problem on top of a code problem. There is no equivalent of "restore the previous version."

*Scenario 2 — Google changes Firebase pricing.*

This has precedent. Google reduced Firebase's free tier limits in 2022. Earlier that year, Google Maps API pricing increased by over 1,000% for certain usage patterns, catching businesses that had no abstraction layer between themselves and Google's pricing. If Firebase pricing changes after KOM has 5,000 customer records in Firestore, the options are: absorb the new rate, or spend weeks migrating data out of a format that only Google uses.

*Scenario 3 — The team needs a new developer.*

Firebase requires specialised knowledge of its own database model, its own security rule language, and its own deployment triggers — skills that do not transfer from standard web development. Hiring is harder and onboarding takes longer. With a containerised Node.js or PHP application, any backend developer can read the code and get started.

*Scenario 4 — Google discontinues Firebase.*

Google has shut down over 270 products since 2006, including products with millions of active users: Google Reader, Google+, Stadia, Google Domains. Firebase has survived since 2014 because it generates enterprise revenue. But if it is discontinued, KOM's customer data is in a proprietary format, the auth records are in Google's systems, and the migration timeline is Google's to set — not KOM's.

*Scenario 5 — A business report that was not anticipated.*

Firebase's database cannot run certain types of queries. If the data was structured one way and the business later needs a report that requires a different structure — for example, "all jobs completed in the last 30 days across all customers" — the fix may require rewriting every record in the database. With a standard relational database (PostgreSQL or MySQL), the same need is handled by writing a different query.

**Verdict: Not recommended.** The convenience is real in the short term. The constraints compound over time.

---

### Option 3 — Self-Hosted Kubernetes on Oracle Cloud (Free Tier)

**What it is and what role it plays:**

This is the starting point — the environment where the full stack gets built, tested, and demonstrated, at no cost. Oracle Cloud offers a permanent free tier with enough server capacity to run the entire KOM application. The technology is the same as Option 4 (containers, Kubernetes, the full deployment pipeline), but it runs on a single free server rather than a managed cloud environment.

The purpose of this phase is to have something working and demonstrable before committing to a paid cloud provider. Once Michael has seen the system in action, the conversation about long-term hosting becomes a business decision — cost, preference, support — rather than a technical unknown.

**How a visitor reaches the site:**

1. A client types `komusa.com` into their browser
2. Cloudflare (the security checkpoint) receives the request, filters out any threats, and forwards it to the Oracle server
3. Traefik (the reception desk, running on the server) reads the request and routes it to the correct container — the website, the client portal, or the API
4. The container handles the request and sends the page back to the client

The client sees a website. Everything in between is invisible to them.

**Vendors involved:**

| Role | Vendor | Notes |
|---|---|---|
| Server (hosting) | Oracle Cloud (NYSE: ORCL) | Always Free tier — 4 cores, 24GB RAM, no cost |
| Security / CDN / DNS | Cloudflare (NYSE: NET) | All traffic passes through Cloudflare before reaching the server |
| Routing | Traefik | Directs traffic to the correct container; handles HTTPS certificates automatically |
| Application | Node.js or Laravel (PHP) | Standard, widely used backend frameworks |
| Login | Google OAuth + Microsoft OAuth | Clients sign in with their existing Google or Microsoft account — no new password to remember |
| Payments | Stripe | Handles recurring billing, trials, failed payment retries, invoices |
| Database | PostgreSQL or MySQL | Standard relational database — the same type used across most of the web |
| Deployment pipeline | GitHub Actions → DockerHub → ArgoCD | Code change → factory builds container → warehouse stores it → dock worker deploys it |

**Limitations at this tier:**

This is a single server. If Oracle restarts that server for maintenance, the site goes offline briefly until it recovers. This is acceptable for a demo and early stage, not for a production system with a reliability commitment. That is what Option 4 addresses.

**Verdict: The right place to build and prove the stack.** Not the permanent home.

---

### Option 4 — Managed Kubernetes (AKS or EKS) — Production

**What it is:**

The same application. The same containers. The same deployment pipeline. The difference is where the Kubernetes yard runs: instead of a single self-managed Oracle server, it runs on a professionally managed cluster operated by Microsoft (Azure Kubernetes Service — AKS) or Amazon (Elastic Kubernetes Service — EKS).

The cloud provider takes responsibility for the infrastructure: server health, software updates, availability across multiple physical locations. The development team manages the application. Neither party manages the other's domain.

**What changes moving from Option 3 to Option 4:**

Nothing in the application code changes. The containers are identical. The deployment pipeline is identical. The only change is the address the pipeline points at — one configuration field updated to the new cluster. This is the portability argument made concrete: the work done in Option 3 transfers entirely to Option 4.

**Why Azure or AWS, and not Google (GKE):**

All three providers offer managed Kubernetes and are technically equivalent for KOM's needs. The distinction is adoption: Azure and AWS account for the majority of enterprise Kubernetes deployments. The developer community, tooling ecosystem, and available talent pool are larger around both. GCP (Google Cloud) is a valid option — it is included in the pricing comparison below — but it is less commonly adopted outside organisations already running on Google infrastructure.

**Database at this tier:**

At the production stage, the database should be managed by the cloud provider rather than run as a container. A managed database (Amazon RDS or Azure Database for PostgreSQL) includes automated daily backups, point-in-time recovery, and automatic failover. The cost is predictable and the reliability is handled. A self-managed database inside a container is cheaper but requires the development team to maintain backups, patches, and recovery procedures.

| Database option | Monthly cost | Who manages backups and failover |
|---|---|---|
| Container (self-managed) | ~$0 additional | Developer |
| Amazon RDS for PostgreSQL | ~$25–50 | Amazon — automated |
| Azure Database for PostgreSQL | ~$25–50 | Microsoft — automated |

For a system holding real client data, the managed option is the right choice.

---

## Cloud Provider Comparison

Once the stack is proven on Oracle and Michael has seen it working, the only remaining decision is which cloud provider hosts it long-term. All three run the same Kubernetes technology and support the same containers — the differentiators are price, support preference, and ecosystem familiarity.

*Estimates for a small production cluster: 2-node setup, managed Kubernetes, managed PostgreSQL. Sourced from provider pricing calculators, July 2026. Exact costs depend on usage — these are representative starting points.*

| | AWS (EKS) | Azure (AKS) | GCP (GKE) |
|---|---|---|---|
| **Kubernetes management fee** | ~$73/mo | Free | Free |
| **Servers (2× small nodes)** | ~$30–60/mo | ~$30–60/mo | ~$25–50/mo |
| **Managed PostgreSQL (small)** | ~$25–50/mo | ~$25–50/mo | ~$20–45/mo |
| **Estimated monthly total** | **~$130–180/mo** | **~$55–110/mo** | **~$45–95/mo** |
| **Enterprise market share** | Largest (~32%) | Second (~22%) | Third (~12%) |
| **Basic paid support** | ~$29/mo | ~$29/mo | ~$29/mo |

**Key notes:**
- AWS costs more at this scale because it charges a management fee for Kubernetes; Azure and GCP do not
- Azure and GCP are more cost-competitive for a deployment of KOM's size
- All three providers use the same containers and deployment tooling — moving between them costs roughly one day of reconfiguration
- This decision can wait until after the demo. It is a business and cost preference, not a technical one

---

## Head-to-Head Comparison

| | Option 1 (Current Stack) | Option 2 (Firebase) | Option 3 (Oracle Free) | Option 4 (AKS, EKS, or GKE) |
|---|---|---|---|---|
| **Vendor size** | Startup | Google (Fortune 5) | Oracle (NYSE) | Microsoft or Amazon (NYSE) |
| **Security** | SOC 2, adequate for marketing | Enterprise-grade | Cloudflare in front; developer manages everything behind it | Cloud provider manages infrastructure security |
| **Portability** | Low | Very low — tied to Google's formats | High — containers move to any provider | High — same containers, one day to switch providers |
| **Rollback a bad deployment** | Full redeploy | Full redeploy, with data compatibility risk | Restore previous container version — under a minute | Restore previous container version — under a minute |
| **Client portal** | Possible but limited | Excellent | Excellent | Excellent |
| **AI triage** | Third-party vendor required | Google Gemini — native | Any AI service via standard connection | Any AI service via standard connection |
| **Availability** | Managed by Netlify | Managed by Google | Single server — no redundancy | Managed redundancy across multiple servers |
| **Support when something breaks** | Netlify community forums | Google Cloud paid support | Developer handles everything | Cloud provider paid support available |
| **Cost to switch providers** | Low — static site | Weeks of developer time | Hours | Hours |
| **Monthly infrastructure cost** | Free | Free | $0 | ~$55–180/mo depending on provider |
| **Time before first feature ships** | Fast — partially built | Medium | Slower — infrastructure built first | After Option 3 demo |

---

## Architectural Considerations

### Two Business Branches — Data Architecture

KOM USA operates two distinct lines of business, and the data architecture must treat them separately from the start.

**Services branch** (maintenance work — chimney care, lock changes, HVAC, and related): This side is managed through HCP. HCP holds all job history, scheduling, and technician records for services. The new platform does not replicate or store this data — when a client views their job history in the portal, it is fetched live from the HCP system. The new platform stores only the client's login credentials and membership status.

**Construction materials branch** (separate business line): HCP does not cover this side. The construction materials branch has its own requirements — inventory, orders, project records, quotes — that are entirely separate from the services workflow. This branch needs its own data design, independent from the HCP integration. The scope of this side needs to be defined before the database is built.

In practice, a client may have one login that gives them access to both — their service history on one side, their materials orders on the other. But the data behind each comes from a different source and must be designed separately.

### Data Residency and Compliance

Options 3 and 4 store data in the United States by default. AWS, Azure, and GCP all support explicit US region selection. Oracle Cloud's Always Free servers are US-based. Option 1 (Netlify/Sanity) also stores data in the US, but Sanity's CDN distributes content globally by default.

KOM collects client names, addresses, and service history. A privacy policy update is required regardless of which platform is chosen — this is a legal requirement, not a technical one. The chosen cloud provider's Data Processing Agreement should be signed before any client data is written.

### Backup and Disaster Recovery

**Option 3 (Oracle free tier):** Database backups are the developer's responsibility. Automated jobs must be configured to export the database on a schedule and store copies off the server. This must be in place and tested before the system goes live.

**Option 4 (managed database — RDS or Azure DB):** Automated daily backups and point-in-time recovery are included by default. No manual configuration required beyond enabling the feature.

---

## Recommendation

### The architecture direction

The recommendation is containers and Kubernetes. The portability case is straightforward: the same code moves between providers in hours, every deployment and rollback is a version number change, and the tooling used is the same standard that most mid-size and enterprise companies already run on.

Firebase's convenience is real but comes at a cost that grows over time — proprietary data formats, no clean rollback model, and specialised knowledge requirements that narrow the future developer pool.

### The two-phase approach

**Phase 1 — Build and demonstrate on Oracle (starting now)**

The full application stack — client portal, login, database, billing, deployment pipeline — gets built and validated on Oracle's free tier. The goal is a working, demonstrable system that Michael can see before any money is spent on cloud infrastructure.

This phase proves the technology, establishes the development workflow, and gives Michael something concrete to respond to.

**Phase 2 — Michael chooses the long-term cloud home**

Once the demo is done, the cloud provider decision is a business choice: which company do you want hosting KOM's data, and what does it cost? The cloud comparison table above has the numbers. The application itself does not change — only the address it runs on.

Industry experience favours AWS or Azure for long-term production use. GCP is technically equivalent and is included in the comparison. The final decision belongs to Michael.

---

## Common Questions

**Why can't we just put Firebase inside a container?**

A container holds the application — the code we write. Firebase is a service that application calls, like a phone call to a third party. You can containerise the phone; you cannot containerise the person on the other end. When the application sends data to Firebase's database or asks Firebase to authenticate a user, that data goes into Google's systems, in Google's format. The container wrapping our code does not change that. The lock-in is in where the data lives and what format it is stored in — not in how the application is packaged.

---

**Can't we just export our data from Firebase later if we ever need to leave?**

Firebase does allow data exports — but what comes out is in Firestore's own format, not a standard database format. Think of it like a filing cabinet where all the folders are labelled in a language only that cabinet manufacturer uses. You can take the files out, but before they work anywhere else, someone has to go through them and relabel everything. At KOM's current scale that is manageable — days to weeks of developer work. At a larger scale with years of customer history, it becomes a significant project. The point is not that leaving is impossible; it is that the cost and timeline of leaving is Google's to define, not ours.

---

**What if we start with Firebase now and switch to containers once we grow?**

The challenge is that switching means rebuilding, not migrating. Firebase's database structure, its authentication system, and its server functions are all designed around Firebase's model. A containerised application uses a different database type, a different auth approach, and a different deployment system. They are not the same thing in different packaging — they are fundamentally different architectures. Moving from one to the other after the fact means rebuilding the application from scratch while it is already serving real customers. Starting with containers now avoids that entirely.

---

**Doesn't Google Cloud run containers too? Can we use Google but avoid the Firebase lock-in?**

Yes — and this is an important distinction worth making. Google Cloud offers a managed Kubernetes service called GKE (Google Kubernetes Engine). Running containers on GKE is completely different from using Firebase. With GKE, the application code and data are portable — the same containers that run on Google Cloud today can move to AWS or Azure tomorrow. The lock-in risk in Firebase comes specifically from Firebase's proprietary database, auth system, and deployment model — not from using Google's servers. GKE is included in the cloud provider comparison table as a valid option for production hosting. If Michael's preference is to keep money with Google, GKE with a managed database is a reasonable choice that does not carry Firebase's constraints.

---

**We already use Google for email, Drive, and everything else. Doesn't it make sense to keep it all in one place?**

Google Workspace — Gmail, Drive, Meet, Docs — has no connection to Firebase or Google Cloud. They are entirely separate products that happen to share a brand. Choosing Kubernetes over Firebase does not affect Google Workspace at all. The team keeps using Gmail and Drive exactly as they do today. The decision here is only about where the website application and customer data are hosted — and that is a separate question from which tools the business uses day to day.

---

**What if we use Firebase for the simpler parts and containers for the more complex parts?**

Mixing the two creates a system that is harder to manage than either one alone. The application would have two different databases that need to stay in sync, two different deployment systems, and two different sets of rules for how data is secured. When something breaks, it is harder to diagnose because the problem could be in either half. The cost savings of using Firebase for "the easy parts" disappear quickly when you account for the extra complexity of keeping both halves working together. The cleaner path is one consistent approach throughout.

---

**I've never heard of Oracle for web hosting. Is it actually reliable?**

Oracle is one of the largest enterprise technology companies in the world — publicly traded on the New York Stock Exchange, with over $50 billion in annual revenue. They are best known for database software used by banks, governments, and major corporations, not consumer web hosting. The Always Free tier is a real infrastructure product, not a trial or promotional offer — it has been running since 2019 with the same terms.

The important context here is that Option 3 is not the permanent home. It is where the application gets built and proven at no cost. The servers running the demo are Oracle's; the containers running on those servers belong entirely to KOM and move anywhere. When the system transitions to production under Option 4, Oracle is no longer in the picture.

---

**Why go through Oracle at all if we're just going to move to AWS or Azure?**

Two reasons. First, it costs nothing — building on Oracle's free tier means the full application can be developed, tested, and demonstrated before a single dollar is committed to a cloud provider. Second, it proves the portability argument in practice: when the same containers move from Oracle to AWS or Azure and everything keeps working, it demonstrates that the architecture is not tied to any one vendor. The Oracle phase is not wasted work — it is the entire application, already built, ready to be pointed at a new address.

---

**What if Amazon or Microsoft raises their prices the same way Google did?**

This is the right question to ask, and the answer is in the architecture. With Firebase, a price increase means absorbing the new rate or rebuilding — because the data, auth, and deployment system are all Google-specific. With containers on AWS or Azure, a price increase means pointing the same containers at a different provider. The migration is a configuration change, not a rebuild. The leverage stays with KOM because nothing in the application is tied to Amazon's or Microsoft's proprietary formats. That is the entire point of the container approach.

---

**We're dealing with a lot of different companies here — Oracle, Cloudflare, Stripe, DockerHub. Isn't that the fragmentation you warned about?**

The warning against fragmentation was specifically about stitching together multiple vendors to cover functionality that should be handled by one — for example, adding WordPress for billing and a separate AI vendor on top of an already-fragmented current stack. The vendors in Options 3 and 4 serve distinct, non-overlapping roles: Cloudflare handles security and traffic, the cloud provider runs the servers, Stripe handles payments, DockerHub stores container images. None of them are substitutes for each other, and none of them create lock-in — every one can be swapped without touching the application code. The distinction is between vendors that own your data and vendors that provide a commodity service. Here, KOM owns all the data. The vendors are utilities, not landlords.

---

**Google is a large, trusted company. Why not build on Firebase?**

Google the company is absolutely trustworthy. The concern is specific to Firebase as a product. Google has a pattern of building excellent tools for developers and later discontinuing them when they no longer fit the business strategy — Google Reader, Google+, Stadia, Google Domains, and many others. Firebase has survived since 2014 because it generates enterprise revenue, which is a good sign. But the deeper issue is not discontinuation — it is that with Firebase, Google sets the rules: pricing, terms, and feature changes all happen on Google's timeline, not KOM's. With a containerised setup on any of the major cloud providers, KOM is never in a position where a vendor's internal decision forces a rebuild.

---

**Firebase puts everything under one roof. Isn't that simpler?**

It is simpler at the start — that is a genuine advantage worth acknowledging. The trade-off is that "everything under one roof" means everything is tied to that roof. A useful comparison: Firebase is like a fully serviced office where the building owner handles maintenance, utilities, and security. Convenient on move-in day. But the building owner also sets the lease terms, controls access, and can change both. The approach recommended here is closer to owning the building. More to set up initially, but no landlord.

The simplicity gap narrows significantly once the Kubernetes infrastructure is established. At that point, the operational overhead is comparable — and the flexibility is substantially greater.

---

**Can Gemini (Google's AI) still be used if we go with Kubernetes?**

Yes. Gemini is available as a standard web API — the application sends it a request and receives a response, exactly like any other connected service. This has nothing to do with whether the application runs on Firebase or Kubernetes. KOM can use Google's AI for the maintenance triage feature without building on Google's infrastructure platform. The two are entirely independent.

---

**If Firebase turns out to be the preferred direction, what would that look like?**

Firebase is a viable path, and if it is the chosen direction, the implementation would focus on minimising the constraints identified above:

- Write server code in standard Node.js, avoiding Firebase-specific patterns where a standard approach works equally well — this keeps more of the codebase portable if the platform ever changes
- Design the database structure carefully before any code is written — in Firebase's database model, structural mistakes require migrating the data to fix, whereas in a standard relational database they require only a different query
- Configure automated database exports from day one, before any client data is written — without this, an accidental deletion cannot be recovered
- Set budget alerts from day one — Firebase has no hard spending cap, and a misconfigured query can generate unexpected charges

The recommendation in this document favours Kubernetes for the reasons outlined. Either path can be executed well, and the final decision belongs to Michael.

---

*Related document: `docs/superpowers/specs/2026-07-13-customer-accounts-design.md` (portal scope and HCP findings)*
