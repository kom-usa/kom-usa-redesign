import React from "react";

const SERVICES = [
  { title: "Roofing", icon: "🏠", description: "Inspections, repairs, and full replacements using durable, weather-ready materials.", items: ["Roof repair & patching", "Full roof replacement", "Storm damage inspection", "Gutter & flashing work"] },
  { title: "Remodeling", icon: "🛠️", description: "Kitchens, bathrooms, and additions planned around how your family lives.", items: ["Kitchen remodels", "Bathroom remodels", "Room additions", "Basement finishing"] },
  { title: "Repairs", icon: "🔧", description: "Fast, honest fixes for the everyday things that need a trusted local hand.", items: ["Siding & trim repair", "Drywall & paint touch-ups", "Deck & fence repair", "General handyman work"] },
];

export function ServicesPage({ nav }) {
  const { NavBar, Footer, Button, Card } = window.KOMUSADesignSystem_8f04d7;
  const { Logo, Photo } = window.__komSite;

  return (
    <div style={{ background: "var(--surface-page)" }}>
      <NavBar logo={<Logo />} links={["Services", "About", "Contact"]} cta={<Button size="sm" onClick={() => nav("contact")}>Get a Free Estimate</Button>} />

      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-20) var(--container-pad) var(--space-10)" }}>
        <h1 style={{ fontSize: 40, marginBottom: "var(--space-3)" }}>Our services</h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 640 }}>
          From a single repair to a full remodel, our crews are local, licensed, and insured — and every estimate is free.
        </p>
      </section>

      <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--container-pad) var(--space-24)", display: "flex", flexDirection: "column", gap: "var(--space-16)" }}>
        {SERVICES.map((s, i) => (
          <div key={s.title} style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr", gap: "var(--space-10)", alignItems: "center" }}>
            {i % 2 === 0 ? (
              <>
                <Photo label={`${s.title} in progress`} height={280} tone={i === 0 ? "green" : i === 1 ? "steel" : "charcoal"} />
                <ServiceDetail s={s} nav={nav} />
              </>
            ) : (
              <>
                <ServiceDetail s={s} nav={nav} />
                <Photo label={`${s.title} in progress`} height={280} tone="steel" />
              </>
            )}
          </div>
        ))}
      </section>

      <Footer logo={<Logo variant="white" height={30} />} columns={[{ title: "Services", items: ["Roofing", "Remodeling", "Repairs"] }, { title: "Company", items: ["About", "Careers", "Contact"] }]} />
    </div>
  );
}

function ServiceDetail({ s, nav }) {
  const { Button } = window.KOMUSADesignSystem_8f04d7;
  return (
    <div>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
      <h2 style={{ marginBottom: "var(--space-2)" }}>{s.title}</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>{s.description}</p>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: "var(--space-6)" }}>
        {s.items.map((it) => (
          <li key={it} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-primary)" }}>
            <span style={{ color: "var(--kom-green-dark)", fontWeight: 700 }}>✓</span> {it}
          </li>
        ))}
      </ul>
      <Button variant="secondary" onClick={() => nav("contact")}>Request an estimate</Button>
    </div>
  );
}
