import React from "react";

export function AboutPage({ nav }) {
  const { NavBar, Footer, Button, Badge } = window.KOMUSADesignSystem_8f04d7;
  const { Logo, Photo } = window.__komSite;

  return (
    <div style={{ background: "var(--surface-page)" }}>
      <NavBar logo={<Logo />} links={["Services", "About", "Contact"]} cta={<Button size="sm" onClick={() => nav("contact")}>Get a Free Estimate</Button>} />

      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-20) var(--container-pad)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-16)", alignItems: "center" }}>
        <div>
          <Badge tone="green">Family-owned since 2003</Badge>
          <h1 style={{ fontSize: 40, margin: "var(--space-4) 0" }}>A hometown crew, not a franchise.</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-secondary)" }}>
            KOM USA started with one truck and a handshake. Today we're still locally owned and operated —
            every estimate, every crew, every callback comes from people who live in this community too.
          </p>
        </div>
        <Photo label="The KOM USA crew" height={340} tone="green" />
      </section>

      <section style={{ background: "var(--surface-accent-soft)", padding: "var(--space-20) var(--container-pad)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-10)", textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "var(--kom-green-dark)" }}>20+</div>
            <div style={{ color: "var(--text-secondary)" }}>Years in business</div>
          </div>
          <div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "var(--kom-green-dark)" }}>500+</div>
            <div style={{ color: "var(--text-secondary)" }}>Projects completed</div>
          </div>
          <div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "var(--kom-green-dark)" }}>4.9★</div>
            <div style={{ color: "var(--text-secondary)" }}>Average customer rating</div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-20) var(--container-pad)" }}>
        <h2 style={{ marginBottom: "var(--space-8)" }}>Our values</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-8)" }}>
          {[
            ["Show up on time", "We respect your schedule as much as our own."],
            ["Do the job right", "No shortcuts — we stand behind every project we finish."],
            ["Keep it honest", "Clear pricing and straight answers, no surprises."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 style={{ marginBottom: 8 }}>{t}</h3>
              <p style={{ color: "var(--text-secondary)" }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer logo={<Logo variant="white" height={30} />} columns={[{ title: "Services", items: ["Roofing", "Remodeling", "Repairs"] }, { title: "Company", items: ["About", "Careers", "Contact"] }]} />
    </div>
  );
}
