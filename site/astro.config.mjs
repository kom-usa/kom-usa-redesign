// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { storyblok } from '@storyblok/astro';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const STORYBLOK_TOKEN = env.STORYBLOK_TOKEN ?? process.env.STORYBLOK_TOKEN;

// Storyblok is being retired in favour of Sanity (see
// docs/superpowers/specs/2026-07-08-sanity-seo-netlify-migration-design.md).
// The integration is only registered when a token is present, so the
// production build runs with no token and is fully static and self-contained.
// Data helpers in src/lib/storyblok.ts degrade to empty results without a token.
const integrations = [
  sitemap({
    filter: (page) => !page.includes('/thank-you'),
  }),
];

if (STORYBLOK_TOKEN) {
  integrations.unshift(
    storyblok({
      accessToken: STORYBLOK_TOKEN,
      components: {
        service: 'storyblok/Service',
        article: 'storyblok/Article',
        location: 'storyblok/Location',
        project: 'storyblok/Project',
      },
    }),
  );
}

export default defineConfig({
  site: 'https://www.kom.construction',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations,
});
