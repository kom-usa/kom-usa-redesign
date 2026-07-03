// Shared Management API client for setup/seed scripts. Reads site/.env directly
// so the scripts work without dotenv as a dependency.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#') && l.includes('='))
    .map((l) => l.split('=').map((s) => s.trim())),
);

export const SPACE_ID = env.STORYBLOK_SPACE_ID;
const TOKEN = env.STORYBLOK_MANAGEMENT_TOKEN;
if (!SPACE_ID || !TOKEN) {
  console.error('Missing STORYBLOK_SPACE_ID or STORYBLOK_MANAGEMENT_TOKEN in site/.env');
  process.exit(1);
}

const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`;

export async function mapi(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 1000));
    return mapi(method, path, body);
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} → HTTP ${res.status}: ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}
