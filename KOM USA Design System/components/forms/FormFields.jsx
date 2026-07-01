import React from "react";

export function Input({ label, placeholder, type = "text", value, onChange, name, required }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-main)" }}>
      {label && <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{label}</span>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          fontFamily: "var(--font-main)",
          fontSize: 15,
          padding: "0.7rem 0.85rem",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-default)",
          background: "var(--kom-white)",
          color: "var(--text-primary)",
          outline: "none",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--border-focus)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
      />
    </label>
  );
}

export function Select({ label, options = [], value, onChange, name }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-main)" }}>
      {label && <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{label}</span>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          fontFamily: "var(--font-main)",
          fontSize: 15,
          padding: "0.7rem 0.85rem",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-default)",
          background: "var(--kom-white)",
          color: "var(--text-primary)",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export const FormFields = { Input: null, Select: null, Checkbox: null }; // marker export; use the named exports below directly

export function Checkbox({ label, checked, onChange, name }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-main)", fontSize: 14 }}>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} style={{ accentColor: "var(--action-primary)", width: 16, height: 16 }} />
      {label}
    </label>
  );
}
