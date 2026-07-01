import * as React from "react";

/** @startingPoint section="Components" subtitle="Site header nav and footer" viewport="700x160" */
export interface NavBarProps {
  logo?: React.ReactNode;
  links?: string[];
  cta?: React.ReactNode;
}

export interface FooterProps {
  logo?: React.ReactNode;
  columns?: { title: string; items: string[] }[];
}
