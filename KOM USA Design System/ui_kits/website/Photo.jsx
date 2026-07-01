import React from "react";

export function Photo({ label, height = 320, tone = "green" }) {
  const tones = {
    green: "linear-gradient(135deg, rgba(120,168,102,0.35), rgba(47,107,59,0.55))",
    steel: "linear-gradient(135deg, rgba(94,116,128,0.35), rgba(51,56,62,0.55))",
    charcoal: "linear-gradient(135deg, rgba(51,56,62,0.5), rgba(51,56,62,0.75))",
  };
  return (
    <div
      style={{
        height,
        width: "100%",
        borderRadius: "var(--radius-md)",
        background: tones[tone],
        display: "flex",
        alignItems: "flex-end",
        padding: 16,
        color: "#fff",
        fontFamily: "var(--font-main)",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      <span style={{ opacity: 0.9 }}>📷 {label} — real project photo goes here</span>
    </div>
  );
}
