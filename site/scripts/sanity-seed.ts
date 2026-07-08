/**
 * Seed Sanity with the code-owned content so the Studio isn't empty.
 * Idempotent: fixed _ids + createOrReplace, so re-running never duplicates.
 * After the first seed, Sanity is the source of truth — editors change content
 * there, not in these files.
 *
 * Run: npm run sanity:seed   (needs SANITY_API_WRITE_TOKEN in site/.env)
 */
import { createClient } from "@sanity/client";
import { services } from "../src/data/services";
import { faqs } from "../src/data/business";

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId) throw new Error("SANITY_PROJECT_ID missing (site/.env).");
if (!token) throw new Error("SANITY_API_WRITE_TOKEN missing (site/.env) — needs an Editor token.");

const client = createClient({
  projectId,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-10-01",
  token,
  useCdn: false,
});

async function run() {
  const tx = client.transaction();

  for (const s of services) {
    tx.createOrReplace({
      _id: `service-${s.slug}`,
      _type: "service",
      title: s.title,
      shortTitle: s.shortTitle,
      slug: { _type: "slug", current: s.slug },
      anchorPrice: s.anchorPrice,
      blurb: s.blurb,
      heroIntro: s.heroIntro,
      heroAlt: s.heroAlt,
      includes: s.includes,
      pricing: s.pricing.map((p, i) => ({ _key: `p${i}`, _type: "priceRow", ...p })),
      ...(s.pricingNote ? { pricingNote: s.pricingNote } : {}),
      faqs: s.faqs.map((f, i) => ({ _key: `f${i}`, _type: "faqItem", ...f })),
      seo: { title: s.seoTitle, description: s.seoDescription },
    });
  }

  faqs.forEach((f, i) => {
    tx.createOrReplace({
      _id: `faq-home-${i}`,
      _type: "faq",
      question: f.question,
      answer: f.answer,
      placement: "homepage",
      order: i,
    });
  });

  const res = await tx.commit();
  console.log(`Seeded ${services.length} services + ${faqs.length} homepage FAQs (${res.results.length} docs written).`);
}

run().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
