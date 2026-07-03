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
  url: "https://www.kom.construction",
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

export interface ServiceDef {
  slug: string;
  title: string;
  shortTitle: string;
  icon: string;
  anchorPrice: string;
  blurb: string;
  heroIntro: string;
  includes: string[];
  pricing: PriceItem[];
  pricingNotes: string[];
  faqs: Faq[];
}

export const pricingDisclaimer =
  "Standard pricing — we confirm your exact quote by phone before any work starts.";

export const services: ServiceDef[] = [
  {
    slug: "locksmith",
    title: "Locksmith Services",
    shortTitle: "Locksmith",
    icon: "key",
    anchorPrice: "Unlocks from $129",
    blurb:
      "Locked out, moving in, or ready for a keypad? Fast, damage-free residential locksmith work with prices published up front.",
    heroIntro:
      "Whether you're locked out right now or planning new locks for a new home, we handle it quickly and treat your door like our own. Our standard prices are published below, so you know what to expect before we ever pick up a tool.",
    includes: [
      "House and unit door unlocks",
      "Lock changes and rekeying",
      "Deadbolt and handle combos",
      "Kwikset smart keypad installation",
      "Lock box installation",
      "Key duplication",
    ],
    pricing: [
      { service: "House door unlock", detail: "Quick, damage-free entry", price: "$129" },
      { service: "Change locks — 1 lock", price: "$179" },
      { service: "Change locks — 2 locks", price: "$279" },
      { service: "Change locks — 3 locks", price: "$349" },
      { service: "Change locks — 4+ locks", price: "$65 per lock" },
      { service: "Lock combo", detail: "Deadbolt + handle", price: "$179" },
      { service: "Kwikset smart keypad", detail: "Keyless entry with user codes", price: "$329" },
      { service: "Lock box", detail: "$79 when added to another service", price: "$129" },
      { service: "Key duplication", detail: "$10 each additional copy", price: "$25" },
    ],
    pricingNotes: [
      pricingDisclaimer,
      "A 50% deposit is required before a technician is dispatched.",
      "Jobs more than 25 miles from our location add a $50 distance fee.",
    ],
    faqs: [
      {
        question: "I'm locked out right now. What do I do?",
        answer:
          "Call us at 313-804-0844 — that's faster than the form. We confirm your location, verify the property is yours, and dispatch a technician after the 50% deposit.",
      },
      {
        question: "Will unlocking my door damage it?",
        answer:
          "No — our standard unlock is damage-free. If your lock is broken or worn out, we'll tell you before doing anything and give you the price to replace it.",
      },
      {
        question: "Can you install a keypad so I can stop carrying keys?",
        answer:
          "Yes. We install Kwikset smart keypads for $329, set up your codes with you, and show you how to add or remove users.",
      },
    ],
  },
  {
    slug: "water-heaters",
    title: "Water Heater Replacement",
    shortTitle: "Water Heaters",
    icon: "droplet",
    anchorPrice: "From $1,750 installed",
    blurb:
      "No hot water? We replace electric, gas, and power-vent water heaters with straightforward installed pricing.",
    heroIntro:
      "A failing water heater doesn't wait, so neither do we. Tell us what you have and we'll recommend the right replacement, give you one installed price on the call, and get your hot water back.",
    includes: [
      "Electric water heater replacement (30–40 gallon)",
      "Gas water heater replacement (40–50 gallon)",
      "Power-vent gas water heater replacement",
      "Help choosing the right size and type for your home",
    ],
    pricing: [
      { service: "Electric water heater", detail: "30–40 gallon, installed", price: "from $1,750" },
      { service: "Gas water heater", detail: "40 gallon, installed", price: "from $1,850" },
      { service: "Gas water heater", detail: "50 gallon, installed", price: "from $2,300" },
      { service: "Power-vent gas water heater", detail: "40 gallon, installed", price: "from $2,850" },
    ],
    pricingNotes: [
      "Starting prices include standard installation. Your exact quote depends on the model and your home's setup — we confirm it on the call before scheduling.",
    ],
    faqs: [
      {
        question: "How do I know if I need a replacement or a repair?",
        answer:
          "If your water heater is leaking from the tank, over 10 years old, or not keeping up anymore, replacement usually beats repair. Not sure? Send the form — we'll talk it through on the call at no charge.",
      },
      {
        question: "What sizes do you install?",
        answer:
          "We install 30–50 gallon electric and gas units, including power-vent models. We'll match the size and type to what your home already has, or recommend a change if it makes sense.",
      },
      {
        question: "Does the price include installation?",
        answer:
          "Yes — the starting prices shown are installed prices, not tank-only. We confirm your exact quote by phone once we know the model and your setup.",
      },
    ],
  },
  {
    slug: "chimney-care",
    title: "Chimney Care",
    shortTitle: "Chimney Care",
    icon: "flame",
    anchorPrice: "Cleaning $299",
    blurb:
      "Keep your fireplace safe and your chimney sealed against Michigan weather — cleaning, caps, and liner caps at flat prices.",
    heroIntro:
      "A clean, capped chimney burns safer and keeps water, ice, and critters out. We publish our chimney prices flat-out, so scheduling your yearly cleaning is one quick call.",
    includes: [
      "Chimney cleaning and sweep",
      "Chimney cap installation and replacement",
      "Chimney liner cap installation",
      "Visual condition check with every cleaning",
    ],
    pricing: [
      { service: "Chimney cleaning", detail: "Up to 35 feet", price: "$299" },
      { service: "Additional height", detail: "Beyond 35 feet", price: "+$6 per ft" },
      { service: "Chimney cap", detail: "Supplied and installed", price: "$329" },
      { service: "Liner cap", detail: "Supplied and installed", price: "$289" },
    ],
    pricingNotes: [pricingDisclaimer],
    faqs: [
      {
        question: "How often should my chimney be cleaned?",
        answer:
          "Once a year if you use your fireplace regularly — ideally before burning season. If you've just moved in and don't know when it was last cleaned, start with a cleaning and we'll tell you how it looks.",
      },
      {
        question: "Do I really need a chimney cap?",
        answer:
          "In Michigan, yes. A cap keeps rain, snow, ice, and animals out of the flue — replacing one is far cheaper than repairing water damage inside a chimney.",
      },
      {
        question: "How tall a chimney can you clean?",
        answer:
          "Our $299 cleaning covers chimneys up to 35 feet, which fits most homes. Taller than that is $6 per additional foot — we'll confirm the total on the call.",
      },
    ],
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
