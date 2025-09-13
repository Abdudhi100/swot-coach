"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface User {
  id: number;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch current user
  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<User>("/api/auth/me/");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logoutUser = useCallback(async () => {
    try {
      await api.post("/api/auth/logout/");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null); // reset context
      router.push("/login");
    }
  }, [router]);

  // Initial load
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
