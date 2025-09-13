"use client";
import ProtectedClient from "@/components/ProtectedClient";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const datesLast7 = () => {
  const arr = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
};

export default function ProgressPage() {
  const days = datesLast7();

  // fetch tasks for each day (parallel)
  const { data: all, isLoading } = useQuery({
    queryKey: ["last7tasks"],
    queryFn: async () => {
      const promises = days.map((d) =>
        api.get(`/api/tasks/?date=${d}`).then((r) => r.data.results ?? r.data)
      );
      return Promise.all(promises);
    },
  });

  const stats = useMemo(() => {
    if (!all) return [];
    return all.map((tasks: any[], idx: number) => {
      const done = tasks.filter((t) => t.status === "done").length;
      const total = tasks.length || 0;
      const pct = total ? Math.round((done / total) * 100) : 0;
      return { day: days[idx], done, total, pct };
    });
  }, [all, days]);

  const barColor = (pct: number) =>
    pct >= 80
      ? "bg-green-500"
      : pct >= 50
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <ProtectedClient>
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold">Progress (last 7 days)</h1>

        <div className="mt-4 space-y-3">
          {isLoading
            ? Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md" />
              ))
            : stats.map((s) => (
                <div
                  key={s.day}
                  className="flex items-center space-x-4 p-2 border rounded-md"
                >
                  <div style={{ width: 100 }} className="text-sm font-medium">
                    {s.day}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded overflow-hidden h-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-6 ${barColor(s.pct)}`}
                    />
                  </div>
                  <div className="flex items-center gap-2 w-32 justify-end">
                    <Badge variant="secondary">
                      {s.done}/{s.total}
                    </Badge>
                    <span className="text-sm font-medium">{s.pct}%</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </ProtectedClient>
  );
}
