"use client";

import { cn } from "@/lib/cn";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Size = "sm" | "md" | "lg" | "xl";
type Variant = "primary" | "secondary" | "accent" | "ghost" | "outline" | "danger" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
  fullWidth?: boolean;
}

const sizeClass: Record<Size, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
  xl: "btn-xl",
};

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  ghost: "btn-ghost",
  outline: "btn-outline",
  danger: "btn-error",
  link: "btn-link",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "primary", size = "md", className, leading, trailing, children, fullWidth, ...rest }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          "btn",
          sizeClass[size],
          variantClass[variant],
          fullWidth && "btn-block",
          className,
        )}
        {...rest}
      >
        {leading}
        {children}
        {trailing}
      </button>
    );
  },
);

export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>((p, r) => <Button ref={r} variant="primary" {...p} />);
PrimaryButton.displayName = "PrimaryButton";
export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>((p, r) => <Button ref={r} variant="secondary" {...p} />);
SecondaryButton.displayName = "SecondaryButton";
export const GhostButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>((p, r) => <Button ref={r} variant="ghost" {...p} />);
GhostButton.displayName = "GhostButton";
export const DangerButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>((p, r) => <Button ref={r} variant="danger" {...p} />);
DangerButton.displayName = "DangerButton";
export const LinkButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>((p, r) => <Button ref={r} variant="link" {...p} />);
LinkButton.displayName = "LinkButton";