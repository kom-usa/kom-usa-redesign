import React from "react";

export function HomePage({ nav }) {
  const { NavBar, Footer, Button, Badge, ServiceCard, Card } = window.KOMUSADesignSystem_8f04d7;
  const { Logo } = window.__komSite;
  const { Photo } = window.__komSite;

  return (
    <div style={{ background: "var(--surface-page)" }}>
      <NavBar
        logo={<Logo />}
        links={["Services", "About", "Contact"]}
        cta={<Button size="sm" onClick={() => nav("contact")}>Get a Free Estimate</Button>}
      />

      {/* Hero */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-24) var(--container-pad)", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "var(--space-16)", alignItems: "center" }}>
        <div>
          <Badge tone="green">Licensed &amp; Insured · Serving the tri-county area</Badge>
          <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.08, margin: "var(--space-4) 0 var(--space-4)" }}>
            Local craftsmanship you can trust.
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.5, color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>
            KOM USA has helped neighborhood homeowners with roofing, remodels, and repairs for over two decades. We show up on time and stand behind every job.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Button size="lg" onClick={() => nav("contact")}>Get a Free Estimate</Button>
            <Button size="lg" variant="secondary" onClick={() => nav("services")}>See Our Services</Button>
          </div>
        </div>
        <Photo label="Finished roofing project" height={380} />
      </section>

      {/* Trust strip */}
      <section style={{ background: "var(--surface-accent-soft)", padding: "var(--space-8) var(--container-pad)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 16, fontFamily: "var(--font-main)", fontWeight: 700, color: "var(--kom-green-dark)" }}>
          <span>20+ Years Local</span>
          <span>Licensed &amp; Insured</span>
          <span>500+ Projects Completed</span>
          <span>Free On-Site Estimates</span>
        </div>
      </section>

      {/* Services */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-24) var(--container-pad)" }}>
        <h2 style={{ marginBottom: "var(--space-2)" }}>Our services</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 17, marginBottom: "var(--space-10)" }}>Practical work, done right the first time.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-6)" }}>
          <ServiceCard title="Roofing" description="Repairs, replacements, and inspections built to last through every season." icon="🏠" onClick={(e) => { e.preventDefault(); nav("services"); }} />
          <ServiceCard title="Remodeling" description="Kitchens, baths, and additions planned around how your family actually lives." icon="🛠️" onClick={(e) => { e.preventDefault(); nav("services"); }} />
          <ServiceCard title="Repairs" description="Fast, honest fixes for the everyday things that need a trusted local hand." icon="🔧" onClick={(e) => { e.preventDefault(); nav("services"); }} />
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ background: "var(--surface-inverse)", color: "var(--text-inverse)", padding: "var(--space-20) var(--container-pad)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 26, lineHeight: 1.4, fontWeight: 700, marginBottom: "var(--space-4)" }}>
            "KOM USA replaced our roof in two days and left the yard cleaner than they found it. Real hometown service."
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>— Marcy T., homeowner since 2019</p>
        </div>
      </section>

      {/* CTA band */}
      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-20) var(--container-pad)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 6 }}>Ready to get started?</h2>
          <p style={{ color: "var(--text-secondary)" }}>Estimates are free, and there's never any pressure.</p>
        </div>
        <Button size="lg" onClick={() => nav("contact")}>Request a Free Estimate</Button>
      </section>

      <Footer
        logo={<Logo variant="white" height={30} />}
        columns={[
          { title: "Services", items: ["Roofing", "Remodeling", "Repairs"] },
          { title: "Company", items: ["About", "Careers", "Contact"] },
        ]}
      />
    </div>
  );
}
