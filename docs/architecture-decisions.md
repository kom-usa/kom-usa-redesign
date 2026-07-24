# KOM USA — Architecture Decisions

**Prepared for:** Michael (Owner)
**Prepared by:** Ovidiu (Developer)
**Date:** 2026-07-24
**Purpose:** Record of agreed architecture decisions and the path to production.

---

## Decisions Made

These are not options — they are the choices agreed on.

| Decision | What's decided |
|---|---|
| Application packaging | Docker containers — versioned, portable, runnable on any provider |
| Container orchestration (Phase 2) | Google Kubernetes Engine (GKE) |
| Phase 1 environment | Oracle Cloud free tier — build and prove the system at zero cost |
| Phase 2 database | Azure Database for PostgreSQL |
| Authentication (primary) | Google OAuth — clients sign in with their Google account |
| Authentication (secondary) | Microsoft OAuth — for commercial clients on Microsoft 365 |
| Payment processing | QuickBooks Payments — already in use, PCI compliant, no new vendor or compliance scope |
| Job history (services branch) | HCP (Housecall Pro) — most complete source of service records |
| CDN / security | Cloudflare — origin-agnostic, 300+ edge locations worldwide |
| CI/CD pipeline | GitHub Actions — universal, deploys to any cloud provider |
| Container registry | DockerHub — cloud-agnostic, no cloud-specific authentication |
| Code repository | GitHub — stays as is |
| Traffic routing | GKE Gateway (Google Cloud Load Balancer) — standard for managed Kubernetes |
| Secrets management | Google Secret Manager — stores API keys, database passwords, and OAuth credentials securely (Phase 2 only) |
| AI triage | Gemini API — under the same Google account |

**Secrets management:** Google Secret Manager stores API keys, database passwords, and OAuth credentials securely. Credentials are never written in plain text or stored in the codebase.

**Delivery tools (CI/CD, registry, CDN):** Kept off Google to avoid a single point of failure. A Google outage affects the cluster — it should not also disable the tools used to respond to it.

**Billing:** Phase 2 cost is **$100–300/month** (cluster, load balancer, database, supporting services). GitHub Actions, DockerHub, and Cloudflare are free or minimal cost. Google and Azure both offer committed use savings plans — 1–3 years in advance reduces costs by up to 70%.

---

## What Was Ruled Out

### Option 1 — Current Stack (Astro + Netlify + Sanity)

Built for a marketing site. As the roadmap adds a client portal, membership billing, and AI triage, this stack requires bolting on additional vendors for each feature. It was the right starting point, not the long-term platform.

### Option 2 — Firebase

Firebase is Google's bundled product suite: Firestore (proprietary database), Firebase Auth, and Cloud Functions. Ruled out for three reasons:

1. **No rollback model.** A broken deployment cannot be restored to a previous version the way a container can. Rolling back means redeploying old code and hoping the data written since is still compatible.
2. **Proprietary database.** Firestore's format is Google-specific. Migrating out requires custom transformation work — it is not a standard SQL export.
3. **Specialist skillset.** Firebase requires knowledge that does not transfer from standard web development, narrowing the future developer pool.

**Note:** Firebase and Google Cloud are two different products from the same company. GKE + Gemini is Google Cloud without any Firebase constraints.

---

## The Architecture

### Phase 1 — Build on Oracle Cloud (Free Tier)

Oracle Cloud's Always Free tier (currently 2 OCPU cores and 12GB RAM — verify current allocation on sign-up) is sufficient to build and validate the full system at zero cost. The same containers, pipeline, and database structure are used in Phase 2 — nothing inside the containers changes when the system moves to GKE.

**What runs on the Oracle server:**

| Component | Technology | Notes |
|---|---|---|
| Container management | k3s (lightweight Kubernetes) | Same model as GKE — different scale |
| Traffic routing | Traefik | Routes visitors to the correct container, handles HTTPS automatically |
| Application | Node.js | Standard backend |
| Login (primary) | Google OAuth via Passport.js | Clients sign in with their Google account |
| Login (secondary) | Microsoft OAuth via Passport.js | For commercial clients on Microsoft 365 |
| Payments | QuickBooks Payments | Recurring billing via QuickBooks API — already in use |
| Database | PostgreSQL (containerized) | Standard SQL — same format used in Phase 2 |
| Build pipeline | GitHub Actions → DockerHub → Oracle (k3s) | Code push → container built → deployed automatically |

**Limitation:** Oracle's free tier is a single server. If it restarts, the site is briefly offline. Acceptable for building and demonstrating the system. Not the production setup.

---

### Phase 2 — Production on Google Cloud (GKE) + Azure Database

Google Cloud runs the container cluster and monitoring. GitHub Actions runs the CI/CD pipeline. Cloudflare handles security and CDN. Azure handles the database.

**What changes from Phase 1 to Phase 2:**

| What | Change |
|---|---|
| Application code | None — identical containers |
| Build pipeline | Same GitHub Actions setup, cluster address updated to GKE |
| Database | Migrated from containerized PostgreSQL to Azure Database for PostgreSQL — same schema, same queries |
| Traffic routing | Traefik (Phase 1) → GKE Gateway / Google Cloud Load Balancer (Phase 2) |
| Traffic / security | Cloudflare DNS updated to point to the new GKE cluster — no other changes |
| Login / payments | None — OAuth and QuickBooks Payments are external services, unaffected |

The migration is a configuration change, not a rebuild.

**Full flow on Phase 2:**

```
Developer pushes code to GitHub
        ↓
GitHub Actions builds a new container image (e.g. my-website:1.4)
        ↓
Image pushed to DockerHub
        ↓
GitHub Actions deploys the new image to GKE
        ↓
GKE replaces the running container with the new version
        ↓
Cloudflare routes visitors to the updated application
        ↓
Application reads/writes data in Azure Database for PostgreSQL
```

If version 1.4 has a bug: GitHub Actions redeploys `my-website:1.3` from DockerHub. Previous version is live in under a minute. Database is unaffected.

**Production component stack:**

| Component | Service | Provider |
|---|---|---|
| Container cluster | GKE (Google Kubernetes Engine) | Google Cloud |
| CI/CD pipeline | GitHub Actions | GitHub |
| Container registry | DockerHub | Docker Inc. |
| Security + CDN | Cloudflare | Cloudflare |
| Secrets management | Google Secret Manager | Google Cloud |
| Monitoring / logs | Google Cloud Logging + Monitoring | Google Cloud |
| AI triage | Gemini API | Google Cloud |
| Database | Azure Database for PostgreSQL | Microsoft Azure |
| Traffic routing | GKE Gateway | Google Cloud |
| Application | Node.js containers | GKE |
| Login (primary) | Google OAuth via Passport.js | Google |
| Login (secondary) | Microsoft OAuth via Passport.js | Microsoft |
| Payments | QuickBooks Payments | QuickBooks (Intuit) |
| Job history (services) | HCP API | Housecall Pro |
| Code repository | GitHub | GitHub |

---

## Data Architecture — Two Business Branches

KOM USA operates two distinct lines of business. The database treats them separately from the start.

**Services branch** (maintenance — chimney care, lock changes, HVAC, and related):

- **Job history:** HCP (Housecall Pro) is the source of truth. The platform fetches records from the HCP API at request time — it does not store or replicate them. HCP has the most complete service history.
- **Payments and invoicing:** QuickBooks Payments — already in use for this branch.
- **What the platform stores:** client login credentials and membership status only.

**Construction materials branch** (separate business line):

- Scope, data model, and requirements are TBD — this branch will be designed separately once the services branch is established.

