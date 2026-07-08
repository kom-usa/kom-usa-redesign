import { defineType, defineField } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "shortTitle", title: "Short title (nav + form)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "anchorPrice", title: "Anchor price (homepage card)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "blurb", title: "Card blurb", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "heroIntro", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "heroImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroAlt", title: "Hero image alt text", type: "string" }),
    defineField({ name: "includes", title: "What we handle", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "pricing", title: "Pricing table", type: "array", of: [{ type: "priceRow" }] }),
    defineField({
      name: "pricingNote",
      title: "Extra pricing note (optional)",
      description: "Shown under the table. The standard disclaimer and locksmith deposit/distance notes are added automatically by the site and cannot be edited here.",
      type: "text",
      rows: 2,
    }),
    defineField({ name: "faqs", title: "Service FAQs", type: "array", of: [{ type: "faqItem" }] }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "anchorPrice" } },
});
