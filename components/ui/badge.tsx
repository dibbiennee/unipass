import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-neutral-200 text-neutral-700",
        success: "bg-green-900/50 text-green-400 border border-green-800",
        warning: "bg-amber-900/50 text-amber-400 border border-amber-800",
        discount: "bg-primary-900/50 text-primary-300 border border-primary-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
