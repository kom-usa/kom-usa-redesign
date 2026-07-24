# KOM USA — Proposed Expenses

**Prepared for:** Michael (Owner)
**Prepared by:** Ovidiu (Developer)
**Date:** 2026-07-24
**Purpose:** Projected infrastructure costs by phase. Existing subscriptions (HCP, QuickBooks) are not included — these are new costs only.

---

## Phase 1 — Oracle Cloud (Free Tier)

| Service | Provider | Monthly Cost | Notes |
|---|---|---|---|
| Server (compute) | Oracle Cloud | $0 | Always Free tier — 2 OCPU, 12GB RAM |
| CI/CD pipeline | GitHub Actions | $0 | Free tier |
| Container registry | DockerHub | $0 | Free tier |
| CDN / security | Cloudflare | $0 | Free tier |
| **Phase 1 total** | | **$0 / month** | |

---

## Phase 2 — Google Cloud (GKE) + Azure Database

| Service | Provider | Est. Monthly Cost | Notes |
|---|---|---|---|
| Container cluster | Google Cloud (GKE) | $50–150 | 2–3 nodes, varies by traffic |
| Load balancer | Google Cloud | $20–30 | GKE Gateway — required for managed Kubernetes |
| Logging + monitoring | Google Cloud | $10–20 | Cloud Logging + Monitoring |
| Secret Manager | Google Cloud | ~$1 | Negligible at this scale |
| AI triage | Google Cloud (Gemini API) | $5–20 | Usage-based |
| Database | Microsoft Azure | $25–50 | Azure Database for PostgreSQL, Flexible Server |
| CI/CD pipeline | GitHub Actions | $0 | Free tier |
| Container registry | DockerHub | $0 | Free tier |
| CDN / security | Cloudflare | $0 | Free tier |
| **Phase 2 total** | | **$100–300 / month** | New infrastructure only |

---

## Savings Plans

Google Cloud and Azure both offer committed use discounts — paying 1 or 3 years in advance reduces costs by up to 70%.

| Scenario | Est. Monthly Cost |
|---|---|
| Pay-as-you-go (no commitment) | $100–300 / month |
| 1-year commitment | $60–180 / month |
| 3-year commitment | $40–105 / month |

Savings plans are worth evaluating once the system is live and usage patterns are established. Committing upfront before traffic is known is not recommended.

---

## Summary

| Phase | Monthly Cost |
|---|---|
| Phase 1 — Oracle (build and validate) | $0 |
| Phase 2 — Production (pay-as-you-go) | $100–300 |
| Phase 2 — Production (with savings plan) | $40–180 |
