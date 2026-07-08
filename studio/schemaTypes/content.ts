import { defineType, defineField } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ (homepage)",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "placement", type: "string", options: { list: ["homepage"] }, initialValue: "homepage" }),
    defineField({ name: "order", type: "number" }),
  ],
  orderings: [{ name: "order", title: "Order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question" } },
});

export const article = defineType({
  name: "article",
  title: "Blog article",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "category", type: "string", options: { list: ["blog", "update"] }, initialValue: "blog" }),
    defineField({ name: "excerpt", type: "text", rows: 2 }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "coverAlt", title: "Cover image alt text", type: "string" }),
    defineField({ name: "date", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [{ name: "date", title: "Newest", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "category" } },
});

export const location = defineType({
  name: "location",
  title: "Location (city page)",
  type: "document",
  fields: [
    defineField({ name: "city", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "city" }, validation: (r) => r.required() }),
    defineField({ name: "heroIntro", type: "text", rows: 3 }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "city" } },
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "date", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({ name: "photos", type: "array", of: [{ type: "image", options: { hotspot: true } }], validation: (r) => r.min(1) }),
    defineField({ name: "problem", type: "text", rows: 2 }),
    defineField({ name: "work", type: "text", rows: 2 }),
    defineField({ name: "result", type: "text", rows: 2 }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "title" } },
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({
      name: "sourceUrl",
      title: "Source URL (required — real reviews only)",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: { select: { title: "name", subtitle: "quote" } },
});
