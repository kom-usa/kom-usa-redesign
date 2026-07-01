// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Current production domain (Wix). Keep this value through the migration so
  // canonical URLs, sitemap, and schema stay on the domain that already ranks.
  site: 'https://www.kom.construction',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});