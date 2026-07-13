/**
 * Smoke tests for Netlify → Brevo form parsing and acknowledgement email HTML.
 * Run: node --experimental-strip-types netlify/functions/_shared/parse-submission.test.mts
 */
import assert from "node:assert/strict";
import { buildAckEmailHtml, buildAckEmailSubject } from "./ack-email.ts";
import { parseFormSubmission } from "./parse-submission.ts";

const callLead = parseFormSubmission({
  "form-name": "request-call",
  "first-name": "Sam",
  phone: "(555) 555-5555",
  email: "sam@example.com",
  city: "48088",
  service: "Locksmith",
  note: "Locked out of garage",
  offer: "",
});

assert.ok(callLead);
assert.equal(callLead.formName, "request-call");
assert.equal(callLead.firstName, "Sam");

const serviceLead = parseFormSubmission({
  "form-name": "request-service",
  name: "Jordan Patel",
  phone: "313-555-0100",
  email: "jordan@example.com",
  city: "Warren",
  service: "Water heater",
  urgency: "Urgent — within a few days",
  message: "No hot water since Tuesday",
  "preferred-contact": "Phone call",
  "service-line": "maintenance",
});

assert.ok(serviceLead);
assert.equal(serviceLead.formName, "request-service");
assert.equal(serviceLead.firstName, "Jordan");
assert.equal(serviceLead.serviceLine, "maintenance");

assert.equal(parseFormSubmission({ "form-name": "newsletter", email: "x@y.com" }), null);
assert.ok(parseFormSubmission({ "form-name": "request-call" }));

const html = buildAckEmailHtml(callLead);
assert.match(html, /logo-email\.png/);
assert.match(html, /#2f6b3b/);
assert.match(html, /Sam/);
assert.match(html, /Locksmith/);

const subject = buildAckEmailSubject(callLead);
assert.match(subject, /Locksmith/);

console.log("parse-submission + ack-email tests passed");
