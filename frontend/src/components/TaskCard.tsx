"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
  task?: {
    id: number;
    label: string;
    status: "pending" | "done";
  };
  onMarkDone: (id: number) => void;
  loading?: boolean;
  isLoadingData?: boolean; // new prop for skeleton loading
}

export function TaskCard({ task, onMarkDone, loading, isLoadingData }: TaskCardProps) {
  if (isLoadingData) {
    return (
      <Card className="shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </CardContent>
      </Card>
    );
  }

  if (!task) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`shadow-sm transition-colors ${
          task.status === "done" ? "bg-green-50" : "bg-white"
        }`}
      >
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <div
              className={`font-medium ${
                task.status === "done" ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.label}
            </div>
            <Badge
              variant={task.status === "done" ? "secondary" : "outline"}
              className="mt-1 text-xs"
            >
              {task.status === "done" ? "Completed" : "Pending"}
            </Badge>
          </div>
          <Button
            size="sm"
            variant={task.status === "done" ? "secondary" : "default"}
            disabled={task.status === "done" || loading}
            onClick={() => onMarkDone(task.id)}
            className="flex items-center gap-1"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : task.status === "done" ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                Done
              </>
            ) : (
              "Mark done"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
