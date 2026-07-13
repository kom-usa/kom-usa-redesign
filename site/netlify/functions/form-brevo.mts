import type { FormSubmittedEvent } from "@netlify/functions";

import { sendAcknowledgementEmail, upsertContact } from "./_shared/brevo.js";
import { parseFormSubmission } from "./_shared/parse-submission.js";

/**
 * Runs automatically when Netlify verifies a form submission.
 * Keeps Netlify Forms as the capture layer; syncs leads to Brevo and
 * sends the customer an acknowledgement email.
 */
export default {
  async formSubmitted(event: FormSubmittedEvent) {
    const submission = parseFormSubmission(event.data);
    if (!submission) {
      return;
    }

    if (!process.env.BREVO_API_KEY) {
      console.warn(
        "BREVO_API_KEY is not set — Netlify captured the submission but Brevo sync was skipped.",
      );
      return;
    }

    try {
      await upsertContact(submission);
      await sendAcknowledgementEmail(submission);
      console.log(
        `Brevo: synced ${submission.formName} submission for ${submission.email}`,
      );
    } catch (error) {
      console.error("Brevo form handler failed:", error);
      throw error;
    }
  },
};
