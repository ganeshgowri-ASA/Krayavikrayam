import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const variants: Record<string, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-gray-700 hover:bg-gray-100",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
};

const sizes: Record<string, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variants[variant] || variants.primary,
      sizes[size] || sizes.md,
      className
    )}
    {...props}
  />
));
Button.displayName = "Button";
