import React from "react";

export function Badge({ tone = "neutral", children }) {
  const tones = {
    neutral: { background: "var(--kom-concrete)", color: "var(--text-primary)" },
    green: { background: "var(--surface-accent-soft)", color: "var(--kom-green-dark)" },
    brass: { background: "rgba(197,154,66,0.14)", color: "#8a6c2e" },
    inverse: { background: "var(--kom-charcoal)", color: "var(--kom-white)" },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-main)",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "4px 10px",
        borderRadius: "var(--radius-pill)",
        ...tones[tone],
      }}
    >
      {children}
    </span>
  );
}

export function Tag({ children, onRemove }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-main)",
        fontWeight: 500,
        fontSize: 13,
        color: "var(--text-primary)",
        background: "var(--surface-card)",
        border: "1px solid var(--border-default)",
        padding: "4px 10px 4px 12px",
        borderRadius: "var(--radius-sm)",
      }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          style={{
            border: "none",
            background: "transparent",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
