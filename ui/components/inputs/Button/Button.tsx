import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost"
  | "link"
  | "neutral";

type ButtonSize = "lg" | "md" | "sm" | "xs";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  outline?: boolean;
  wide?: boolean;
  block?: boolean;
  circle?: boolean;
  square?: boolean;
  glass?: boolean;
  loading?: boolean;
  disabled?: boolean;
  active?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children?: ReactNode;
}

export const Button = ({
  variant,
  size = "md",
  outline = false,
  wide = false,
  block = false,
  circle = false,
  square = false,
  glass = false,
  loading = false,
  disabled = false,
  active = false,
  icon,
  iconPosition = "left",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClass = "btn";
  const variantClass = variant ? `btn-${variant}` : "";
  const sizeClass = size ? `btn-${size}` : "";
  const outlineClass = outline ? "btn-outline" : "";
  const wideClass = wide ? "btn-wide" : "";
  const blockClass = block ? "btn-block" : "";
  const circleClass = circle ? "btn-circle" : "";
  const squareClass = square ? "btn-square" : "";
  const glassClass = glass ? "glass" : "";
  const activeClass = active ? "btn-active" : "";

  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    outlineClass,
    wideClass,
    blockClass,
    circleClass,
    squareClass,
    glassClass,
    activeClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <span className="loading loading-spinner"></span>}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
};
