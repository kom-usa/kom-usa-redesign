/**
 * Single source of truth for KOM USA business facts.
 * Every component, meta tag, and schema entity reads from here —
 * never hard-code the phone number, email, or service lists in templates.
 */

export const business = {
  name: "KOM USA",
  legalName: "KOM Construction LLC",
  tagline: "Construction, maintenance, locksmith, and chimney services in Metro Detroit",
  phone: "313-804-0844",
  phoneHref: "tel:+13138040844",
  email: "info@kom-usa.com",
  emailHref: "mailto:info@kom-usa.com",
  serviceArea: "Metro Detroit",
  url: "https://www.kom.construction",
} as const;

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

export interface ServiceCategory {
  id: string;
  title: string;
  blurb: string;
  icon: string;
  items: string[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "construction-remodeling",
    title: "Construction & remodeling",
    blurb: "From a single room to a full addition, one crew handles your project start to finish.",
    icon: "hammer",
    items: [
      "Kitchen remodeling",
      "Bathroom remodeling",
      "Tile",
      "Flooring",
      "Concrete",
      "Painting",
      "Drywall",
      "New construction",
      "Home additions",
      "Basement finishing",
    ],
  },
  {
    id: "property-maintenance",
    title: "Property maintenance",
    blurb: "The repairs and upkeep that keep a home or rental running — handled on one call.",
    icon: "tools",
    items: [
      "Water heater replacement",
      "Trash removal",
      "Sewage backups",
      "Property inspections",
      "Exterior maintenance",
      "Gutter cleaning",
      "Lawn care",
      "Snow removal",
    ],
  },
  {
    id: "locksmith",
    title: "Locksmith services",
    blurb: "Unlocks, lock changes, and smart keypads with upfront standard pricing.",
    icon: "key",
    items: [
      "House / unit unlocks",
      "Lock changes",
      "Lock combos",
      "Smart keypads",
      "Lock boxes",
      "Key duplication",
      "Property-management locksmith support",
    ],
  },
  {
    id: "chimney-care",
    title: "Chimney care",
    blurb: "Keep your fireplace safe and your chimney sealed against Michigan weather.",
    icon: "flame",
    items: [
      "Chimney cleaning",
      "Chimney cap installation & replacement",
      "Chimney liner cap service",
    ],
  },
  {
    id: "property-management",
    title: "Property management & investor services",
    blurb: "A reliable maintenance arm for landlords, property managers, and investors.",
    icon: "building-community",
    items: [
      "Unit turnovers",
      "Vacant property access",
      "Recurring maintenance",
      "Inspections",
      "Snow, lawn & gutter service",
      "Exterior upkeep",
      "Lock changes",
      "Maintenance coordination",
    ],
  },
];

export interface PriceItem {
  service: string;
  detail?: string;
  price: string;
}

/** Standard pricing from the KOM Locksmiths flyer. Final pricing may vary. */
export const locksmithPricing: PriceItem[] = [
  { service: "House / unit door unlock", detail: "Quick, damage-free entry for residential properties", price: "$129" },
  { service: "Change locks — 1 lock", price: "$179" },
  { service: "Change locks — 2 locks", price: "$279" },
  { service: "Change locks — 3 locks", price: "$349" },
  { service: "Lock combo", detail: "Deadbolt + handle", price: "$179" },
  { service: "Kwikset smart keypad", detail: "Keyless entry with authorized user codes", price: "$329" },
  { service: "Install lock box", price: "$129" },
  { service: "Key duplication", price: "$25" },
];

export const locksmithNotes = [
  "Standard pricing shown — final pricing may vary based on lock hardware, door condition, and service details.",
  "A 50% deposit is required before a technician is dispatched.",
  "Distance fee: jobs over 25 miles from our location add $50.",
  "B2B pricing available for management companies and real estate teams.",
];

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What areas do you serve?",
    answer:
      "We serve Metro Detroit, including communities across Wayne, Oakland, and Macomb counties. If you're not sure whether you're in our service area, call 313-804-0844 and we'll tell you right away. Locksmith jobs more than 25 miles from our location add a $50 distance fee.",
  },
  {
    question: "How much does locksmith service cost?",
    answer:
      "We publish standard pricing so there are no surprises: a house or unit door unlock is $129, changing locks starts at $179 for one lock, and key duplication is $25. Final pricing may vary based on your lock hardware and service details, and a 50% deposit is required before a technician is dispatched.",
  },
  {
    question: "I'm locked out right now. What do I do?",
    answer:
      "Call us at 313-804-0844. Lockouts are handled by phone so we can confirm your location, verify the property, and dispatch a technician after the 50% deposit.",
  },
  {
    question: "Do you work with property managers and landlords?",
    answer:
      "Yes — property management support is a core part of our business. We handle unit turnovers, vacant property access, lock changes, inspections, and recurring maintenance like snow, lawn, and gutter service. Tell us about your portfolio in the request form and we'll set up a plan.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Call 313-804-0844 or send the request form on this page with a few details about the work. We'll follow up to confirm the scope and give you a quote before any work starts.",
  },
  {
    question: "Can one crew really handle construction, maintenance, locksmith, and chimney work?",
    answer:
      "That's the point of KOM USA: one local team and one phone number for the trades most homes and rentals need. You skip juggling separate contractors, and we already know your property when the next job comes up.",
  },
];

export const howItWorks = [
  {
    title: "Tell us what you need",
    description:
      "Call 313-804-0844 or send the request form. A couple of details — city, service, urgency — is all it takes.",
    icon: "phone",
  },
  {
    title: "Get your quote and schedule",
    description:
      "We confirm the scope, give you clear pricing, and pick a time that works. Locksmith dispatch requires a 50% deposit.",
    icon: "calendar-check",
  },
  {
    title: "We do the work",
    description:
      "Our crew shows up, does the job right, and leaves the property ready — whether it's one repair or a full turnover.",
    icon: "circle-check",
  },
];

export const trustPoints = [
  {
    title: "One crew, every trade",
    description: "Build, fix, maintain, and secure — one call covers it.",
    icon: "tools",
  },
  {
    title: "Upfront standard pricing",
    description: "Locksmith prices published before you book.",
    icon: "clipboard-check",
  },
  {
    title: "Metro Detroit local",
    description: "Based here, serving Wayne, Oakland & Macomb counties.",
    icon: "map-pin",
  },
  {
    title: "Landlord & PM friendly",
    description: "Turnovers, access, and recurring service for portfolios.",
    icon: "building-community",
  },
];

export const serviceOptions = [
  "Construction & remodeling",
  "Property maintenance",
  "Locksmith service",
  "Chimney care",
  "Property management / investor services",
  "Something else",
];

export const urgencyOptions = [
  "Emergency — locked out now",
  "Urgent — within a few days",
  "Soon — within a few weeks",
  "Planning ahead — flexible",
];
