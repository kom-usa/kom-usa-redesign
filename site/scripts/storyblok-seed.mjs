// Idempotently seeds Storyblok with the current services, FAQs, and starter
// content. Content for services and FAQs is copied verbatim from
// ../src/data/business.ts (the authoritative source at seed time).
// Run: node scripts/storyblok-seed.mjs
import { mapi } from './storyblok-lib.mjs';

const folderIds = {};
for (const s of (await mapi('GET', '/stories/?folder_only=1&per_page=100')).stories) {
  folderIds[s.slug] = s.id;
}
const existingSlugs = new Set();
let page = 1;
while (true) {
  const res = await mapi('GET', `/stories/?per_page=100&page=${page}`);
  res.stories.forEach((s) => existingSlugs.add(s.full_slug ?? s.slug));
  if (res.stories.length < 100) break;
  page += 1;
}

async function seed(folderSlug, slug, name, content, { publish = true } = {}) {
  const full = `${folderSlug}/${slug}`;
  if (existingSlugs.has(full) || existingSlugs.has(slug)) {
    console.log(`exists, skipping: ${full}`);
    return;
  }
  await mapi('POST', `/stories/${publish ? '?publish=1' : ''}`, {
    story: { name, slug, parent_id: folderIds[folderSlug], content },
    ...(publish ? { publish: 1 } : {}),
  });
  console.log(`${publish ? 'published' : 'drafted'}: ${full}`);
}

const li = (textVal) => ({ component: 'list_item', text: textVal });
const row = (n, d, p) => ({ component: 'price_row', name: n, detail: d ?? '', price: p });
const qa = (q, a) => ({ component: 'faq_item', question: q, answer: a });
const rt = (paragraphs) => ({
  type: 'doc',
  content: paragraphs.map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p }] })),
});

// SERVICES — copied verbatim from the `services` array in ../src/data/business.ts.
// pricing_note gets ONLY the water-heater "starting prices include installation…"
// line; the generic disclaimer and locksmith deposit/distance lines stay
// code-side and are NOT seeded.
await seed('services', 'locksmith', 'Locksmith Services', {
  component: 'service',
  title: 'Locksmith Services',
  short_title: 'Locksmith',
  anchor_price: 'Unlocks from $129',
  card_blurb:
    'Locked out, moving in, or ready for a keypad? Fast, damage-free residential locksmith work with prices published up front.',
  hero_intro:
    "Whether you're locked out right now or planning new locks for a new home, we handle it quickly and treat your door like our own. Our standard prices are published below, so you know what to expect before we ever pick up a tool.",
  includes: [
    li('House and unit door unlocks'),
    li('Lock changes and rekeying'),
    li('Deadbolt and handle combos'),
    li('Kwikset smart keypad installation'),
    li('Lock box installation'),
    li('Key duplication'),
  ],
  pricing: [
    row('House door unlock', 'Quick, damage-free entry', '$129'),
    row('Change locks — 1 lock', undefined, '$179'),
    row('Change locks — 2 locks', undefined, '$279'),
    row('Change locks — 3 locks', undefined, '$349'),
    row('Change locks — 4+ locks', undefined, '$65 per lock'),
    row('Lock combo', 'Deadbolt + handle', '$179'),
    row('Kwikset smart keypad', 'Keyless entry with user codes', '$329'),
    row('Lock box', '$79 when added to another service', '$129'),
    row('Key duplication', '$10 each additional copy', '$25'),
  ],
  pricing_note: '',
  faqs: [
    qa(
      "I'm locked out right now. What do I do?",
      "Call us at 313-804-0844 — that's faster than the form. We confirm your location, verify the property is yours, and dispatch a technician after the 50% deposit.",
    ),
    qa(
      'Will unlocking my door damage it?',
      "No — our standard unlock is damage-free. If your lock is broken or worn out, we'll tell you before doing anything and give you the price to replace it.",
    ),
    qa(
      'Can you install a keypad so I can stop carrying keys?',
      'Yes. We install Kwikset smart keypads for $329, set up your codes with you, and show you how to add or remove users.',
    ),
  ],
  seo_description:
    'Residential locksmith service in Metro Detroit — unlocks, lock changes, rekeying, and smart keypad installation with published starting prices.',
});

await seed('services', 'water-heaters', 'Water Heater Replacement', {
  component: 'service',
  title: 'Water Heater Replacement',
  short_title: 'Water Heaters',
  anchor_price: 'From $1,750 installed',
  card_blurb:
    'No hot water? We replace electric, gas, and power-vent water heaters with straightforward installed pricing.',
  hero_intro:
    "A failing water heater doesn't wait, so neither do we. Tell us what you have and we'll recommend the right replacement, give you one installed price on the call, and get your hot water back.",
  includes: [
    li('Electric water heater replacement (30–40 gallon)'),
    li('Gas water heater replacement (40–50 gallon)'),
    li('Power-vent gas water heater replacement'),
    li("Help choosing the right size and type for your home"),
  ],
  pricing: [
    row('Electric water heater', '30–40 gallon, installed', 'from $1,750'),
    row('Gas water heater', '40 gallon, installed', 'from $1,850'),
    row('Gas water heater', '50 gallon, installed', 'from $2,300'),
    row('Power-vent gas water heater', '40 gallon, installed', 'from $2,850'),
  ],
  pricing_note:
    "Starting prices include standard installation. Your exact quote depends on the model and your home's setup — we confirm it on the call before scheduling.",
  faqs: [
    qa(
      'How do I know if I need a replacement or a repair?',
      "If your water heater is leaking from the tank, over 10 years old, or not keeping up anymore, replacement usually beats repair. Not sure? Send the form — we'll talk it through on the call at no charge.",
    ),
    qa(
      'What sizes do you install?',
      "We install 30–50 gallon electric and gas units, including power-vent models. We'll match the size and type to what your home already has, or recommend a change if it makes sense.",
    ),
    qa(
      'Does the price include installation?',
      'Yes — the starting prices shown are installed prices, not tank-only. We confirm your exact quote by phone once we know the model and your setup.',
    ),
  ],
  seo_description:
    'Water heater replacement in Metro Detroit — electric, gas, and power-vent units with installed pricing starting at $1,750.',
});

await seed('services', 'chimney-care', 'Chimney Care', {
  component: 'service',
  title: 'Chimney Care',
  short_title: 'Chimney Care',
  anchor_price: 'Cleaning $299',
  card_blurb:
    'Keep your fireplace safe and your chimney sealed against Michigan weather — cleaning, caps, and liner caps at flat prices.',
  hero_intro:
    'A clean, capped chimney burns safer and keeps water, ice, and critters out. We publish our chimney prices flat-out, so scheduling your yearly cleaning is one quick call.',
  includes: [
    li('Chimney cleaning and sweep'),
    li('Chimney cap installation and replacement'),
    li('Chimney liner cap installation'),
    li('Visual condition check with every cleaning'),
  ],
  pricing: [
    row('Chimney cleaning', 'Up to 35 feet', '$299'),
    row('Additional height', 'Beyond 35 feet', '+$6 per ft'),
    row('Chimney cap', 'Supplied and installed', '$329'),
    row('Liner cap', 'Supplied and installed', '$289'),
  ],
  pricing_note: '',
  faqs: [
    qa(
      'How often should my chimney be cleaned?',
      "Once a year if you use your fireplace regularly — ideally before burning season. If you've just moved in and don't know when it was last cleaned, start with a cleaning and we'll tell you how it looks.",
    ),
    qa(
      'Do I really need a chimney cap?',
      'In Michigan, yes. A cap keeps rain, snow, ice, and animals out of the flue — replacing one is far cheaper than repairing water damage inside a chimney.',
    ),
    qa(
      'How tall a chimney can you clean?',
      "Our $299 cleaning covers chimneys up to 35 feet, which fits most homes. Taller than that is $6 per additional foot — we'll confirm the total on the call.",
    ),
  ],
  seo_description:
    'Chimney cleaning, caps, and liner caps in Metro Detroit — flat, published pricing starting at $299 for a standard cleaning.',
});

// FAQS — the current 7 homepage FAQs from business.ts `faqs`, placement homepage.
await seed('faqs', 'what-happens-after-i-send-the-form', 'What happens after I send the form?', {
  component: 'faq',
  question: 'What happens after I send the form?',
  answer:
    'We call you — usually the same business day. We talk through what you need, answer your questions, and give you a quote. If it sounds good, we schedule the work right on the call. No pressure, no obligation.',
  placement: 'homepage',
});

await seed('faqs', 'what-areas-do-you-serve', 'What areas do you serve?', {
  component: 'faq',
  question: 'What areas do you serve?',
  answer:
    "Metro Detroit — communities across Wayne, Oakland, and Macomb counties. Not sure if you're in range? Call 313-804-0844 and we'll tell you right away. Locksmith jobs more than 25 miles from our location add a $50 distance fee.",
  placement: 'homepage',
});

await seed('faqs', 'how-does-the-10-first-service-offer-work', 'How does the $10 first-service offer work?', {
  component: 'faq',
  question: 'How does the $10 first-service offer work?',
  answer:
    'If it\'s your first time using KOM USA, you get $10 off — just mention the offer when we call you, or hit "Claim Offer" on the coupon and we\'ll see it on your request. One per household; can\'t be combined with other offers.',
  placement: 'homepage',
});

await seed('faqs', 'are-your-prices-really-the-prices', 'Are your prices really the prices?', {
  component: 'faq',
  question: 'Are your prices really the prices?',
  answer:
    'The prices on this site are our standard pricing, published so there are no surprises. Your exact quote can vary with your home\'s setup and hardware, and we always confirm it by phone before any work starts.',
  placement: 'homepage',
});

await seed('faqs', 'im-locked-out-right-now-what-do-i-do', "I'm locked out right now. What do I do?", {
  component: 'faq',
  question: "I'm locked out right now. What do I do?",
  answer:
    'Call us at 313-804-0844. Lockouts are handled by phone so we can confirm your location, verify the property, and dispatch a technician after the 50% deposit.',
  placement: 'homepage',
});

await seed('faqs', 'are-you-licensed-and-insured', 'Are you licensed and insured?', {
  component: 'faq',
  question: 'Are you licensed and insured?',
  answer:
    "Yes — KOM USA is licensed and insured, and we've been serving Metro Detroit homeowners under the same local ownership since day one.",
  placement: 'homepage',
});

await seed(
  'faqs',
  'do-you-only-do-locksmith-water-heater-and-chimney-work',
  'Do you only do locksmith, water heater, and chimney work?',
  {
    component: 'faq',
    question: 'Do you only do locksmith, water heater, and chimney work?',
    answer:
      "Those are the services we offer online today. Have something related in mind? Ask when we call — if we can't help, we'll say so honestly.",
    placement: 'homepage',
  },
);

await seed('blog', 'welcome-to-the-new-kom-usa-site', 'Welcome to the new KOM USA site', {
  component: 'article',
  title: 'Welcome to the new KOM USA site',
  category: 'update',
  date: new Date().toISOString().slice(0, 16).replace('T', ' '),
  excerpt: 'A fresh site, published prices, and a faster way to reach us — here is what changed.',
  body: rt([
    'We rebuilt kom-usa from the ground up around one idea: make it easy to reach us. Tell us what you need, and a real person calls you back — usually the same day.',
    'You will find our standard prices for locksmith work, water heater replacement, and chimney care published right on the site. No surprises: we confirm your exact quote by phone before any work starts.',
    'This blog is where we will share company updates, seasonal reminders, and answers to the questions we hear most. Thanks for reading — and if you need us, the form is right on the homepage.',
  ]),
  seo_description:
    'KOM USA launches a new website with published pricing for locksmith, water heater, and chimney services in Metro Detroit.',
});

await seed(
  'locations',
  'warren',
  'Warren',
  {
    component: 'location',
    city: 'Warren',
    intro: rt([
      'KOM USA serves homeowners across Warren with locksmith service, water heater replacement, and chimney care — with our standard prices published up front.',
      'This is a draft example page. Edit the text, pick the services and testimonials to feature, then press Publish when it is ready.',
    ]),
    services_offered: [],
    seo_description:
      'Locksmith, water heater, and chimney services for Warren, MI homes — upfront standard pricing from KOM USA. Request a call today.',
  },
  { publish: false },
);

console.log('seed complete');
