import { defineType, defineField } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "SEO title", type: "string", validation: (r) => r.max(65) }),
    defineField({ name: "description", title: "Meta description", type: "text", rows: 2, validation: (r) => r.max(160) }),
  ],
});

export const priceRow = defineType({
  name: "priceRow",
  title: "Price row",
  type: "object",
  fields: [
    defineField({ name: "service", title: "Item", type: "string", validation: (r) => r.required() }),
    defineField({ name: "detail", title: "Detail (optional)", type: "string" }),
    defineField({ name: "price", title: "Price", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "service", subtitle: "price" } },
});

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ item",
  type: "object",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question" } },
});
