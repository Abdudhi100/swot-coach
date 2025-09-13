"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // ✅ use sonner

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/password_reset/", { email });
      toast.success("Email sent! Check your inbox for the reset link."); // ✅ sonner style
      setEmail(""); // clear input after success
    } catch (err) {
      toast.error("Failed to send reset email."); // ✅ simpler error toast
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
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
