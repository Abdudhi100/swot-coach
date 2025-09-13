"use client";

import ProtectedClient from "@/components/ProtectedClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Swot = {
  id: number;
  type: "strength" | "weakness" | "opportunity" | "threat";
  description: string;
  frequency: string;
  active: boolean;
};

export default function SwotPage() {
  const qc = useQueryClient();

  // Query
  const { data: items = [], isLoading } = useQuery<Swot[]>({
    queryKey: ["swot"],
    queryFn: () => api.get("/api/swot/").then((r) => r.data),
  });

  // Create Mutation with optimistic update
  const create = useMutation({
    mutationFn: (payload: Omit<Swot, "id">) => api.post("/api/swot/", payload),
    onMutate: async (newItem) => {
      await qc.cancelQueries({ queryKey: ["swot"] });
      const prev = qc.getQueryData<Swot[]>(["swot"]) || [];
      qc.setQueryData<Swot[]>(["swot"], [
        ...prev,
        { id: Date.now(), ...newItem },
      ]);
      return { prev };
    },
    onError: (_err, _newItem, ctx) => qc.setQueryData(["swot"], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["swot"] }),
  });

  // Delete Mutation with optimistic update
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/api/swot/${id}/`),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["swot"] });
      const prev = qc.getQueryData<Swot[]>(["swot"]) || [];
      qc.setQueryData<Swot[]>(
        ["swot"],
        prev.filter((s) => s.id !== id)
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => qc.setQueryData(["swot"], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["swot"] }),
  });

  // Local state
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<Swot["type"]>("strength");
  const [freq, setFreq] = useState("daily");

  // Create handler
  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;
    await create.mutateAsync({
      type,
      description: desc,
      frequency: freq,
      active: true,
    });
    setDesc("");
  };

  // Badge color mapping
  const typeColors: Record<Swot["type"], string> = {
    strength: "bg-green-100 text-green-700",
    weakness: "bg-red-100 text-red-700",
    opportunity: "bg-blue-100 text-blue-700",
    threat: "bg-yellow-100 text-yellow-700",
  };

  return (
    <ProtectedClient>
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold">Your SWOT</h1>

        {/* Form */}
        <form onSubmit={onCreate} className="mt-4 space-y-3">
          {/* Type */}
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as Swot["type"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="weakness">Weakness</SelectItem>
                <SelectItem value="opportunity">Opportunity</SelectItem>
                <SelectItem value="threat">Threat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Jog 20 minutes"
              required
            />
          </div>

          {/* Frequency */}
          <div>
            <Label>Frequency</Label>
            <Select value={freq} onValueChange={(v) => setFreq(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add button */}
          <Button type="submit" disabled={create.isPending}>
            {create.isPending && (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            )}
            Add
          </Button>
        </form>

        {/* List */}
        <section className="mt-6 space-y-2">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))
          ) : items.length ? (
            <AnimatePresence>
              {items.map((s: Swot) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <Badge className={typeColors[s.type]}>{s.type}</Badge>
                      {s.description}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Freq: {s.frequency}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remove.mutate(s.id)}
                    disabled={remove.isPending}
                  >
                    {remove.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-sm text-muted-foreground mt-3">
              No items yet. Add your first one above 🚀
            </div>
          )}
        </section>
      </div>
    </ProtectedClient>
  );
}
