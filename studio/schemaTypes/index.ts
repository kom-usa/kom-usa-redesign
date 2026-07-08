import { seo, priceRow, faqItem } from "./shared";
import { service } from "./service";
import { faq, article, location, project, testimonial } from "./content";

export const schemaTypes = [
  // objects
  seo,
  priceRow,
  faqItem,
  // documents
  service,
  faq,
  article,
  location,
  project,
  testimonial,
];
