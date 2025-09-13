"use client";

import ProtectedClient from "@/components/ProtectedClient";
import { useTasks } from "@/hooks/useTasks";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { TaskSkeleton } from "@/components/TaskSkeleton";
import Link from "next/link";
import NavBar from "@/components/NavBar";

type SWOTItem = {
  id: number;
  type: "strength" | "weakness" | "opportunity" | "threat";
  description: string;
};

export default function DashboardPage() {
  const { dateStr, tasks, streak, isLoading, markDone, completed } = useTasks();

  // fetch swot items
  const { data: swotItems, isLoading: swotLoading } = useQuery<SWOTItem[]>({
    queryKey: ["swot"],
    queryFn: () => api.get("/api/swot/").then((r) => r.data),
  });

  const loading = isLoading || swotLoading;

  return (
    <ProtectedClient>
      

      <main className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Loading state */}
        {loading && (
          <>
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </>
        )}

        {/* Onboarding if no SWOT items */}
        {!loading && (!swotItems || swotItems.length === 0) && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Welcome to SWOT Coach 🎉</h2>
            <p className="text-muted-foreground">
              You don’t have any SWOT items yet. Add your strengths, weaknesses,
              opportunities, and threats to start generating tasks.
            </p>
            <Link href="/swot">
              <Button>➕ Create your first SWOT item</Button>
            </Link>
          </div>
        )}

        {/* Task List if SWOT exists */}
        {!loading && swotItems && swotItems.length > 0 && (
          <>
            {/* Header */}
            <header className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Today</h1>
              <div className="text-sm">
                🔥 Streak: <strong>{streak?.count ?? 0}</strong>
              </div>
            </header>

            {/* Tasks */}
            <section className="space-y-3">
              {tasks?.length ? (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-4 border rounded-xl bg-card shadow-sm"
                  >
                    <div>
                      <div className="font-medium">{t.label}</div>
                      <div className="text-xs text-muted-foreground">
                        Status: {t.status}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={t.status === "done" ? "secondary" : "default"}
                      disabled={t.status === "done" || markDone.isPending}
                      onClick={() => markDone.mutate(t.id)}
                    >
                      {t.status === "done" ? "✅ Done" : "Mark done"}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No tasks for today 🎉
                </div>
              )}
            </section>

            {/* Footer */}
            <footer className="text-sm text-muted-foreground text-center">
              Completed: <strong>{completed}</strong> • Date: {dateStr}
            </footer>
          </>
        )}
      </main>
    </ProtectedClient>
  );
}
