import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-neutral-200 rounded-brand animate-pulse-slow",
        className
      )}
    />
  );
}
