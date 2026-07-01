import * as React from "react";

export interface BadgeProps {
  tone?: "neutral" | "green" | "brass" | "inverse";
  children?: React.ReactNode;
}

export interface TagProps {
  children?: React.ReactNode;
  onRemove?: () => void;
}
