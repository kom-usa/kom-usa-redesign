import React from "react";

export function ContactPage({ nav }) {
  const { NavBar, Footer, Button, Input, Select, Checkbox, Card } = window.KOMUSADesignSystem_8f04d7;
  const { Logo } = window.__komSite;
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div style={{ background: "var(--surface-page)" }}>
      <NavBar logo={<Logo />} links={["Services", "About", "Contact"]} cta={<Button size="sm" onClick={() => nav("contact")}>Get a Free Estimate</Button>} />

      <section style={{ maxWidth: 720, margin: "0 auto", padding: "var(--space-20) var(--container-pad) var(--space-24)" }}>
        <h1 style={{ fontSize: 40, marginBottom: "var(--space-3)" }}>Get a free estimate</h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: "var(--space-8)" }}>
          Tell us a bit about your project and a local KOM USA team member will call you back within one business day.
        </p>

        <Card>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "var(--space-10) 0" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
              <h3 style={{ marginBottom: 8 }}>Thanks — we'll be in touch soon.</h3>
              <p style={{ color: "var(--text-secondary)" }}>A KOM USA team member will call within one business day.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}
            >
              <Input label="Full name" placeholder="Jane Homeowner" required />
              <Input label="Phone" type="tel" placeholder="(555) 010-0199" required />
              <div style={{ gridColumn: "1 / -1" }}>
                <Input label="Email" type="email" placeholder="jane@email.com" required />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <Select label="Service needed" options={["Roofing", "Remodeling", "Repairs", "Other"]} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <Checkbox label="I'd like a callback instead of an email" />
              </div>
              <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                <Button type="submit" size="lg">Request My Free Estimate</Button>
              </div>
            </form>
          )}
        </Card>
      </section>

      <Footer logo={<Logo variant="white" height={30} />} columns={[{ title: "Services", items: ["Roofing", "Remodeling", "Repairs"] }, { title: "Company", items: ["About", "Careers", "Contact"] }]} />
    </div>
  );
}
