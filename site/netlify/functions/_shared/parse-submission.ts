/** Normalized lead data from Netlify Forms (`request-call` or `request-service`). */
export interface ParsedSubmission {
  formName: "request-call" | "request-service";
  email: string;
  firstName: string;
  phone: string;
  city: string;
  service: string;
  note: string;
  offer?: string;
  urgency?: string;
  preferredContact?: string;
  serviceLine?: string;
}

const LEAD_FORMS = new Set(["request-call", "request-service"]);

/** Map verified Netlify form fields to a single lead shape for Brevo. */
export function parseFormSubmission(
  data: Record<string, string>,
): ParsedSubmission | null {
  const formName = data["form-name"] ?? "";
  if (!LEAD_FORMS.has(formName)) {
    return null;
  }

  const email = (data.email ?? "").trim();

  if (formName === "request-call") {
    return {
      formName: "request-call",
      email,
      firstName: (data["first-name"] ?? "").trim(),
      phone: (data.phone ?? "").trim(),
      city: (data.city ?? "").trim(),
      service: (data.service ?? "").trim(),
      note: (data.note ?? "").trim(),
      offer: (data.offer ?? "").trim() || undefined,
    };
  }

  const fullName =
    (data.name ?? "").trim() ||
    [data["first-name"], data["last-name"]]
      .map((part) => (part ?? "").trim())
      .filter(Boolean)
      .join(" ");
  const firstName = fullName.split(/\s+/)[0] ?? fullName;

  return {
    formName: "request-service",
    email,
    firstName,
    phone: (data.phone ?? "").trim(),
    city: (data.city ?? "").trim(),
    service: (data.service ?? "").trim(),
    note: (data.message ?? "").trim(),
    urgency: (data.urgency ?? "").trim() || undefined,
    preferredContact: (data["preferred-contact"] ?? "").trim() || undefined,
    serviceLine: (data["service-line"] ?? "").trim() || undefined,
  };
}
