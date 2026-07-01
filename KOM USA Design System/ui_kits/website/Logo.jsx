import React from "react";

export function Logo({ variant = "charcoal", height = 34 }) {
  const srcs = {
    charcoal: "../../assets/logos/kom-usa-logo-primary-charcoal.svg",
    green: "../../assets/logos/kom-usa-logo-primary-green.svg",
    white: "../../assets/logos/kom-usa-logo-white.svg",
  };
  return <img src={srcs[variant]} alt="KOM USA" style={{ height }} />;
}
