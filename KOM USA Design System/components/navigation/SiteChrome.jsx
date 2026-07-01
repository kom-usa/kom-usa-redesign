import React from "react";

export function NavBar({ logo, links = [], cta }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px var(--container-pad)",
        background: "var(--kom-white)",
        borderBottom: "1px solid var(--border-default)",
        fontFamily: "var(--font-main)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>{logo}</div>
      <nav style={{ display: "flex", gap: 28 }}>
        {links.map((l) => (
          <a key={l} href="#" style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
            {l}
          </a>
        ))}
      </nav>
      {cta}
    </header>
  );
}

export const SiteChrome = { NavBar: null, Footer: null }; // marker export; use the named exports below directly

export function Footer({ logo, columns = [] }) {
  return (
    <footer style={{ background: "var(--surface-inverse)", color: "var(--text-inverse)", fontFamily: "var(--font-main)", padding: "var(--space-16) var(--container-pad)" }}>
      <div style={{ display: "flex", gap: "var(--space-16)", flexWrap: "wrap", maxWidth: "var(--container-max)", margin: "0 auto" }}>
        <div style={{ flex: "1 1 220px" }}>{logo}</div>
        {columns.map((col) => (
          <div key={col.title} style={{ flex: "1 1 160px" }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {col.items.map((it) => (
                <a key={it} href="#" style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
                  {it}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
