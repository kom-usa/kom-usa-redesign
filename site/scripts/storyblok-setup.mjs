// Idempotently creates/updates Storyblok component schemas and content folders.
// Run: node scripts/storyblok-setup.mjs
import { mapi } from './storyblok-lib.mjs';

const text = (name, opts = {}) => ({ type: 'text', display_name: name, ...opts });
const textarea = (name, opts = {}) => ({ type: 'textarea', display_name: name, ...opts });
const seoFields = {
  seo_title: text('SEO title (optional — defaults to the name)'),
  seo_description: textarea('SEO description (shows in Google)', { required: true }),
  seo_image: { type: 'asset', filetypes: ['images'], display_name: 'Social share image (optional)' },
};

const nestables = [
  { name: 'list_item', schema: { text: text('Item', { required: true }) } },
  {
    name: 'price_row',
    schema: {
      name: text('What it is', { required: true }),
      detail: text('Small print under the name (optional)'),
      price: text('Price (e.g. $129 or from $1,750)', { required: true }),
    },
  },
  {
    name: 'faq_item',
    schema: {
      question: text('Question', { required: true }),
      answer: textarea('Answer', { required: true }),
    },
  },
];

const contentTypes = [
  {
    name: 'article',
    schema: {
      title: text('Title', { required: true }),
      category: {
        type: 'option', required: true, display_name: 'Type',
        options: [
          { name: 'Blog post', value: 'blog' },
          { name: 'Company update', value: 'update' },
        ],
      },
      date: { type: 'datetime', required: true, display_name: 'Publish date shown on the site' },
      cover_image: { type: 'asset', filetypes: ['images'], display_name: 'Cover image' },
      excerpt: textarea('Short summary (shows on the blog list)', { required: true }),
      body: { type: 'richtext', required: true, display_name: 'Article text' },
      ...seoFields,
    },
  },
  {
    name: 'service',
    schema: {
      title: text('Page title', { required: true }),
      short_title: text('Short name (buttons, menus)', { required: true }),
      anchor_price: text('Headline price (e.g. "Unlocks from $129")', { required: true }),
      card_blurb: textarea('Card description (homepage services grid)', { required: true }),
      hero_intro: textarea('Intro paragraph at the top of the page', { required: true }),
      hero_image: { type: 'asset', filetypes: ['images'], display_name: 'Page photo' },
      includes: {
        type: 'bloks', display_name: 'What we handle (list)',
        restrict_components: true, component_whitelist: ['list_item'],
      },
      pricing: {
        type: 'bloks', display_name: 'Pricing rows',
        restrict_components: true, component_whitelist: ['price_row'],
      },
      pricing_note: textarea('Extra pricing note for this service (optional)'),
      faqs: {
        type: 'bloks', display_name: 'Common questions',
        restrict_components: true, component_whitelist: ['faq_item'],
      },
      ...seoFields,
    },
  },
  {
    name: 'location',
    schema: {
      city: text('City name', { required: true }),
      intro: { type: 'richtext', required: true, display_name: 'Intro for this city' },
      services_offered: {
        type: 'options', source: 'internal_stories', filter_content_type: ['service'],
        required: true, display_name: 'Services offered here',
      },
      featured_testimonials: {
        type: 'options', source: 'internal_stories', filter_content_type: ['testimonial'],
        display_name: 'Testimonials to feature (optional)',
      },
      featured_projects: {
        type: 'options', source: 'internal_stories', filter_content_type: ['project'],
        display_name: 'Projects to feature (optional)',
      },
      ...seoFields,
    },
  },
  {
    name: 'project',
    schema: {
      title: text('Project title', { required: true }),
      city: text('City', { required: true }),
      service_category: {
        type: 'option', display_name: 'Related service',
        options: [
          { name: 'Locksmith', value: 'locksmith' },
          { name: 'Water heater', value: 'water-heaters' },
          { name: 'Chimney care', value: 'chimney-care' },
          { name: 'Other', value: 'other' },
        ],
      },
      date: { type: 'datetime', display_name: 'When the job was done' },
      photos: { type: 'multiasset', filetypes: ['images'], required: true, display_name: 'Photos' },
      problem: textarea('The problem', { required: true }),
      work: textarea('What we did', { required: true }),
      result: textarea('The result', { required: true }),
      ...seoFields,
    },
  },
  {
    name: 'faq',
    schema: {
      question: text('Question', { required: true }),
      answer: textarea('Answer', { required: true }),
      placement: {
        type: 'option', required: true, display_name: 'Where it shows',
        options: [
          { name: 'Homepage', value: 'homepage' },
          { name: 'Not shown yet (saved for later)', value: 'unplaced' },
        ],
      },
    },
  },
  {
    name: 'testimonial',
    schema: {
      name: text('Customer first name + last initial (e.g. "Jordan P.")', { required: true }),
      city: text('City (optional)'),
      quote: textarea('What they said (their real words)', { required: true }),
      source_url: text('Link to the real review (required — e.g. the Google review)', { required: true }),
      service_category: {
        type: 'option', display_name: 'Related service',
        options: [
          { name: 'Locksmith', value: 'locksmith' },
          { name: 'Water heater', value: 'water-heaters' },
          { name: 'Chimney care', value: 'chimney-care' },
          { name: 'General', value: 'general' },
        ],
      },
    },
  },
];

const folders = [
  { name: 'Services', slug: 'services', default_root: 'service' },
  { name: 'Blog', slug: 'blog', default_root: 'article' },
  { name: 'Locations', slug: 'locations', default_root: 'location' },
  { name: 'Projects', slug: 'projects', default_root: 'project' },
  { name: 'FAQs', slug: 'faqs', default_root: 'faq' },
  { name: 'Testimonials', slug: 'testimonials', default_root: 'testimonial' },
];

const existing = (await mapi('GET', '/components/')).components;
for (const def of [...nestables.map((n) => ({ ...n, is_nestable: true, is_root: false })),
                   ...contentTypes.map((c) => ({ ...c, is_nestable: false, is_root: true }))]) {
  const payload = { component: { name: def.name, display_name: def.name, schema: def.schema, is_root: def.is_root, is_nestable: def.is_nestable } };
  const found = existing.find((c) => c.name === def.name);
  if (found) {
    await mapi('PUT', `/components/${found.id}`, payload);
    console.log(`updated component: ${def.name}`);
  } else {
    await mapi('POST', '/components/', payload);
    console.log(`created component: ${def.name}`);
  }
}

const stories = (await mapi('GET', '/stories/?folder_only=1&per_page=100')).stories;
for (const f of folders) {
  if (stories.find((s) => s.slug === f.slug)) {
    console.log(`folder exists: ${f.slug}`);
  } else {
    await mapi('POST', '/stories/', { story: { name: f.name, slug: f.slug, is_folder: true, default_root: f.default_root } });
    console.log(`created folder: ${f.slug}`);
  }
}
console.log('setup complete');
