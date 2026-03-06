import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div className="container-app py-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-brand" />
        ))}
      </div>
    </div>
  );
}
