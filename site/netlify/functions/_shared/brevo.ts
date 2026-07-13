import {
  buildAckEmailHtml,
  buildAckEmailSubject,
  buildAckEmailText,
} from "./ack-email.js";
import type { ParsedSubmission } from "./parse-submission.js";

const BREVO_API = "https://api.brevo.com/v3";

function apiKey(): string {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    throw new Error("BREVO_API_KEY is not set");
  }
  return key;
}

function brevoHeaders(): HeadersInit {
  return {
    "api-key": apiKey(),
    "Content-Type": "application/json",
    accept: "application/json",
  };
}

/** Create or update a Brevo contact from a verified Netlify form submission. */
export async function upsertContact(submission: ParsedSubmission): Promise<void> {
  const listIdRaw = process.env.BREVO_LIST_ID;
  const listId = listIdRaw ? Number(listIdRaw) : undefined;

  const attributes: Record<string, string> = {
    FIRSTNAME: submission.firstName,
    SMS: submission.phone,
    CITY: submission.city,
    SERVICE: submission.service,
    NOTE: submission.note,
    LAST_FORM: submission.formName,
  };

  if (submission.offer) attributes.OFFER = submission.offer;
  if (submission.urgency) attributes.URGENCY = submission.urgency;
  if (submission.preferredContact) {
    attributes.PREFERRED_CONTACT = submission.preferredContact;
  }

  const body: Record<string, unknown> = {
    email: submission.email,
    updateEnabled: true,
    attributes,
  };

  if (listId && !Number.isNaN(listId)) {
    body.listIds = [listId];
  }

  const response = await fetch(`${BREVO_API}/contacts`, {
    method: "POST",
    headers: brevoHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Brevo contact upsert failed (${response.status}): ${detail}`);
  }
}

/** Send the branded acknowledgement email to the customer via Brevo transactional API. */
export async function sendAcknowledgementEmail(
  submission: ParsedSubmission,
): Promise<void> {
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL ?? "contact@kom-usa.com";
  const senderName = process.env.BREVO_SENDER_NAME ?? "KOM USA";

  const response = await fetch(`${BREVO_API}/smtp/email`, {
    method: "POST",
    headers: brevoHeaders(),
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: submission.email, name: submission.firstName || undefined }],
      subject: buildAckEmailSubject(submission),
      htmlContent: buildAckEmailHtml(submission),
      textContent: buildAckEmailText(submission),
      tags: ["form-ack", submission.formName],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Brevo acknowledgement email failed (${response.status}): ${detail}`);
  }
}
