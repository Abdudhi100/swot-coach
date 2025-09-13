"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PasswordResetPage() {
  const [email, setEmail] = useState<string>(""); // ✅ typed state
  const [loading, setLoading] = useState<boolean>(false); // ✅ typed state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/auth/password_reset/", { email });
      toast.success("Email sent! Check your inbox for the reset link.");
      setEmail(""); // ✅ reset input
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(`Failed: ${err.message}`);
      } else {
        toast.error("Failed to send reset email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-card p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-semibold text-center">Reset Password</h1>
        <Input
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          placeholder="Enter your email"
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}
