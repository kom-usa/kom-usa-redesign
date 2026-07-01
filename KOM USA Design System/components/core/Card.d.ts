import * as React from "react";

export interface CardProps {
  children?: React.ReactNode;
  padded?: boolean;
  style?: React.CSSProperties;
}

export interface ServiceCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}
