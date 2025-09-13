"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // ✅ better than alert()

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/signup/", { email, password });
      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err: any) {
      const msg =
        err.response?.data?.detail || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl border bg-card p-6 shadow-md"
      >
        <h1 className="text-2xl font-bold tracking-tight text-center">
          Create Account
        </h1>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Creating..." : "Register"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-primary hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
