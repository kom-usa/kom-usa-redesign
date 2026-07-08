/**
 * Single source of truth for KOM USA business facts.
 * Every component, meta tag, and schema entity reads from here —
 * never hard-code the phone number, email, prices, or service lists in templates.
 */

import { offerFormValue } from "./offer-client";

export const business = {
  name: "KOM USA",
  legalName: "KOM Construction LLC",
  tagline: "Locksmith, water heater, and chimney services in Metro Detroit",
  phone: "313-804-0844",
  phoneHref: "tel:+13138040844",
  smsHref: "sms:+13138040844",
  email: "contact@kom-usa.com",
  emailHref: "mailto:contact@kom-usa.com",
  serviceArea: "Metro Detroit",
  url: "https://kom-usa.com",
  hoursShort: "Mon–Sat 8am–5pm",
  googleReviewsUrl: "https://share.google/gfFHF6KBpnBz5FchG",
} as const;

export const hours = [
  { days: "Monday – Saturday", time: "8:00 am – 5:00 pm" },
  { days: "Sunday", time: "Closed" },
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
  headline: "$10 Off",
  sub: "Your First Service With KOM USA",
  terms: [
    "For first-time customers. One per household.",
    "Just mention this offer when we call you — no code to remember.",
    "Can't be combined with other offers.",
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
  "Standard pricing — we confirm your exact quote by phone before any work starts.";

/** Code-side pricing guardrails appended to every service page, keyed by slug.
 *  Editors cannot remove these — that is deliberate. */
export const serviceGuardrails: Record<string, string[]> = {
  locksmith: [
    "A 50% deposit is required before a technician is dispatched.",
    "Jobs more than 25 miles from our location add a $50 distance fee.",
  ],
};

/** Homepage FAQ block. Code-owned so the funnel copy and the FAQPage schema
 *  entity stay in sync and can never be emptied by a CMS outage. */
export const faqs: Faq[] = [
  {
    question: "What happens after I send the form?",
    answer:
      "We call you — usually the same business day. We talk through what you need, answer your questions, and give you a quote. If it sounds good, we schedule the work right on the call. No pressure, no obligation.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "Metro Detroit — communities across Wayne, Oakland, and Macomb counties. Not sure if you're in range? Call 313-804-0844 and we'll tell you right away. Locksmith jobs more than 25 miles from our location add a $50 distance fee.",
  },
  {
    question: "How does the $10 first-service offer work?",
    answer:
      "If it's your first time using KOM USA, you get $10 off — just mention the offer when we call you, or hit \"Claim Offer\" on the coupon and we'll see it on your request. One per household; can't be combined with other offers.",
  },
  {
    question: "Are your prices really the prices?",
    answer:
      "The prices on this site are our standard pricing, published so there are no surprises. Your exact quote can vary with your home's setup and hardware, and we always confirm it by phone before any work starts.",
  },
  {
    question: "I'm locked out right now. What do I do?",
    answer:
      "Call us at 313-804-0844. Lockouts are handled by phone so we can confirm your location, verify the property, and dispatch a technician after the 50% deposit.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes — KOM USA is licensed and insured, and we've been serving Metro Detroit homeowners under the same local ownership since day one.",
  },
  {
    question: "Do you only do locksmith, water heater, and chimney work?",
    answer:
      "Those are the services we offer online today. Have something related in mind? Ask when we call — if we can't help, we'll say so honestly.",
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
    title: "Upfront standard pricing",
    description: "Our prices are on this site before you ever call. No surprises at the door.",
    icon: "clipboard-check",
  },
  {
    title: "Licensed & insured",
    description: "Real credentials behind every job, big or small.",
    icon: "shield-check",
  },
  {
    title: "We pick up the phone",
    description: "Call or send the form — a person gets back to you, usually the same day.",
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
    title: "Tell us what you need",
    description:
      "Send the quick form or call 313-804-0844. A couple of details — your city, the service, and when you need it — is all it takes.",
    icon: "message-circle",
  },
  {
    title: "We call you to talk it through",
    description:
      "A real person calls you back, answers your questions, and gives you a clear quote. No pressure, no obligation.",
    icon: "phone",
  },
  {
    title: "We schedule and do the work",
    description:
      "Pick a time that works for you. We show up when we say we will and leave your home better than we found it.",
    icon: "calendar-check",
  },
  {
    title: "You're set",
    description: "We close the loop, confirm the work is complete, and keep notes for next time.",
    icon: "circle-check",
  },
];

export const serviceOptions = [
  "Locksmith",
  "Water heater",
  "Chimney care",
  "Something else",
];

export const urgencyOptions = [
  "Emergency — locked out now",
  "Urgent — within a few days",
  "Soon — within a few weeks",
  "Flexible — planning ahead",
];
