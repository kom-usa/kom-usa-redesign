// scripts/storyblok-webhook.mjs — register Storyblok→Netlify publish webhook.
// Usage: node scripts/storyblok-webhook.mjs <netlify-build-hook-url>
import { mapi } from './storyblok-lib.mjs';

const url = process.argv[2];
if (!url?.startsWith('https://api.netlify.com/build_hooks/')) {
  console.error('Pass the Netlify build hook URL as the first argument.');
  process.exit(1);
}
const existing = (await mapi('GET', '/webhook_endpoints/')).webhook_endpoints ?? [];
const found = existing.find((w) => w.name === 'Netlify production rebuild');
const payload = {
  webhook_endpoint: {
    name: 'Netlify production rebuild',
    endpoint: url,
    actions: ['story.published', 'story.unpublished', 'story.deleted', 'story.moved'],
    activated: true,
  },
};
if (found) {
  await mapi('PUT', `/webhook_endpoints/${found.id}`, payload);
  console.log('updated webhook');
} else {
  await mapi('POST', '/webhook_endpoints/', payload);
  console.log('created webhook');
}
