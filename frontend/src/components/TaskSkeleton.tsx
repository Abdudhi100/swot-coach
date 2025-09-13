// components/TaskSkeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TaskSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border rounded-xl bg-card shadow-sm">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-8 w-20 rounded-md" />
    </div>
  );
}
