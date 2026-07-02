# KOM USA Lead-Capture Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the KOM USA site around the "share your info → we call → we quote and schedule" funnel, emulating the Mr. Handyman franchise layout with KOM's design system and three residential services (locksmith, water heaters, chimney care).

**Architecture:** Astro 5 static site in `site/` with Starwind UI components and Tailwind v4. All copy/pricing/business facts live in `site/src/data/business.ts`; section components render from it. Netlify Forms (`request-call` hero card + `request-service` contact page) capture leads. No test framework exists — the verification cycle per task is `npx astro build` (must pass) plus browser-preview checks in the final task.

**Tech Stack:** Astro 5, Tailwind v4, Starwind UI (`site/src/components/starwind/`), Tabler SVG icons (`@tabler/icons/outline/*.svg`), Netlify Forms, `astro:assets` Image.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-02-lead-capture-redesign-design.md` — binding.
- Phone `313-804-0844`, email `info@kom-usa.com` — only via `business` object, never hard-coded.
- Services: ONLY Locksmith, Water Heaters, Chimney Care. No construction, remodeling, property-maintenance plans, property management, investors, cleaning, memberships, Housecall Pro, listings.
- Pricing labels: "Standard pricing — we confirm your exact quote by phone." Locksmith: 50% deposit before dispatch, +$50 beyond 25 miles.
- Reviews: Google 4.7★ / 58 reviews, profile https://share.google/gfFHF6KBpnBz5FchG. Real quotes only (Jordan P, Kris R, Shannon P). Never invent reviews.
- Offer: "$10 Off Your First Service" — first-time customers, one per household, mention when we call, not combinable, no expiration.
- Credentials: "Licensed & insured" is approved copy. Hours: Mon–Sat 8:00am–6:00pm, Sun closed.
- Voice: friendly, plain, small-local-crew. First person plural. No franchise-speak.
- Design tokens (already in `global.css`): `kom-field`, `kom-field-hover`, `kom-sage`, `kom-sage-tint`, `kom-charcoal`, `kom-charcoal-deep`, `kom-ink`, `kom-cream`, `kom-warm-white`, `kom-tan`, `kom-brass`, `shadow-card`, `shadow-card-hover`, `section-pad`, `reveal`/`--rd`.
- Working dir for all commands: `site/`. Build check: `npx astro build`.
- The 8 uncommitted files from the prior restyle session are superseded by this work; commit them as part of the tasks that touch them.

---

### Task 1: Rewrite `business.ts` (single source of truth)

**Files:**
- Modify: `site/src/data/business.ts` (full rewrite)

**Interfaces:**
- Produces (consumed by all later tasks):
  - `business` — adds `hoursShort: string`, `hours: {days: string; time: string}[]`, `googleReviewsUrl`, keeps `name/legalName/tagline/phone/phoneHref/smsHref/email/emailHref/serviceArea/url`
  - `googleReviews: { url: string; rating: string; count: number; featured: { name: string; quote: string }[] }`
  - `offer: { headline: string; sub: string; terms: string[]; formValue: string }`
  - `services: ServiceDef[]` where `ServiceDef = { slug: string; title: string; shortTitle: string; icon: string; anchorPrice: string; blurb: string; heroIntro: string; includes: string[]; pricing: PriceItem[]; pricingNotes: string[]; faqs: Faq[] }`
  - `PriceItem = { service: string; detail?: string; price: string }`, `Faq = { question: string; answer: string }`
  - `faqs: Faq[]` (homepage), `trustPoints`, `howItWorks`, `serviceOptions: string[]`, `urgencyOptions: string[]`, `serviceAreaCities`, `serviceAreaCounties`
- Removes: `serviceCategories`, `exampleProjects`, `locksmithPricing`, `locksmithNotes` (locksmith pricing moves inside `services[0].pricing`)

- [ ] **Step 1: Replace file content**

```ts
/**
 * Single source of truth for KOM USA business facts.
 * Every component, meta tag, and schema entity reads from here —
 * never hard-code the phone number, email, prices, or service lists in templates.
 */

export const business = {
  name: "KOM USA",
  legalName: "KOM Construction LLC",
  tagline: "Locksmith, water heater, and chimney services in Metro Detroit",
  phone: "313-804-0844",
  phoneHref: "tel:+13138040844",
  smsHref: "sms:+13138040844",
  email: "info@kom-usa.com",
  emailHref: "mailto:info@kom-usa.com",
  serviceArea: "Metro Detroit",
  url: "https://www.kom.construction",
  hoursShort: "Mon–Sat 8am–6pm",
  googleReviewsUrl: "https://share.google/gfFHF6KBpnBz5FchG",
} as const;

export const hours = [
  { days: "Monday – Saturday", time: "8:00 am – 6:00 pm" },
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
  formValue: "$10 first-service offer claimed",
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
```

- [ ] **Step 2: Build to find all broken imports**

Run: `cd site && npx astro build 2>&1 | tail -30`
Expected: FAIL — components still import `serviceCategories`, `locksmithPricing`, `locksmithNotes`, `exampleProjects`. That failure list is the worklist for Tasks 2–5. Do NOT fix them here.

- [ ] **Step 3: Commit**

```bash
git add site/src/data/business.ts
git commit -m "Rewrite business data for 3-service lead-capture site"
```

(Build is red between Tasks 1 and 5 while consumers are rewritten — acceptable because each task's commit is content-complete and Task 5 restores green. Run the build at each task end to watch the error list shrink.)

---

### Task 2: Header and Footer for the new funnel

**Files:**
- Modify: `site/src/components/layout/Header.astro` (full rewrite of nav + utility bar; keep the existing mobile-toggle `<script>` block verbatim)
- Modify: `site/src/components/layout/Footer.astro`

**Interfaces:**
- Consumes: `business`, `hours`, `services` from Task 1
- Produces: header CTA links to `/contact`; nav Services dropdown links to `/services/<slug>`; page anchors `#lead-form` (hero card, Task 3)

- [ ] **Step 1: Header — replace utility bar content and nav data**

Utility bar (replace the "Now booking summer repairs…" line and keep the same wrapper markup/classes):

```astro
<p class="flex items-center gap-2">
  <span class="bg-kom-brass inline-block size-2 rounded-full" aria-hidden="true"></span>
  Locally owned & operated · Serving Metro Detroit
</p>
<p class="hidden items-center gap-1.5 text-white/90 sm:flex">
  {business.hoursShort} ·
  <a href={business.phoneHref} class="rounded-sm font-bold text-white transition-colors hover:text-kom-tan focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none">
    {business.phone}
  </a>
</p>
```

Nav data becomes:

```ts
import { business, services } from "../../data/business";

const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
// services rendered as a dropdown between Home and About
```

Desktop nav: render Home, then a Services dropdown, then About, Contact. Dropdown is CSS-only (hover + focus-within), same font classes as existing links:

```astro
<div class="group relative">
  <button type="button" class="text-kom-charcoal hover:text-kom-field flex items-center gap-1 rounded-sm text-sm font-extrabold transition-colors focus-visible:ring-3 focus-visible:ring-kom-field/50 focus-visible:outline-none" aria-haspopup="true">
    Services
    <ChevronDown class="size-4" aria-hidden="true" />
  </button>
  <div class="invisible absolute left-1/2 z-50 -translate-x-1/2 pt-3 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
    <ul class="border-border w-56 rounded-lg border bg-white p-2 shadow-card-hover">
      {services.map((service) => (
        <li>
          <a href={`/services/${service.slug}`} class="text-kom-charcoal hover:bg-kom-sage-tint hover:text-kom-field block rounded-md px-3 py-2.5 text-sm font-bold transition-colors focus-visible:ring-3 focus-visible:ring-kom-field/50 focus-visible:outline-none">
            {service.title}
          </a>
        </li>
      ))}
    </ul>
  </div>
</div>
```

(`import ChevronDown from "@tabler/icons/outline/chevron-down.svg";`)

Mobile menu list: Home, each service (`/services/<slug>` labeled by `service.title`), About, Contact — same `<li>` markup as current.

Primary header button becomes:

```astro
<Button href="/contact" variant="primary" size="sm" class="font-extrabold">
  <Phone aria-hidden="true" />
  Request a Call
</Button>
```

(swap `CalendarEvent` import for the already-imported `Phone`; drop `CalendarEvent`.)

- [ ] **Step 2: Footer — services, hours, licensed & insured**

In `Footer.astro`:
- Change import to `import { business, services, hours } from "../../data/business";`
- `quickLinks` becomes: Home `/`, About `/about`, Contact `/contact`, FAQ `/#faq`, Service area `/#service-area`.
- Services nav list renders `services.map` with `href={`/services/${service.slug}`}` and `{service.title}`.
- In the "Contact Us" column, after the MapPin `<li>`, add hours:

```astro
<li class="flex items-start gap-2.5 text-white/80">
  <Clock class="mt-0.5 size-4 shrink-0 text-kom-tan" aria-hidden="true" />
  <span>{hours.map((h) => `${h.days}: ${h.time}`).join(" · ")}</span>
</li>
```

(`import Clock from "@tabler/icons/outline/clock.svg";`)
- Fourth column: heading "Request a call", body copy "Locksmith, water heaters, and chimney care for Metro Detroit homes — tell us what you need and we'll call you back.", button label "Request a Call" with `href="/contact"`.
- Bottom bar right-hand `<p>` becomes: `Licensed & insured · Standard pricing shown on this site — we confirm your exact quote by phone.`

- [ ] **Step 3: Build check (expect only remaining consumers red)**

Run: `cd site && npx astro build 2>&1 | tail -20`
Expected: Header/Footer no longer in the error list; remaining errors reference sections/pages handled in Tasks 3–5.

- [ ] **Step 4: Commit**

```bash
git add site/src/components/layout/Header.astro site/src/components/layout/Footer.astro
git commit -m "Point header/footer at 3-service nav with contact funnel"
```

---

### Task 3: Hero with overlapping "Let Us Call You" card

**Files:**
- Create: `site/src/components/sections/LeadCallForm.astro`
- Modify: `site/src/components/sections/Hero.astro` (full rewrite)

**Interfaces:**
- Consumes: `business`, `googleReviews`, `serviceOptions` from Task 1
- Produces: `LeadCallForm` component with optional props `{ preselectService?: string; headline?: string }`, form `id="lead-form"`, Netlify form name `request-call`, hidden input `id="offer-field" name="offer"`. Used by Task 5 (service pages) and referenced by Task 4 (coupon script, CTA links to `/#lead-form`).

- [ ] **Step 1: Create `LeadCallForm.astro`**

```astro
---
import Button from "../starwind/button/Button.astro";
import Input from "../starwind/input/Input.astro";
import Label from "../starwind/label/Label.astro";
import { business, serviceOptions } from "../../data/business";

interface Props {
  preselectService?: string;
  headline?: string;
}

const { preselectService, headline = "Let us call you" } = Astro.props;

const selectClass =
  "border-input focus-visible:outline-outline flex h-11 w-full rounded-md border bg-white px-3 py-1 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-1";
---

<div id="lead-form" class="border-border scroll-mt-24 rounded-xl border bg-white p-6 shadow-card-hover sm:p-8">
  <h2 class="text-kom-field text-2xl font-black">{headline}</h2>
  <p class="text-muted-foreground mt-1 text-sm">
    Share a few details and a real person calls you back — usually the same day.
  </p>

  <form name="request-call" method="POST" action="/thank-you" data-netlify="true" netlify-honeypot="bot-field" class="mt-5">
    <input type="hidden" name="form-name" value="request-call" />
    <input type="hidden" name="subject" value="New call request — kom.construction" />
    <input type="hidden" id="offer-field" name="offer" value="" />
    <p class="hidden" aria-hidden="true">
      <label>Don't fill this out if you're human: <input name="bot-field" /></label>
    </p>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div class="space-y-1.5">
        <Label for="lead-name">First name <span class="text-error">*</span></Label>
        <Input type="text" id="lead-name" name="first-name" required autocomplete="given-name" placeholder="e.g. Sam" />
      </div>
      <div class="space-y-1.5">
        <Label for="lead-phone">Phone <span class="text-error">*</span></Label>
        <Input type="tel" id="lead-phone" name="phone" required autocomplete="tel" placeholder="(555) 555-5555" />
      </div>
      <div class="space-y-1.5">
        <Label for="lead-email">Email <span class="text-error">*</span></Label>
        <Input type="email" id="lead-email" name="email" required autocomplete="email" />
      </div>
      <div class="space-y-1.5">
        <Label for="lead-city">City or ZIP <span class="text-error">*</span></Label>
        <Input type="text" id="lead-city" name="city" required autocomplete="postal-code" placeholder="e.g. Warren or 48088" />
      </div>
      <div class="space-y-1.5">
        <Label for="lead-service">What do you need? <span class="text-error">*</span></Label>
        <select id="lead-service" name="service" required class={selectClass}>
          <option value="" disabled selected={!preselectService}>Choose a service</option>
          {serviceOptions.map((option) => (
            <option value={option} selected={option === preselectService}>{option}</option>
          ))}
        </select>
      </div>
      <div class="space-y-1.5">
        <Label for="lead-note">Anything else? <span class="text-muted-foreground font-normal">(optional)</span></Label>
        <Input type="text" id="lead-note" name="note" placeholder="e.g. no hot water since Tuesday" />
      </div>
    </div>

    <div class="mt-5 flex flex-col items-center gap-3 sm:flex-row">
      <Button type="submit" variant="primary" size="lg" class="w-full font-extrabold sm:w-auto">
        Request a Call
      </Button>
      <p class="text-muted-foreground text-xs">
        We'll only use this to call you about your request. Locked out right now?
        <a href={business.phoneHref} class="text-kom-field font-bold hover:underline">Call {business.phone}</a> — it's faster.
      </p>
    </div>
  </form>
</div>
```

- [ ] **Step 2: Rewrite `Hero.astro`**

Full-bleed house photo with charcoal overlay, headline/copy/rating left, and the form card overlapping the hero bottom:

```astro
---
import { Image } from "astro:assets";
import StarFilled from "@tabler/icons/star-filled.svg";
import Phone from "@tabler/icons/outline/phone.svg";

import Button from "../starwind/button/Button.astro";
import LeadCallForm from "./LeadCallForm.astro";
import { business, googleReviews } from "../../data/business";
import homeExterior from "../../assets/images/home-exterior.jpg";
---

<section class="relative">
  <div class="relative isolate overflow-hidden bg-kom-ink pb-40 lg:pb-48">
    <Image
      src={homeExterior}
      alt=""
      class="absolute inset-0 -z-10 h-full w-full object-cover"
      widths={[768, 1280, 1920]}
      sizes="100vw"
      loading="eager"
    />
    <div class="absolute inset-0 -z-10 bg-gradient-to-r from-kom-ink/90 via-kom-ink/70 to-kom-ink/30" aria-hidden="true"></div>

    <div class="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:pt-24">
      <div class="reveal max-w-2xl">
        <p class="text-kom-tan text-sm font-extrabold tracking-wider uppercase">
          Home services in {business.serviceArea}, MI
        </p>
        <h1 class="mt-3 text-4xl leading-[1.05] font-black tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
          A friendly local crew for locks, water heaters & chimneys
        </h1>
        <p class="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
          We're a small, locally owned Metro Detroit team. Tell us what you need,
          we'll call you back, talk it through, and take care of it — with our
          standard prices published right on this site.
        </p>

        <div class="mt-7 flex flex-wrap items-center gap-5">
          <a
            href={googleReviews.url}
            target="_blank"
            rel="noopener"
            class="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:ring-3 focus-visible:ring-white/50 focus-visible:outline-none"
          >
            <span class="text-3xl font-black text-white">{googleReviews.rating}</span>
            <span>
              <span class="flex text-kom-brass" aria-hidden="true">
                {Array.from({ length: 5 }).map(() => <StarFilled class="size-4" />)}
              </span>
              <span class="block text-xs font-bold text-white/85">
                {googleReviews.count} Google reviews
              </span>
            </span>
          </a>
          <Button href={business.phoneHref} variant="outline" size="lg" class="border-white/50 font-extrabold text-white hover:bg-white/10">
            <Phone aria-hidden="true" />
            {business.phone}
          </Button>
        </div>
      </div>
    </div>
  </div>

  <div class="mx-auto -mt-32 max-w-6xl px-4 sm:px-6 lg:-mt-36">
    <div class="reveal" style="--rd: 120ms">
      <LeadCallForm />
    </div>
  </div>
</section>
```

Note: verify the `StarFilled` import path — Tabler filled icons live at `@tabler/icons/filled/star.svg` in some versions; check `site/node_modules/@tabler/icons/` and use the path that exists.

- [ ] **Step 3: Build check**

Run: `cd site && npx astro build 2>&1 | tail -20`
Expected: Hero no longer errors (remaining errors are Task 4–5 consumers).

- [ ] **Step 4: Commit**

```bash
git add site/src/components/sections/Hero.astro site/src/components/sections/LeadCallForm.astro
git commit -m "Add hero with overlapping Let Us Call You lead form"
```

---

### Task 4: Homepage sections and assembly

**Files:**
- Create: `site/src/components/sections/IntroStrip.astro`
- Create: `site/src/components/sections/CouponOffer.astro`
- Create: `site/src/components/sections/GoogleReviews.astro`
- Create: `site/src/components/sections/CtaBand.astro`
- Modify: `site/src/components/sections/Services.astro` (full rewrite)
- Modify: `site/src/components/sections/WhyChooseUs.astro` (icon map + copy only)
- Modify: `site/src/components/sections/HowItWorks.astro` (icon map only, if `phone` icon missing)
- Modify: `site/src/pages/index.astro`
- Delete: `site/src/components/sections/PropertyManagement.astro`, `site/src/components/sections/LockoutBand.astro`, `site/src/components/sections/Testimonials.astro`
- Modify (sweep): `site/src/components/sections/Gallery.astro` — remove construction-specific captions; keep "Sample photo" labels; keep only images relevant to the three services + home exteriors (`home-exterior`, `door-lock`, `fireplace-chimney`, `worker-electrical`, `basement-interior`, `interior-renovation`)

**Interfaces:**
- Consumes: `services`, `offer`, `googleReviews`, `trustPoints`, `howItWorks`, `faqs`, `business` from Task 1; `#lead-form` + `#offer-field` from Task 3
- Produces: homepage section ids `#services`, `#offer`, `#reviews`, `#service-area` (existing), `#faq` (existing)

- [ ] **Step 1: Create `IntroStrip.astro`**

```astro
---
import { Image } from "astro:assets";
import SectionHeader from "../common/SectionHeader.astro";
import workerPortrait from "../../assets/images/worker-portrait.jpg";
---

<section class="section-pad bg-white">
  <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
    <div class="reveal">
      <SectionHeader
        align="left"
        eyebrow="Nice to meet you"
        title="Small crew. Straight answers. Your neighborhood."
        lead=""
      />
      <p class="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
        KOM USA is a locally owned Metro Detroit crew. We keep our services focused —
        locksmith work, water heaters, and chimney care — so we can do them well,
        publish our prices, and pick up the phone when you call. No call centers,
        no upsells, no mystery quotes.
      </p>
      <p class="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
        Send the form above and a real person calls you back to talk through your
        project and answer your questions. That's the whole process.
      </p>
    </div>
    <Image
      src={workerPortrait}
      alt="KOM USA technician ready to help"
      class="reveal h-full min-h-72 w-full rounded-xl object-cover shadow-card"
      style="--rd: 120ms"
      widths={[480, 720, 960]}
      sizes="(min-width: 1024px) 40vw, 100vw"
    />
  </div>
</section>
```

(Check `SectionHeader.astro` props during execution — if it has no `align` prop, wrap in a left-aligned variant or pass only supported props.)

- [ ] **Step 2: Rewrite `Services.astro`**

Three photo cards from `services` + one "Something else?" card. Images: `door-lock.jpg` (locksmith), `worker-electrical.jpg` (water heaters), `fireplace-chimney.jpg` (chimney care).

```astro
---
import { Image } from "astro:assets";
import ArrowRight from "@tabler/icons/outline/arrow-right.svg";
import Phone from "@tabler/icons/outline/phone.svg";

import SectionHeader from "../common/SectionHeader.astro";
import { business, services } from "../../data/business";
import doorLock from "../../assets/images/door-lock.jpg";
import workerElectrical from "../../assets/images/worker-electrical.jpg";
import fireplaceChimney from "../../assets/images/fireplace-chimney.jpg";

const imageMap: Record<string, ImageMetadata> = {
  locksmith: doorLock,
  "water-heaters": workerElectrical,
  "chimney-care": fireplaceChimney,
};
---

<section id="services" class="section-pad scroll-mt-16 bg-kom-cream">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <SectionHeader
      eyebrow="What we do"
      title="Three services, done right"
      lead="Flat, published pricing where we can. A fast, honest quote where the job needs one."
    />

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      {
        services.map((service, index) => (
          <a
            href={`/services/${service.slug}`}
            class="reveal border-border group flex flex-col overflow-hidden rounded-xl border bg-white shadow-card transition-shadow hover:shadow-card-hover focus-visible:ring-3 focus-visible:ring-kom-field/50 focus-visible:outline-none"
            style={`--rd: ${index * 90}ms`}
          >
            <Image
              src={imageMap[service.slug]}
              alt={service.title}
              class="h-48 w-full object-cover"
              widths={[400, 600, 800]}
              sizes="(min-width: 768px) 30vw, 100vw"
            />
            <span class="flex flex-1 flex-col p-6">
              <span class="bg-kom-sage-tint text-kom-field self-start rounded-full px-3 py-1 text-xs font-extrabold">
                {service.anchorPrice}
              </span>
              <span class="text-kom-charcoal-deep group-hover:text-kom-field mt-3 text-xl font-black transition-colors">
                {service.title}
              </span>
              <span class="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">{service.blurb}</span>
              <span class="text-kom-field mt-4 flex items-center gap-1.5 text-sm font-extrabold">
                See details & pricing
                <ArrowRight class="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </span>
          </a>
        ))
      }
    </div>

    <div class="reveal border-border mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border bg-white p-6 text-center shadow-card sm:flex-row sm:text-left" style="--rd: 270ms">
      <p class="text-kom-charcoal text-lg font-bold">
        Need something else around the house?
        <span class="text-muted-foreground block text-sm font-medium">Ask us — if we can't help, we'll say so honestly and point you the right way.</span>
      </p>
      <a href={business.phoneHref} class="bg-kom-field hover:bg-kom-field-hover inline-flex shrink-0 items-center gap-2 rounded-md px-5 py-2.5 text-sm font-extrabold text-white transition-colors focus-visible:ring-3 focus-visible:ring-kom-field/50 focus-visible:outline-none">
        <Phone class="size-4" aria-hidden="true" />
        Call {business.phone}
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Create `CouponOffer.astro`**

```astro
---
import Scissors from "@tabler/icons/outline/scissors.svg";
import { offer } from "../../data/business";
import logoWhite from "../../assets/logos/kom-usa-logo-white.svg";
---

<section id="offer" class="section-pad scroll-mt-16 bg-white">
  <div class="mx-auto max-w-3xl px-4 sm:px-6">
    <div class="reveal overflow-hidden rounded-xl shadow-card-hover">
      <div class="bg-kom-field p-8 text-white sm:p-10">
        <img src={logoWhite.src} alt="KOM USA" class="h-10 w-auto" width="68" height="50" />
        <p class="mt-6 text-5xl font-black sm:text-6xl">{offer.headline}</p>
        <p class="mt-2 text-xl font-bold text-white/95">{offer.sub}</p>
        <div class="mt-6 border-t-2 border-dashed border-white/40 pt-5" aria-hidden="true"></div>
        <ul class="space-y-1 text-sm leading-relaxed text-white/85">
          {offer.terms.map((term) => <li>{term}</li>)}
        </ul>
      </div>
      <button
        type="button"
        id="claim-offer"
        class="bg-kom-brass text-kom-ink flex w-full items-center justify-center gap-2 px-6 py-4 text-lg font-black tracking-wide uppercase transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-kom-field/50 focus-visible:outline-none"
      >
        <Scissors class="size-5" aria-hidden="true" />
        Claim Offer
      </button>
    </div>
  </div>
</section>

<script>
  import { offerFormValue } from "../../data/offer-client";

  document.getElementById("claim-offer")?.addEventListener("click", () => {
    const field = document.getElementById("offer-field") as HTMLInputElement | null;
    if (field) field.value = offerFormValue;
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
    (document.getElementById("lead-name") as HTMLInputElement | null)?.focus({ preventScroll: true });
  });
</script>
```

Also create `site/src/data/offer-client.ts` so the client script doesn't pull the whole business module into the bundle:

```ts
/** Client-side mirror of offer.formValue — keep in sync with business.ts. */
export const offerFormValue = "$10 first-service offer claimed";
```

- [ ] **Step 4: Create `GoogleReviews.astro`**

```astro
---
import StarFilled from "@tabler/icons/star-filled.svg";
import ExternalLink from "@tabler/icons/outline/external-link.svg";

import SectionHeader from "../common/SectionHeader.astro";
import { googleReviews } from "../../data/business";
---

<section id="reviews" class="section-pad scroll-mt-16 bg-kom-warm-white">
  <div class="mx-auto max-w-6xl px-4 sm:px-6">
    <SectionHeader
      eyebrow="Reviews"
      title="What your neighbors say"
      lead=""
    />

    <p class="reveal mt-6 flex items-center justify-center gap-3">
      <span class="text-kom-charcoal-deep text-5xl font-black">{googleReviews.rating}</span>
      <span>
        <span class="flex text-kom-brass" aria-hidden="true">
          {Array.from({ length: 5 }).map(() => <StarFilled class="size-5" />)}
        </span>
        <a href={googleReviews.url} target="_blank" rel="noopener" class="text-kom-field mt-1 block text-sm font-extrabold hover:underline">
          {googleReviews.count} reviews on Google
        </a>
      </span>
    </p>

    <div class="mt-10 grid gap-6 md:grid-cols-3">
      {
        googleReviews.featured.map((review, index) => (
          <figure class="reveal border-border flex flex-col rounded-xl border bg-white p-6 shadow-card" style={`--rd: ${index * 90}ms`}>
            <span class="flex text-kom-brass" aria-hidden="true">
              {Array.from({ length: 5 }).map(() => <StarFilled class="size-4" />)}
            </span>
            <blockquote class="text-kom-charcoal mt-4 flex-1 text-sm leading-relaxed">
              “{review.quote}”
            </blockquote>
            <figcaption class="text-kom-charcoal-deep mt-4 text-sm font-extrabold">
              {review.name}
              <span class="text-muted-foreground block text-xs font-medium">Google review</span>
            </figcaption>
          </figure>
        ))
      }
    </div>

    <p class="reveal mt-8 text-center">
      <a href={googleReviews.url} target="_blank" rel="noopener" class="text-kom-field inline-flex items-center gap-1.5 text-sm font-extrabold hover:underline focus-visible:ring-3 focus-visible:ring-kom-field/50 focus-visible:outline-none">
        Read all {googleReviews.count} reviews on Google
        <ExternalLink class="size-4" aria-hidden="true" />
      </a>
    </p>
  </div>
</section>
```

- [ ] **Step 5: Create `CtaBand.astro`**

```astro
---
import Phone from "@tabler/icons/outline/phone.svg";
import Button from "../starwind/button/Button.astro";
import { business } from "../../data/business";
---

<section class="bg-kom-field">
  <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-12 text-center sm:px-6 lg:flex-row lg:text-left">
    <div>
      <h2 class="text-2xl font-black text-white sm:text-3xl">Ready when you are.</h2>
      <p class="mt-1 text-white/85">Share your info and we'll call you back — or skip the form and call now.</p>
    </div>
    <div class="flex flex-wrap justify-center gap-3">
      <Button href="/#lead-form" size="lg" class="bg-white font-extrabold text-kom-field hover:bg-kom-cream">
        Request a Call
      </Button>
      <Button href={business.phoneHref} variant="outline" size="lg" class="border-white/60 font-extrabold text-white hover:bg-white/10">
        <Phone aria-hidden="true" />
        {business.phone}
      </Button>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Update `WhyChooseUs.astro` and `HowItWorks.astro` icon maps**

Both render from `trustPoints` / `howItWorks` data. New icon names used: `home-heart`, `shield-check`, `phone`, `clipboard-check`, `message-circle`, `calendar-check`. Update each component's icon map/imports to cover them (Tabler outline icons of the same names exist for all six). Remove now-unused icons (`building-community`, `tools`, `hammer`, `map-pin`) if no longer referenced.

- [ ] **Step 7: Rewrite `index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";

import Hero from "../components/sections/Hero.astro";
import IntroStrip from "../components/sections/IntroStrip.astro";
import Services from "../components/sections/Services.astro";
import CouponOffer from "../components/sections/CouponOffer.astro";
import GoogleReviews from "../components/sections/GoogleReviews.astro";
import WhyChooseUs from "../components/sections/WhyChooseUs.astro";
import HowItWorks from "../components/sections/HowItWorks.astro";
import ServiceArea from "../components/sections/ServiceArea.astro";
import Gallery from "../components/sections/Gallery.astro";
import Faq from "../components/sections/Faq.astro";
import CtaBand from "../components/sections/CtaBand.astro";
---

<BaseLayout
  title="Locksmith, Water Heaters & Chimney Care in Metro Detroit | KOM USA"
  description="KOM USA is a friendly, locally owned crew for locksmith service, water heater replacement, and chimney care across Metro Detroit. Upfront pricing — request a call and we'll take it from there."
  includeBusinessGraph
>
  <Hero />
  <IntroStrip />
  <Services />
  <CouponOffer />
  <GoogleReviews />
  <WhyChooseUs />
  <HowItWorks />
  <ServiceArea />
  <Gallery />
  <Faq />
  <CtaBand />
</BaseLayout>
```

- [ ] **Step 8: Delete dead sections and sweep references**

```bash
rm site/src/components/sections/PropertyManagement.astro \
   site/src/components/sections/LockoutBand.astro \
   site/src/components/sections/Testimonials.astro
grep -rn "PropertyManagement\|LockoutBand\|Testimonials\|property-management\|#request-service" site/src --include="*.astro" --include="*.ts"
```

Fix every hit: anchors `#request-service` → `/#lead-form` (or `/contact` where a page link fits better, e.g. `FloatingContact`, `MobileStickyBar`). Remove PM copy in `Gallery.astro` captions and `RequestService.astro` aside (fully reworked in Task 6).

- [ ] **Step 9: Build check**

Run: `cd site && npx astro build 2>&1 | tail -20`
Expected: only `/locksmith` page + `RequestService`-related errors remain (Tasks 5–6). If green already, better.

- [ ] **Step 10: Commit**

```bash
git add -A site/src
git commit -m "Rebuild homepage as lead-capture funnel with coupon and Google reviews"
```

---

### Task 5: Service pages and redirects

**Files:**
- Create: `site/src/layouts/ServicePage.astro`
- Create: `site/src/pages/services/locksmith.astro`
- Create: `site/src/pages/services/water-heaters.astro`
- Create: `site/src/pages/services/chimney-care.astro`
- Delete: `site/src/pages/locksmith.astro`
- Modify: `site/public/_redirects` (create if missing)

**Interfaces:**
- Consumes: `services`, `business`, `pricingDisclaimer` (Task 1), `LeadCallForm` with `preselectService` (Task 3), `CtaBand` (Task 4)
- Produces: routes `/services/locksmith`, `/services/water-heaters`, `/services/chimney-care`; layout props `{ service: ServiceDef; heroImage: ImageMetadata; heroAlt: string; metaTitle: string; metaDescription: string; preselectService: string }`

- [ ] **Step 1: Create `ServicePage.astro` layout**

```astro
---
import { Image } from "astro:assets";
import Check from "@tabler/icons/outline/check.svg";
import Phone from "@tabler/icons/outline/phone.svg";
import ChevronDown from "@tabler/icons/outline/chevron-down.svg";

import BaseLayout from "./BaseLayout.astro";
import Button from "../components/starwind/button/Button.astro";
import LeadCallForm from "../components/sections/LeadCallForm.astro";
import { business, type ServiceDef } from "../data/business";

interface Props {
  service: ServiceDef;
  heroImage: ImageMetadata;
  heroAlt: string;
  metaTitle: string;
  metaDescription: string;
  preselectService: string;
}

const { service, heroImage, heroAlt, metaTitle, metaDescription, preselectService } = Astro.props;
---

<BaseLayout title={metaTitle} description={metaDescription}>
  <section class="bg-kom-cream">
    <div class="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
      <div class="reveal">
        <p class="text-kom-field text-sm font-extrabold tracking-wider uppercase">
          {business.serviceArea} · Residential
        </p>
        <h1 class="text-kom-charcoal-deep mt-3 text-4xl leading-[1.05] font-black tracking-tight text-balance sm:text-5xl">
          {service.title}
        </h1>
        <p class="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed">{service.heroIntro}</p>
        <div class="mt-7 flex flex-wrap gap-3">
          <Button href="#lead-form" variant="primary" size="lg" class="font-extrabold">Request a Call</Button>
          <Button href={business.phoneHref} variant="outline" size="lg" class="border-kom-field/40 font-extrabold text-kom-field hover:bg-kom-sage-tint">
            <Phone aria-hidden="true" />
            {business.phone}
          </Button>
        </div>
      </div>
      <Image
        src={heroImage}
        alt={heroAlt}
        class="reveal h-full min-h-72 w-full rounded-xl object-cover shadow-card-hover"
        style="--rd: 120ms"
        widths={[520, 760, 1000]}
        sizes="(min-width: 1024px) 45vw, 100vw"
        loading="eager"
      />
    </div>
  </section>

  <section class="section-pad bg-white">
    <div class="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="reveal">
        <h2 class="text-kom-charcoal-deep text-2xl font-black sm:text-3xl">What we handle</h2>
        <ul class="mt-6 space-y-3">
          {service.includes.map((item) => (
            <li class="flex items-start gap-3">
              <span class="bg-kom-sage-tint text-kom-field mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                <Check class="size-4" aria-hidden="true" />
              </span>
              <span class="text-kom-charcoal font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div class="reveal" id="pricing" style="--rd: 90ms">
        <h2 class="text-kom-charcoal-deep text-2xl font-black sm:text-3xl">Standard pricing</h2>
        <div class="border-border mt-6 overflow-hidden rounded-xl border shadow-card">
          <table class="w-full text-left text-sm">
            <caption class="sr-only">{service.title} standard pricing</caption>
            <tbody>
              {service.pricing.map((item, index) => (
                <tr class={index % 2 === 0 ? "bg-white" : "bg-kom-cream/60"}>
                  <th scope="row" class="px-4 py-3.5 font-bold text-kom-charcoal">
                    {item.service}
                    {item.detail && <span class="text-muted-foreground block text-xs font-medium">{item.detail}</span>}
                  </th>
                  <td class="text-kom-field px-4 py-3.5 text-right font-black whitespace-nowrap">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul class="text-muted-foreground mt-4 space-y-1.5 text-xs leading-relaxed">
          {service.pricingNotes.map((note) => <li>{note}</li>)}
        </ul>
      </div>
    </div>
  </section>

  <section class="section-pad bg-kom-warm-white">
    <div class="mx-auto max-w-3xl px-4 sm:px-6">
      <h2 class="text-kom-charcoal-deep text-center text-2xl font-black sm:text-3xl">Common questions</h2>
      <div class="mt-8 space-y-3">
        {service.faqs.map((faq) => (
          <details class="reveal border-border group rounded-lg border bg-white shadow-card">
            <summary class="text-kom-charcoal flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-bold [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown class="size-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p class="text-muted-foreground border-t px-5 py-4 text-sm leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>

  <section class="section-pad bg-white">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <LeadCallForm preselectService={preselectService} headline={`Get your ${service.shortTitle.toLowerCase()} quote`} />
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Create the three pages**

`site/src/pages/services/locksmith.astro`:

```astro
---
import ServicePage from "../../layouts/ServicePage.astro";
import { services } from "../../data/business";
import doorLock from "../../assets/images/door-lock.jpg";

const service = services.find((s) => s.slug === "locksmith")!;
---

<ServicePage
  service={service}
  heroImage={doorLock}
  heroAlt="Residential door lock being serviced"
  metaTitle="Locksmith in Metro Detroit — Upfront Pricing | KOM USA"
  metaDescription="House unlocks $129, lock changes from $179, smart keypads $329 — published locksmith pricing for Metro Detroit homes. Request a call from KOM USA."
  preselectService="Locksmith"
/>
```

`site/src/pages/services/water-heaters.astro`:

```astro
---
import ServicePage from "../../layouts/ServicePage.astro";
import { services } from "../../data/business";
import workerElectrical from "../../assets/images/worker-electrical.jpg";

const service = services.find((s) => s.slug === "water-heaters")!;
---

<ServicePage
  service={service}
  heroImage={workerElectrical}
  heroAlt="Technician working on a residential water heater installation"
  metaTitle="Water Heater Replacement from $1,750 Installed | KOM USA"
  metaDescription="Electric, gas, and power-vent water heater replacement for Metro Detroit homes — installed pricing from $1,750. Request a call and we'll quote it by phone."
  preselectService="Water heater"
/>
```

`site/src/pages/services/chimney-care.astro`:

```astro
---
import ServicePage from "../../layouts/ServicePage.astro";
import { services } from "../../data/business";
import fireplaceChimney from "../../assets/images/fireplace-chimney.jpg";

const service = services.find((s) => s.slug === "chimney-care")!;
---

<ServicePage
  service={service}
  heroImage={fireplaceChimney}
  heroAlt="Brick fireplace and chimney in a Metro Detroit home"
  metaTitle="Chimney Cleaning $299 & Caps | Metro Detroit | KOM USA"
  metaDescription="Chimney cleaning $299 (up to 35 ft), caps $329, liner caps $289 — flat published pricing for Metro Detroit homes from KOM USA. Request a call today."
  preselectService="Chimney care"
/>
```

- [ ] **Step 3: Delete old page, add redirect**

```bash
rm site/src/pages/locksmith.astro
```

Append to `site/public/_redirects` (create the file if it doesn't exist):

```
/locksmith            /services/locksmith        301
/locksmith/           /services/locksmith        301
```

- [ ] **Step 4: Build check — must now be GREEN**

Run: `cd site && npx astro build 2>&1 | tail -20`
Expected: PASS. If `RequestService.astro` still errors on removed exports, apply Task 6 Step 1 first, then re-run.

- [ ] **Step 5: Commit**

```bash
git add -A site/src/pages site/src/layouts site/public/_redirects
git commit -m "Add service pages with published pricing; redirect /locksmith"
```

---

### Task 6: Contact page

**Files:**
- Modify: `site/src/components/sections/RequestService.astro` (rework: remove PM `<details>` block and PM aside copy; add urgency select — already present — and hours card)
- Create: `site/src/pages/contact.astro`
- Verify: `site/src/pages/thank-you.astro` copy matches the "we'll call you" promise

**Interfaces:**
- Consumes: `business`, `hours`, `serviceOptions`, `urgencyOptions`, `howItWorks` (Task 1)
- Produces: route `/contact` with Netlify form `request-service`

- [ ] **Step 1: Rework `RequestService.astro`**

Keep the overall two-column layout, form name `request-service`, honeypot, and field markup. Changes:
1. Remove the entire `<details>` property-manager block and the aside paragraph "Property manager or investor? …".
2. Replace that aside paragraph with an hours card (same card markup as the phone/email cards, `Clock` icon):

```astro
<div class="border-border flex items-center gap-4 rounded-lg border bg-white p-5 shadow-card">
  <span class="bg-kom-sage-tint text-primary flex size-12 shrink-0 items-center justify-center rounded-lg">
    <Clock class="size-6" aria-hidden="true" />
  </span>
  <span>
    <span class="text-muted-foreground block text-xs font-bold tracking-wider uppercase">Hours</span>
    <span class="text-kom-charcoal block text-lg font-extrabold">{business.hoursShort}</span>
  </span>
</div>
```

3. Add a "Preferred contact time" select after the urgency select (options: `"Morning (8–11)"`, `"Midday (11–2)"`, `"Afternoon (2–6)"`, `"Any time"`, name `preferred-time`, not required).
4. SectionHeader lead becomes: `"Send a few details and we'll call you back — usually the same business day — to talk it through and give you a quote."`
5. Update imports: drop `ChevronDown`, add `Clock`; import `hours` if used.

- [ ] **Step 2: Create `contact.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import RequestService from "../components/sections/RequestService.astro";
import HowItWorks from "../components/sections/HowItWorks.astro";
import ServiceArea from "../components/sections/ServiceArea.astro";
---

<BaseLayout
  title="Request a Call | KOM USA — Metro Detroit Home Services"
  description="Tell us what you need and a real person from KOM USA calls you back — usually the same day. Locksmith, water heaters, and chimney care across Metro Detroit."
>
  <RequestService />
  <HowItWorks />
  <ServiceArea />
</BaseLayout>
```

- [ ] **Step 3: Check `thank-you.astro`**

Read it; ensure copy says a person will call them back (adjust one sentence if it references "quote by email" or old services). Keep `noindex`.

- [ ] **Step 4: Build + commit**

Run: `cd site && npx astro build 2>&1 | tail -5` — Expected: PASS

```bash
git add -A site/src
git commit -m "Add contact page with reworked residential request form"
```

---

### Task 7: About page, floating CTAs, SEO schema

**Files:**
- Modify: `site/src/pages/about.astro` (copy rewrite to 3-service friendly positioning; keep page structure)
- Modify: `site/src/components/layout/FloatingContact.astro`, `site/src/components/layout/MobileStickyBar.astro` (CTA targets → `tel:` + `/contact`; labels "Call" / "Request a Call"; remove any PM/locksmith-page references)
- Modify: `site/src/components/seo/Seo.astro` (LocalBusiness graph)

**Interfaces:**
- Consumes: `business`, `hours`, `googleReviews`, `services` (Task 1)

- [ ] **Step 1: About page copy**

Read `about.astro`, keep its layout components, and replace copy so the page tells this story (three short sections):
1. *Who we are:* "KOM USA is a small, locally owned crew based in Detroit. We started in construction and property upkeep, and over the years the jobs our neighbors kept calling about were locks, water heaters, and chimneys — so that's what we do, and we do it well."
2. *How we work:* the call-back funnel — form → phone call → quote → schedule; upfront published pricing; licensed & insured.
3. *Where we work:* Metro Detroit / three counties, with the city list.
Remove every mention of remodeling/construction/property management as current offerings (the origin-story mention above is the only allowed reference). End with `CtaBand`.

- [ ] **Step 2: Floating CTAs**

In `FloatingContact.astro` and `MobileStickyBar.astro`: primary action `business.phoneHref` ("Call"), secondary `/contact` ("Request a Call"). Remove links to `/#request-service` or `/locksmith`.

- [ ] **Step 3: SEO schema in `Seo.astro`**

Read the file first. In the `includeBusinessGraph` JSON-LD:
- `@type`: `["LocalBusiness", "Locksmith"]`, name/phone/email from `business`
- `openingHoursSpecification`: Mo–Sa 08:00–18:00
- `aggregateRating`: `{ "@type": "AggregateRating", "ratingValue": "4.7", "reviewCount": "58" }` with `sameAs`/review URL `business.googleReviewsUrl`
- `makesOffer` / `hasOfferCatalog` listing the three services by title
- Remove construction/PM service mentions.

- [ ] **Step 4: Build + commit**

Run: `cd site && npx astro build 2>&1 | tail -5` — Expected: PASS

```bash
git add -A site/src
git commit -m "Refresh about page, floating CTAs, and LocalBusiness schema"
```

---

### Task 8: Full verification pass

**Files:** none new — fixes only.

- [ ] **Step 1: Clean build**

Run: `cd site && npx astro build`
Expected: PASS, pages emitted: `/`, `/about`, `/contact`, `/services/locksmith`, `/services/water-heaters`, `/services/chimney-care`, `/thank-you`, `/404`.

- [ ] **Step 2: Grep for leftovers**

```bash
grep -rni "property.manage\|investor\|remodel\|construction crew\|turnover\|lockout band\|housecall\|cleaning service\|membership" site/src --include="*.astro" --include="*.ts"
```

Expected: no hits except `business.legalName` ("KOM Construction LLC"), the about-page origin sentence, and the `url` domain. Fix anything else.

- [ ] **Step 3: Browser preview**

Start dev server (`preview_start` with launch.json entry running `npx astro dev` in `site/`, port 4321). Verify with preview tools:
- `/` snapshot: hero headline, rating badge "4.7", form card fields, services grid (3 cards + ask card), coupon "$10 Off", reviews section, FAQ, CTA band
- Click "Claim Offer" → page scrolls to form; `preview_eval` → `document.getElementById("offer-field").value` equals `"$10 first-service offer claimed"`
- `/services/water-heaters` snapshot: pricing table shows "from $1,750"
- Header dropdown: hover/focus shows 3 service links; mobile viewport (375px): sticky bar + menu works
- Forms markup: both forms have `data-netlify="true"` + `form-name` hidden inputs
- No console errors
- Dark screenshot NOT needed (site is light-only)

- [ ] **Step 4: Final commit + wrap-up notes**

```bash
git add -A
git commit -m "Verification fixes for lead-capture redesign"
```

Report to owner: Netlify Forms detection must be enabled in the Netlify UI for the NEW form name `request-call` (plus existing `request-service`); deploy via `npx netlify deploy --prod` from `site/` remains manual; Google profile hours (closes 9pm) differ from site hours (Mon–Sat 8–6) — owner should align them; update memory file with new site structure.
