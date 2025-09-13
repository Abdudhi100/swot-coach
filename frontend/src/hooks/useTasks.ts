// src/hooks/useTasks.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

// types
export interface Task {
  id: number;
  label: string;
  status: "pending" | "done";
}

export interface Streak {
  count: number;
}

const today = () => new Date().toISOString().slice(0, 10);

async function fetchTasks(date: string): Promise<Task[]> {
  const res = await api.get(`/api/tasks/?date=${date}`);
  return res.data.results ?? res.data;
}

async function fetchStreak(): Promise<Streak> {
  const res = await api.get("/api/streak/");
  return res.data;
}

export function useTasks() {
  const qc = useQueryClient();
  const dateStr = today();

  // tasks
  const tasksQuery = useQuery({
    queryKey: ["tasks", dateStr],
    queryFn: () => fetchTasks(dateStr),
  });

  // streak
  const streakQuery = useQuery({
    queryKey: ["streak"],
    queryFn: fetchStreak,
  });

  // mutation
  const markDone = useMutation({
    mutationFn: (id: number) => api.post(`/api/tasks/${id}/done/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["streak"] });
      toast.success("Task marked as done!");
    },
    onError: () => toast.error("Failed to mark task."),
  });

  // derived values
  const tasks = tasksQuery.data ?? [];
  const streak = streakQuery.data;
  const isLoading = tasksQuery.isLoading;
  const completed = tasks.filter((t) => t.status === "done").length;

  return {
    dateStr,
    tasks,
    streak,
    isLoading,
    markDone,
    completed,
  };
}
