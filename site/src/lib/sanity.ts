import { createClient, type SanityClient } from "@sanity/client";
import { services as codeServices, type ServiceDef } from "../data/services";
import { faqs as codeFaqs, type Faq } from "../data/business";

/**
 * Sanity content source. The client is null when SANITY_PROJECT_ID is unset, so
 * the build survives with code fallback (same resilience as Phase A). All reads
 * happen at build time (useCdn: false, published content). Studio is a separate
 * standalone project (see /studio) — this file only reads.
 */
const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || "production";
const apiVersion = import.meta.env.SANITY_API_VERSION || "2024-10-01";

export const sanityClient: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: import.meta.env.SANITY_API_READ_TOKEN || undefined,
    })
  : null;

const SERVICE_PROJECTION = `{
  "slug": slug.current, title, shortTitle, anchorPrice, blurb, heroIntro,
  heroImage, heroAlt,
  "includes": includes[],
  "pricing": pricing[]{ service, detail, price },
  pricingNote,
  "faqs": faqs[]{ question, answer },
  "seoTitle": seo.title, "seoDescription": seo.description,
  "preselectService": shortTitle
}`;

async function safe<T>(
  run: (c: SanityClient) => Promise<T>,
  fallback: T,
  label: string,
): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    const v = await run(sanityClient);
    return v == null || (Array.isArray(v) && v.length === 0) ? fallback : v;
  } catch (e) {
    console.warn(`[sanity] ${label} failed, using fallback:`, (e as Error).message);
    return fallback;
  }
}

export async function getServices(): Promise<ServiceDef[]> {
  return safe(
    (c) => c.fetch<ServiceDef[]>(`*[_type == "service"] | order(anchorPrice asc) ${SERVICE_PROJECTION}`),
    codeServices,
    "getServices",
  );
}

export async function getService(slug: string): Promise<ServiceDef | null> {
  return safe(
    (c) => c.fetch<ServiceDef | null>(`*[_type == "service" && slug.current == $slug][0] ${SERVICE_PROJECTION}`, { slug }),
    codeServices.find((s) => s.slug === slug) ?? null,
    "getService",
  );
}

export async function getHomepageFaqs(): Promise<Faq[]> {
  return safe(
    (c) => c.fetch<Faq[]>(`*[_type == "faq" && placement == "homepage"] | order(order asc){ question, answer }`),
    codeFaqs,
    "getHomepageFaqs",
  );
}

export interface ArticleCard {
  slug: string; title: string; category?: string; excerpt?: string; date?: string;
  coverImage?: unknown; coverAlt?: string;
}
export interface Article extends ArticleCard {
  body?: unknown;
  seoTitle?: string;
  seoDescription?: string;
}
export async function getArticles(): Promise<ArticleCard[]> {
  return safe(
    (c) => c.fetch<ArticleCard[]>(`*[_type == "article" && defined(slug.current)] | order(date desc){
      "slug": slug.current, title, category, excerpt, date, coverImage, coverAlt }`),
    [],
    "getArticles",
  );
}
export async function getArticle(slug: string): Promise<Article | null> {
  return safe<Article | null>(
    (c) => c.fetch<Article | null>(`*[_type == "article" && slug.current == $slug][0]{
      "slug": slug.current, title, category, excerpt, date, coverImage, coverAlt, body,
      "seoTitle": seo.title, "seoDescription": seo.description }`, { slug }),
    null,
    "getArticle",
  );
}

export interface LocationCard {
  slug: string;
  city: string;
  heroIntro?: string;
}
export interface Location extends LocationCard {
  body?: unknown;
  seoTitle?: string;
  seoDescription?: string;
}
export async function getLocations(): Promise<Location[]> {
  return safe<Location[]>(
    (c) => c.fetch<Location[]>(`*[_type == "location" && defined(slug.current)] | order(city asc){
      "slug": slug.current, city, heroIntro, body,
      "seoTitle": seo.title, "seoDescription": seo.description }`),
    [],
    "getLocations",
  );
}
export async function getLocation(slug: string): Promise<Location | null> {
  return safe<Location | null>(
    (c) => c.fetch<Location | null>(`*[_type == "location" && slug.current == $slug][0]{
      "slug": slug.current, city, heroIntro, body, "seoTitle": seo.title, "seoDescription": seo.description }`, { slug }),
    null,
    "getLocation",
  );
}

export interface ProjectCard {
  slug: string;
  title: string;
  date?: string;
  photos?: unknown[];
  problem?: string;
  work?: string;
  result?: string;
}
export interface Project extends ProjectCard {
  seoTitle?: string;
  seoDescription?: string;
}
export async function getProjects(): Promise<ProjectCard[]> {
  return safe<ProjectCard[]>(
    (c) => c.fetch<ProjectCard[]>(`*[_type == "project" && defined(slug.current)] | order(date desc){
      "slug": slug.current, title, date, photos, problem, work, result }`),
    [],
    "getProjects",
  );
}
export async function getProject(slug: string): Promise<Project | null> {
  return safe<Project | null>(
    (c) => c.fetch<Project | null>(`*[_type == "project" && slug.current == $slug][0]{
      "slug": slug.current, title, date, photos, problem, work, result,
      "seoTitle": seo.title, "seoDescription": seo.description }`, { slug }),
    null,
    "getProject",
  );
}
