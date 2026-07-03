// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { storyblok } from '@storyblok/astro';
import netlify from '@astrojs/netlify';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const STORYBLOK_TOKEN = env.STORYBLOK_TOKEN ?? process.env.STORYBLOK_TOKEN;
// Preview deployments (branch `preview` on Netlify) render server-side with
// draft content and the visual-editor bridge. Production stays fully static.
const isPreview = (env.STORYBLOK_PREVIEW ?? process.env.STORYBLOK_PREVIEW) === 'true';

if (!STORYBLOK_TOKEN) {
  throw new Error('STORYBLOK_TOKEN is not set — add it to site/.env (see .env.example) or Netlify env.');
}

export default defineConfig({
  site: 'https://www.kom.construction',
  output: isPreview ? 'server' : 'static',
  adapter: isPreview ? netlify() : undefined,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    storyblok({
      accessToken: STORYBLOK_TOKEN,
      livePreview: isPreview,
      components: {
        // populated as storyblok components land: location, project
        service: 'storyblok/Service',
        article: 'storyblok/Article',
      },
    }),
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
    }),
  ],
});
