"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90":
            variant === "primary",
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-80":
            variant === "secondary",
          "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]":
            variant === "ghost",
          "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90":
            variant === "destructive",
          "border border-[var(--border)] bg-transparent hover:bg-[var(--accent)]":
            variant === "outline",
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4 text-sm": size === "md",
          "h-12 px-6 text-base": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
