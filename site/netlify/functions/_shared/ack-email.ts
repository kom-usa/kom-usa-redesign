import type { ParsedSubmission } from "./parse-submission.js";

/** KOM USA brand tokens (match site/src/styles/global.css). */
const BRAND = {
  field: "#2f6b3b",
  fieldHover: "#275a32",
  sage: "#78a866",
  sageTint: "#eaf0e2",
  charcoal: "#33383e",
  cream: "#f2ede1",
  warmWhite: "#f7f7f2",
  steel: "#5e7480",
} as const;

const DEFAULT_SITE_URL = "https://kom-usa.com";
const DEFAULT_MAINTENANCE_PHONE = "248-264-3631";
const DEFAULT_MAINTENANCE_PHONE_HREF = "tel:+12482643631";
const DEFAULT_CONSTRUCTION_PHONE = "248-215-2634";
const DEFAULT_CONSTRUCTION_PHONE_HREF = "tel:+12482152634";

function siteUrl(): string {
  return (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");
}

function logoUrl(): string {
  return `${siteUrl()}/logo-email.png`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function greetingName(firstName: string): string {
  return firstName ? escapeHtml(firstName) : "there";
}

function detailRow(label: string, value: string): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:8px 0;color:${BRAND.steel};font-size:14px;width:120px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;color:${BRAND.charcoal};font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;
}

/** Branded acknowledgement email for a verified Netlify form submission. */
export function buildAckEmailHtml(submission: ParsedSubmission): string {
  const name = greetingName(submission.firstName);
  const isConstruction = submission.serviceLine === "construction";
  const phone = isConstruction ? DEFAULT_CONSTRUCTION_PHONE : DEFAULT_MAINTENANCE_PHONE;
  const phoneHref = isConstruction ? DEFAULT_CONSTRUCTION_PHONE_HREF : DEFAULT_MAINTENANCE_PHONE_HREF;
  const url = siteUrl();
  const logo = logoUrl();

  const intro = `Thanks for contacting KOM USA about your <strong style="color:${BRAND.field};">${escapeHtml(submission.service || "request")}</strong>. Our team will review the details and contact you to discuss the next step. Project-specific pricing is confirmed after the scope is understood.`;

  const offerLine = "";

  const urgencyLine = submission.urgency
    ? detailRow("Urgency", submission.urgency)
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>We got your request — KOM USA</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.warmWhite};font-family:'Nunito Sans',Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.warmWhite};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 14px rgba(51,56,62,0.12);">
          <tr>
            <td style="background:${BRAND.field};padding:28px 32px;text-align:center;">
              <img src="${logo}" alt="KOM USA" width="180" height="auto" style="display:block;margin:0 auto;max-width:180px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;">
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:${BRAND.charcoal};font-weight:800;">Got it — your request is in.</h1>
              <p style="margin:0;font-size:16px;line-height:1.6;color:${BRAND.charcoal};">Hi ${name},</p>
              <p style="margin:12px 0 0;font-size:16px;line-height:1.6;color:${BRAND.charcoal};">${intro}</p>
              ${offerLine}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};border-radius:8px;padding:16px 20px;">
                <tr><td style="font-size:13px;font-weight:800;color:${BRAND.field};text-transform:uppercase;letter-spacing:0.05em;padding-bottom:8px;">Your details</td></tr>
                ${detailRow("Service", submission.service)}
                ${detailRow("City / ZIP", submission.city)}
                ${detailRow("Phone", submission.phone)}
                ${urgencyLine}
                ${submission.note ? detailRow("Note", submission.note) : ""}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:${BRAND.steel};">If you need to speak with the team sooner, call the appropriate service line.</p>
              <a href="${phoneHref}" style="display:inline-block;background:${BRAND.field};color:#ffffff;text-decoration:none;font-size:16px;font-weight:800;padding:14px 28px;border-radius:8px;">Call ${escapeHtml(phone)}</a>
              <p style="margin:20px 0 0;font-size:13px;line-height:1.5;color:${BRAND.steel};">
                <a href="${url}" style="color:${BRAND.field};font-weight:700;text-decoration:none;">kom-usa.com</a>
                &nbsp;·&nbsp; Maintenance &amp; construction across Metro Detroit
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildAckEmailSubject(submission: ParsedSubmission): string {
  const service = submission.service ? ` — ${submission.service}` : "";
  return `We got your request${service} — KOM USA`;
}

export function buildAckEmailText(submission: ParsedSubmission): string {
  const name = submission.firstName || "there";
  const phone = submission.serviceLine === "construction" ? DEFAULT_CONSTRUCTION_PHONE : DEFAULT_MAINTENANCE_PHONE;
  return `Hi ${name},

Thanks for contacting KOM USA. We received your request and will review the details before contacting you about the next step.

Service: ${submission.service || "—"}
City / ZIP: ${submission.city || "—"}
Phone: ${submission.phone || "—"}
${submission.note ? `Note: ${submission.note}\n` : ""}
If you need to speak with the team sooner, call ${phone}.

— KOM USA
${siteUrl()}`;
}
