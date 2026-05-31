import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "../utils/cn";

/**
 * Local shadcn-style variant contract for {@link Button}.
 */
const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8]",
        secondary: "border border-[#c8d3e8] bg-white text-[#111827] hover:bg-[#f5f8ff]",
        ghost: "text-[#334155] hover:bg-[#eef4ff]",
      },
      size: {
        default: "px-4",
        icon: "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

/**
 * Props supported by {@link Button}.
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /**
     * Renders the button styling onto the child element instead of a native
     * button.
     */
    asChild?: boolean;
  };

/**
 * Shared command control for actions across the app.
 *
 * Use `asChild` when another component, such as a router link, should receive
 * the button styling while preserving its own underlying element.
 */
export function Button({ asChild, className, size, variant, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
