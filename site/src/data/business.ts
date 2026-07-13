/**
 * Single source of truth for KOM USA business facts.
 * Every component, meta tag, and schema entity reads from here —
 * never hard-code the phone number, email, prices, or service lists in templates.
 */

import { offerFormValue } from "./offer-client";
import { allServices } from "./service-catalog";

export const business = {
  name: "KOM USA",
  legalName: "KOM Construction LLC",
  tagline: "Home maintenance and construction across Metro Detroit",
  phone: "248-264-3631",
  phoneHref: "tel:+12482643631",
  smsHref: "sms:+12482643631",
  maintenancePhone: "248-264-3631",
  maintenancePhoneHref: "tel:+12482643631",
  constructionPhone: "248-215-2634",
  constructionPhoneHref: "tel:+12482152634",
  email: "contact@kom-usa.com",
  emailHref: "mailto:contact@kom-usa.com",
  serviceArea: "Metro Detroit",
  url: "https://kom-usa.com",
  availability: "Service requests accepted 24/7",
  hoursShort: "Service requests accepted 24/7",
  googleReviewsUrl: "https://share.google/gfFHF6KBpnBz5FchG",
} as const;

export const hours = [
  { days: "Online requests", time: "Accepted 24/7" },
  { days: "Phone and field service", time: "Timing confirmed with the appropriate team" },
];

export const googleReviews = {
  url: business.googleReviewsUrl,
  rating: "4.7",
  count: 58,
  featured: [
    {
      name: "Jordan P.",
      quote:
        "KOM did an amazing job with my basement tile. They were very knowledgeable and helped me understand my options. I would highly recommend them to anyone.",
    },
    {
      name: "Kris R.",
      quote:
        "Wow, where do I even start. I contacted KOM to assist with a creative project in Detroit. The project required the ability to think outside of the box and be non-conventional.",
    },
    {
      name: "Shannon P.",
      quote:
        "My adult son became disabled and living in that tiny house was not working — I had to make changes. Moving into a new home on a single income was not an option, so I did an overhaul of my home.",
    },
  ],
};

export const offer = {
  headline: "Request Service",
  sub: "Tell KOM USA what you need",
  terms: [
    "Scope, timing, and pricing are confirmed after review.",
    "Submitting a request does not create a booking.",
  ],
  formValue: offerFormValue,
};

export interface PriceItem {
  service: string;
  detail?: string;
  price: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export const pricingDisclaimer =
  "KOM USA confirms scope and current pricing before work is scheduled.";

/** Code-side pricing guardrails appended to every service page, keyed by slug.
 *  Editors cannot remove these — that is deliberate. */
export const serviceGuardrails: Record<string, string[]> = {};

/** Homepage FAQ block. Code-owned so the funnel copy and the FAQPage schema
 *  entity stay in sync and can never be emptied by a CMS outage. */
export const faqs: Faq[] = [
  {
    question: "What happens after I send a request?",
    answer:
      "KOM USA reviews the service, location, timing, and project details, then contacts you to discuss the next step. Project-specific pricing is provided after the scope is understood.",
  },
  {
    question: "Where does KOM USA work?",
    answer:
      "KOM USA serves Metro Detroit, including communities across Wayne, Oakland, and Macomb counties. Send the address or ZIP with your request so the team can confirm the service area.",
  },
  {
    question: "Which phone number should I use?",
    answer:
      "Call 248-264-3631 for repairs, routine work, and handyman needs. Call 248-215-2634 for remodeling, construction, materials, and larger projects.",
  },
  {
    question: "Can I request a price online?",
    answer:
      "Yes. Use the request form and include enough detail for the team to review the scope. KOM USA does not promise instant pricing; dimensions, access, materials, condition, and project complexity may affect the estimate.",
  },
  {
    question: "Can contractors use the request form?",
    answer:
      "Yes. Contractors can choose Construction, describe the required scope, and include the project stage, location, timing, and available documents or photos.",
  },
  {
    question: "Are requests accepted around the clock?",
    answer:
      "Online service requests are accepted 24/7. This does not mean technicians are dispatched or phones are answered around the clock; the team will review the details and contact you about the next step.",
  },
];

export const serviceAreaCities = [
  "Detroit",
  "Warren",
  "Sterling Heights",
  "Troy",
  "Royal Oak",
  "Ferndale",
  "Southfield",
  "Dearborn",
  "Livonia",
  "Farmington Hills",
  "St. Clair Shores",
  "Grosse Pointe",
  "Roseville",
  "Clinton Township",
  "Madison Heights",
  "Oak Park",
];

export const serviceAreaCounties = ["Wayne County", "Oakland County", "Macomb County"];

export const trustPoints = [
  {
    title: "Locally owned & operated",
    description: "A small Metro Detroit crew — the person you talk to knows the person who shows up.",
    icon: "home-heart",
  },
  {
    title: "Clear service paths",
    description: "Maintenance and Construction requests reach the team responsible for that work.",
    icon: "clipboard-check",
  },
  {
    title: "Real project experience",
    description: "The site shows genuine work completed in Metro Detroit properties.",
    icon: "shield-check",
  },
  {
    title: "Requests accepted 24/7",
    description: "Send the details whenever it is convenient; the team reviews each request and follows up.",
    icon: "phone",
  },
  {
    title: "Plain communication",
    description: "You know what happens next, what it costs, and who to call.",
    icon: "message-circle",
  },
];

export const howItWorks = [
  {
    title: "Choose your service",
    description:
      "Select Maintenance for repairs, routine work, and handyman needs, or Construction for remodeling and larger projects.",
    icon: "message-circle",
  },
  {
    title: "Call or send a request",
    description:
      "Speak with the appropriate team or use one short form to describe the service, location, and timing.",
    icon: "phone",
  },
  {
    title: "We review and follow up",
    description:
      "KOM USA discusses the scope, explains the next step, and provides an estimate when project-specific pricing is required.",
    icon: "calendar-check",
  },
];

export const serviceOptions = [...allServices.map((service) => service.title), "Not sure / other"];

export const urgencyOptions = [
  "Urgent",
  "Soon",
  "Planning ahead",
  "Flexible",
];
