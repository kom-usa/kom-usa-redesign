#!/usr/bin/env node
/**
 * One-time Brevo setup for Netlify form → Brevo integration.
 *
 * Creates the custom contact attributes used by netlify/functions/form-brevo.
 * Run locally after adding BREVO_API_KEY to site/.env:
 *
 *   node scripts/brevo-setup.mjs
 *
 * Also prints the list ID hint — create a "Website leads" list in Brevo and
 * set BREVO_LIST_ID in Netlify environment variables.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

function loadEnvFile() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) {
  console.error("Set BREVO_API_KEY in site/.env or the environment.");
  process.exit(1);
}

const ATTRIBUTES = [
  { name: "CITY", type: "text" },
  { name: "SERVICE", type: "text" },
  { name: "NOTE", type: "text" },
  { name: "LAST_FORM", type: "text" },
  { name: "OFFER", type: "text" },
  { name: "URGENCY", type: "text" },
  { name: "PREFERRED_CONTACT", type: "text" },
];

const headers = {
  "api-key": apiKey,
  "Content-Type": "application/json",
  accept: "application/json",
};

async function ensureAttribute(name, type) {
  const response = await fetch(
    `https://api.brevo.com/v3/contacts/attributes/normal/${encodeURIComponent(name)}`,
    { method: "POST", headers, body: JSON.stringify({ type }) },
  );

  if (response.ok) {
    console.log(`Created attribute ${name}`);
    return;
  }

  const body = await response.text();
  if (response.status === 400 && body.includes("already exist")) {
    console.log(`Attribute ${name} already exists`);
    return;
  }

  throw new Error(`Failed to create ${name} (${response.status}): ${body}`);
}

async function listLists() {
  const response = await fetch("https://api.brevo.com/v3/contacts/lists?limit=50", {
    headers,
  });
  if (!response.ok) {
    console.warn("Could not fetch lists — create one manually in Brevo.");
    return;
  }
  const data = await response.json();
  if (!data.lists?.length) {
    console.log("\nNo contact lists found. Create a list (e.g. \"Website leads\") in Brevo, then set BREVO_LIST_ID in Netlify.");
    return;
  }
  console.log("\nBrevo contact lists (set BREVO_LIST_ID to one of these):");
  for (const list of data.lists) {
    console.log(`  ${list.id}: ${list.name}`);
  }
}

for (const attr of ATTRIBUTES) {
  await ensureAttribute(attr.name, attr.type);
}

await listLists();

console.log("\nDone. Next steps:");
console.log("1. Verify sender contact@kom-usa.com in Brevo (Senders & IP).");
console.log("2. Set BREVO_API_KEY, BREVO_LIST_ID (optional) in Netlify env vars.");
console.log("3. Enable Forms in Netlify UI for this site.");
