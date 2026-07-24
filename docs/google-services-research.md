# Google Services — Research and Recommendations

**Prepared for:** Michael (Owner)
**Prepared by:** Ovidiu (Developer)
**Date:** 2026-07-24
**Purpose:** Explain why certain Google-native tools are not recommended for the delivery pipeline, and what is used instead.

---

## The Core Problem — Single Point of Failure

If the application, the pipeline, the image storage, and the CDN all run on Google, then Google is a single point of failure. One Google outage takes all of them down simultaneously. There is no independent layer left to absorb the problem or respond to it.

The solution is to separate the layers so that failures are isolated rather than cascading. Google goes down — the application is affected, but the pipeline still runs, DockerHub still serves images, Cloudflare still serves the site. Each layer can fail independently without taking everything else with it.

This is a standard engineering principle, not a statement against Google. No well-architected system puts everything on a single provider. GKE stays on Google — the cluster is Google. But the tools that deliver code to that cluster are kept independent so that a Google problem does not also become a response problem.

**This is not theoretical.** In June 2019, Google Cloud had a major outage lasting several hours that took down networking and Cloud CDN across the US. Companies with everything on Google lost the ability to deploy fixes or roll back while the outage lasted. Companies with independent delivery tools kept operating.

---

## CI/CD Pipeline — GitHub Actions, not Google Cloud Build

The CI/CD pipeline is what turns a code update into a running deployment — automatically, no manual steps.

Google Cloud Build runs on Google. If Google is the problem, the pipeline to fix it is also the problem — a single point of failure. GitHub Actions runs on GitHub's own infrastructure, separate from Google. If Google goes down, the pipeline keeps running. A fix can still be built and deployed while the outage is ongoing.

**This is the industry standard.** Every company — regardless of which cloud they run on — keeps the CI/CD pipeline off the cloud it deploys to. The pipeline should never share a single point of failure with the infrastructure it is managing.

**What if GitHub Actions goes down?** The application on GKE keeps running and serving customers — nothing breaks for existing users. Deployments pause until GitHub recovers. Compare that to Cloud Build going down as part of a Google outage: the pipeline is down AND the application may be down, all at once. One layer failing vs. everything failing together.

---

## Container Storage — DockerHub, not Google Artifact Registry

Every version of the application is stored as a numbered container image — `my-website:1.3`, `my-website:1.4`. When something breaks and a rollback is needed, the previous version is pulled from storage and redeployed.

**Why not Google Artifact Registry:** Artifact Registry is part of Google Cloud and uses Google's own authentication to serve images. If Google is having an outage, Artifact Registry may be unavailable — which means rollback is unavailable at exactly the moment it is most needed. A broken deployment with no ability to roll back is the worst possible situation.

**Why DockerHub:** Runs on its own infrastructure, independent of Google. If Google has a problem, DockerHub is unaffected. Rollback still works. Previous versions are still accessible. Standard username and password authentication — no Google credentials required, no dependency on Google being operational. JFrog Artifactory is the enterprise alternative used by some of the largest companies for the same reason.

**What if DockerHub goes down?** DockerHub has had outages. If it goes down, deploying new versions and rolling back are temporarily unavailable — but the application keeps running. GKE caches the images it is already running, so existing traffic is served normally. Once DockerHub recovers, everything resumes. Compare that to Artifact Registry going down as part of a Google outage: rollback is unavailable AND the cluster running the application is on the same infrastructure that is failing.

---

## CDN and Security — Cloudflare, not Google Cloud CDN + Armor

The CDN sits between the internet and the application. It filters attack traffic, caches content close to visitors, and is the first layer of defense before anything reaches the servers.

**Why not Google Cloud CDN and Armor:** When Google has an outage, Cloud CDN goes down with it — because it is part of the same infrastructure. The CDN and the application fail simultaneously. There is no independent layer left standing to absorb the failure or continue serving visitors.

**A fair counterpoint — Cloudflare has had outages too.** In June 2019 — the same month as the Google incident — Cloudflare had a significant outage of its own. This is worth addressing directly. When Cloudflare went down, the applications behind it (hosted on various cloud providers) kept running. The outage was isolated to the CDN layer. When Google CDN went down as part of the Google outage, both the CDN and the origin went down together, because they were the same provider.

**Why Cloudflare:** The argument is not that Cloudflare never fails. It is that when it fails, only one layer is affected. If Cloudflare goes down, GKE is still running and recovers the moment Cloudflare comes back. If Google goes down, Cloudflare continues serving cached content to visitors from its 300+ edge locations worldwide while the origin recovers. The failures are independent — not cascading.

**What if Cloudflare goes down?** Visitors cannot reach the site until Cloudflare recovers — same as if Google CDN went down. The difference is that with Cloudflare down, GKE is still running and fully operational, deployments still work, and rollbacks still work. With Google CDN down as part of a Google outage, the site is unreachable AND the tools to respond are also potentially unavailable. The failure is contained to one layer instead of compounding across all of them.

---

## What This Means in Practice

KOM is still on Google. GKE is Google. Gemini is Google. Google OAuth is Google. The argument is not against Google — it is about not letting a Google problem also become a pipeline problem at the same time.

The delivery tools are independent so that when something goes wrong, the response is not also broken.

---

## Anticipated Pushback

**"We're not moving off Google. So why does any of this matter?"**

The argument is not about moving. It is about what happens during an incident. If Google Cloud Build is degraded and a critical bug needs to go out, the pipeline is unavailable at exactly the wrong moment. The containers are portable — that was the whole reason for choosing them. Using Google Cloud Build to deliver those containers partially undermines the same portability argument that justified the container decision in the first place.

---

**"GitHub has had 24-hour outages. Docker Inc. nearly went bankrupt in 2019. These services are not more reliable than Google."**

That is fair and worth taking seriously. GitHub did have a major outage in October 2018. Docker Inc. did have financial difficulties in 2019 — though DockerHub (the service) remained operational throughout and Docker Inc. has since refocused and stabilized.

The argument is not that these services are more reliable. It is that their failures are isolated. When GitHub Actions goes down, GKE keeps running and customers are unaffected. When DockerHub has issues, the application keeps serving traffic — deployments pause but nothing breaks for existing users. The concern with Google-native tools is not reliability — it is that a Google problem affects multiple layers simultaneously: the pipeline, the registry, the CDN, and potentially the cluster, all at once.

---

**"Google has financial SLAs. If they go down, they owe me money. These other services don't have the same guarantees."**

SLA credits are a financial backstop, not an operational one. A credit on next month's bill does not help when customers cannot reach the site and the application cannot be fixed. The goal is to ensure the ability to respond during an incident — credits address the financial side after the fact.

---

**"This adds more complexity. I wanted one account and one bill."**

GitHub is already where the code lives — it is not a new service. Cloudflare's free tier requires a one-time setup and is largely set-and-forget. DockerHub is simple credentials. None of these require ongoing management in the way that a cloud infrastructure account does. The Google bill stays — GKE, Gemini, monitoring — and these tools sit alongside it at negligible cost and minimal overhead.

---

## Ingress (Traffic) Controller — GKE Gateway (Google Cloud Load Balancer)

Once a request passes through Cloudflare and reaches the cluster, the ingress controller routes it to the correct container — marketing site, client portal, or API.

For managed Kubernetes (GKE, EKS, AKS), each cloud provider's integrated load balancer is the standard — not a third-party tool. On GKE this is GKE Gateway, backed by Google Cloud Load Balancer. On Phase 1 (Oracle, k3s), Traefik handles this role since there is no managed load balancer on a single free-tier server.

**Cost note:** The load balancer is a real line item. A full production setup on GKE — cluster, load balancer, database, and supporting services — should be budgeted at **$100–300/month** depending on configuration. Phase 1 on Oracle is free.

Most cloud providers — Google and Azure included — offer committed use or savings plans where paying in advance (typically 1 or 3 years) can reduce costs by up to 70%. This is worth revisiting once the system is live and usage patterns are established — not something to commit to upfront.

---

## Google AI Tooling — Development Environment

Beyond what runs in production, Google has a set of AI tools that are relevant to how the application gets built. These do not change any architecture decisions but are worth understanding given the direction of the stack.

---

**Gemini API** — what runs in production. The AI triage feature calls this directly from the Node.js container. Already in the architecture.

---

**Gemini Code Assist** — Google's AI coding assistant for VS Code. Autocompletes code, explains functions, suggests fixes inline while writing. Similar to GitHub Copilot but tuned to Google Cloud APIs and services. Since the stack is on GKE and using Google's infrastructure, Code Assist has native awareness of the services being used. Available now.

---

**Jules** — Google's autonomous AI coding agent. The direct equivalent of Claude Code and OpenAI's Codex — it works on a codebase autonomously, can pick up a GitHub issue, write the code, and open a pull request without manual intervention. Runs on Gemini models. Announced late 2024, rolling out through 2025. Since the codebase lives on GitHub, Jules would integrate directly with the existing repository. Worth evaluating once it reaches general availability.

---

**Vertex AI** — Google's enterprise AI platform for running, fine-tuning, and deploying models at scale. Not relevant for KOM at this stage. The Gemini API covers the AI triage use case. Vertex AI becomes relevant if there is a need for custom fine-tuning, strict data residency controls, or enterprise audit logging on AI calls — none of which apply here yet.

---

**Google Secret Manager** — not an AI tool, but a gap in the current architecture worth noting. The original plan used Amazon SSM to store API keys and credentials (database passwords, QuickBooks API keys, OAuth secrets) securely. Moving to Google Cloud means Google Secret Manager is the natural replacement — same concept, keeps credentials off of environment files and out of source code, integrates directly with GKE.

---

## Summary

| Component | Chosen | Why not Google's version |
|---|---|---|
| CI/CD pipeline | GitHub Actions | Cloud Build is on Google — unavailable during a Google outage |
| Container storage | DockerHub | Artifact Registry is on Google — rollback unavailable if Google is down |
| CDN / security | Cloudflare | Google CDN fails with Google — Cloudflare fails independently |
| Ingress controller | GKE Gateway | Exception — managed Kubernetes uses the provider's integrated load balancer as standard |
| Cluster (compute) | GKE | Kubernetes is the same on every cloud — GKE is safe to commit to |
