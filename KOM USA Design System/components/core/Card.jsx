import React from "react";

export function Card({ children, padded = true, style }) {
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-card)",
        padding: padded ? "var(--space-6)" : 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function ServiceCard({ title, description, icon, onClick }) {
  return (
    <Card>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-sm)",
          background: "var(--surface-accent-soft)",
          color: "var(--kom-green-dark)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "var(--space-4)",
        }}
      >
        {icon}
      </div>
      <h3 style={{ marginBottom: "var(--space-2)" }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-4)" }}>{description}</p>
      <a href="#" onClick={onClick} style={{ fontWeight: 700 }}>
        Learn more →
      </a>
    </Card>
  );
}
