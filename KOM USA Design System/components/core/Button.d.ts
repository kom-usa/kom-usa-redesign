import * as React from "react";

export interface ButtonProps {
  /** Visual style */
  variant?: "primary" | "secondary" | "ghost";
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Button label content */
  children?: React.ReactNode;
  /** Optional leading icon element */
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}
