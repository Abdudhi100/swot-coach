"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const { refreshUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/auth/login/", form);
      await refreshUser();
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      const msg =
        err.response?.data?.detail || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow"
      >
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-primary hover:underline"
          >
            Register
          </button>
        </p>

        <p className="text-xs text-center text-muted-foreground">
          <button
            type="button"
            onClick={() => router.push("/password-reset")}
            className="hover:underline"
          >
            Forgot password?
          </button>
        </p>
      </form>
    </div>
  );
}
