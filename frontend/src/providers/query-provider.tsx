// src/providers/query-provider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useRef } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function QueryProvider({ children }: { children: ReactNode }) {
  // ✅ type-safe + avoids TS error
  const clientRef = useRef<QueryClient | null>(null);
  if (!clientRef.current) {
    clientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={clientRef.current}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
