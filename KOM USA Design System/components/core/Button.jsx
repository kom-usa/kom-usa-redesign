import React from "react";

export function Button({ variant = "primary", size = "md", children, icon, disabled, onClick, type = "button" }) {
  const base = {
    fontFamily: "var(--font-main)",
    fontWeight: 700,
    letterSpacing: "var(--letter-spacing-button)",
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "1px solid transparent",
    transition: "background-color 120ms ease, border-color 120ms ease, color 120ms ease, transform 80ms ease",
    opacity: disabled ? 0.5 : 1,
  };

  const sizes = {
    sm: { padding: "0.55rem 0.85rem", fontSize: 14 },
    md: { padding: "0.85rem 1.1rem", fontSize: 15 },
    lg: { padding: "1rem 1.5rem", fontSize: 16 },
  };

  const variants = {
    primary: {
      background: "var(--action-primary)",
      borderColor: "var(--action-primary)",
      color: "var(--action-on-primary)",
    },
    secondary: {
      background: "transparent",
      borderColor: "var(--kom-charcoal)",
      color: "var(--kom-charcoal)",
    },
    ghost: {
      background: "transparent",
      borderColor: "transparent",
      color: "var(--kom-charcoal)",
    },
  };

  const style = { ...base, ...sizes[size], ...variants[variant] };
  const hoverStyle =
    variant === "primary"
      ? { background: "var(--action-primary-hover)", borderColor: "var(--action-primary-hover)" }
      : variant === "secondary"
      ? { background: "var(--kom-charcoal)", color: "var(--kom-white)" }
      : { background: "var(--kom-concrete)" };

  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const activeStyle =
    variant === "primary"
      ? { background: "var(--action-primary-press)", borderColor: "var(--action-primary-press)" }
      : {};

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        ...style,
        ...(hover && !disabled ? hoverStyle : {}),
        ...(active && !disabled ? activeStyle : {}),
        transform: active && !disabled ? "scale(0.98)" : "scale(1)",
      }}
    >
      {icon}
      {children}
    </button>
  );
}
