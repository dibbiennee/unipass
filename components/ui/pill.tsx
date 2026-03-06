"use client";

import { cn } from "@/lib/utils";

interface PillProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Pill({ label, selected = false, onClick, className }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-body-sm font-medium transition-all duration-200 whitespace-nowrap",
        selected
          ? "bg-primary-500 text-white"
          : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
        className
      )}
    >
      {label}
    </button>
  );
}
