"use client";

import { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // using Sonner for better DX

// 🔹 Extract the actual form into its own component
function PasswordResetConfirmForm() {
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token: string | null = searchParams.get("token"); // ?token=xyz

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!token) {
      toast.error("Missing reset token.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/password_reset/confirm/", { token, password });
      toast.success("Password updated successfully!");
      router.push("/login");
    } catch (error: unknown) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-card p-6 rounded-2xl shadow-lg border"
      >
        <h1 className="text-2xl font-bold text-center">Set New Password</h1>
        <p className="text-sm text-muted-foreground text-center">
          Enter a strong new password to secure your account.
        </p>

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          required
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}

// 🔹 Wrap with Suspense to fix `useSearchParams` error
export default function PasswordResetConfirmPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <PasswordResetConfirmForm />
    </Suspense>
  );
}
