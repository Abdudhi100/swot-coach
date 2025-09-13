"use client";

import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import { Toaster } from "sonner";
import { AuthProvider } from "@/app/context/AuthContext";
import QueryProvider from "@/providers/query-provider";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Hide NavBar on auth pages
  const hideNav = ["/login", "/register"].includes(pathname);

  return (
    <QueryProvider>
      <AuthProvider>
        {!hideNav && <NavBar />}
        <main className="container mx-auto p-4">{children}</main>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </QueryProvider>
  );
}
