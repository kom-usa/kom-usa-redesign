/**
 * Compatibility adapter for older CMS helpers and components.
 * Public service routes use service-catalog.ts. No unverified prices or
 * retired phone details are retained here.
 */
import type { PriceItem, Faq } from "./business";
import { maintenanceServices } from "./service-catalog";

export interface ServiceDef {
  slug: "locksmith" | "water-heaters" | "chimney-care";
  title: string;
  shortTitle: string;
  anchorPrice: string;
  blurb: string;
  heroIntro: string;
  includes: string[];
  pricing: PriceItem[];
  pricingNote?: string;
  faqs: Faq[];
  seoTitle: string;
  seoDescription: string;
  heroAlt: string;
  preselectService: string;
}

const legacySlugs = ["locksmith", "water-heaters", "chimney-care"] as const;

export const services: ServiceDef[] = legacySlugs.map((slug) => {
  const service = maintenanceServices.find((item) => item.slug === slug)!;
  return {
    slug,
    title: service.title,
    shortTitle: service.shortTitle,
    anchorPrice: service.pricingLabel,
    blurb: service.summary,
    heroIntro: service.problem,
    includes: service.included,
    pricing: [],
    pricingNote: "KOM USA confirms scope and current pricing after reviewing the request.",
    faqs: service.faqs,
    seoTitle: `${service.title} in Metro Detroit | KOM USA`,
    seoDescription: service.summary,
    heroAlt: `${service.title} work by KOM USA in Metro Detroit`,
    preselectService: service.title,
  };
});

export function getService(slug: string): ServiceDef | undefined {
  return services.find((service) => service.slug === slug);
}
