/**
 * Code-owned service content for the three residential services.
 *
 * This is the single source of truth for service pages and the homepage
 * "Services" section until the Sanity CMS is wired (Phase B), at which point
 * this same data seeds Sanity. Pricing disclaimers and the locksmith
 * deposit/distance guardrails are NOT stored here — they live in
 * `business.ts` (`pricingDisclaimer`, `serviceGuardrails`) and are appended by
 * the ServicePage layout so a CMS editor can never remove them.
 */

import type { PriceItem, Faq } from "./business";

export interface ServiceDef {
  slug: "locksmith" | "water-heaters" | "chimney-care";
  title: string;
  shortTitle: string;
  /** Short price teaser shown on the homepage service card. */
  anchorPrice: string;
  /** Homepage card blurb. */
  blurb: string;
  heroIntro: string;
  includes: string[];
  pricing: PriceItem[];
  /** Optional editor-facing note shown under the pricing table, in addition to
   *  the code-owned disclaimer and guardrails. */
  pricingNote?: string;
  faqs: Faq[];
  seoTitle: string;
  seoDescription: string;
  heroAlt: string;
  /** Value preselected in the lead form on this service page. */
  preselectService: string;
}

export const services: ServiceDef[] = [
  {
    slug: "locksmith",
    title: "Locksmith Services",
    shortTitle: "Locksmith",
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
    seoTitle: "Locksmith in Metro Detroit — Upfront Pricing | KOM USA",
    seoDescription:
      "House unlocks $129, lock changes from $179, smart keypads $329 — published locksmith pricing for Metro Detroit homes. Request a call from KOM USA.",
    heroAlt: "Residential door lock being serviced",
    preselectService: "Locksmith",
  },
  {
    slug: "water-heaters",
    title: "Water Heater Replacement",
    shortTitle: "Water Heaters",
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
    pricingNote:
      "Starting prices include standard installation. Your exact quote depends on the model and your home's setup — we confirm it on the call before scheduling.",
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
    seoTitle: "Water Heater Replacement from $1,750 Installed | KOM USA",
    seoDescription:
      "Electric, gas, and power-vent water heater replacement for Metro Detroit homes — installed pricing from $1,750. Request a call and we'll quote it by phone.",
    heroAlt: "Technician working on a residential water heater installation",
    preselectService: "Water heater",
  },
  {
    slug: "chimney-care",
    title: "Chimney Care",
    shortTitle: "Chimney Care",
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
    seoTitle: "Chimney Cleaning $299 & Caps | Metro Detroit | KOM USA",
    seoDescription:
      "Chimney cleaning $299 (up to 35 ft), caps $329, liner caps $289 — flat published pricing for Metro Detroit homes from KOM USA. Request a call today.",
    heroAlt: "Brick fireplace and chimney in a Metro Detroit home",
    preselectService: "Chimney care",
  },
];

export function getService(slug: string): ServiceDef | undefined {
  return services.find((s) => s.slug === slug);
}
