// src/lib/api.ts
import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  withCredentials: true,
});

// ---------------------
// CSRF Helper
// ---------------------
let csrfToken: string | undefined;

async function ensureCsrfToken(): Promise<string | undefined> {
  if (!csrfToken) {
    try {
      await axios.get(`${BASE_URL}/api/auth/csrf/`, {
        withCredentials: true,
      });
      csrfToken = Cookies.get("csrftoken");
    } catch (err) {
      console.error("Failed to fetch CSRF token:", err);
    }
  }
  return csrfToken;
}

// ---------------------
// Request interceptor → attach CSRF
// ---------------------
api.interceptors.request.use(async (config) => {
  const token = await ensureCsrfToken();
  if (token) {
    // ✅ Safe with Axios v1 types
    config.headers = config.headers || {};
    (config.headers as any).set
      ? (config.headers as any).set("X-CSRFToken", token)
      : (config.headers["X-CSRFToken"] = token);
  }
  return config;
});

// ---------------------
// Response interceptor → retry once on 403
// ---------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      csrfToken = undefined; // clear so it refreshes
      const token = await ensureCsrfToken();
      if (token) {
        originalRequest.headers = originalRequest.headers || {};
        (originalRequest.headers as any).set
          ? (originalRequest.headers as any).set("X-CSRFToken", token)
          : (originalRequest.headers["X-CSRFToken"] = token);
      }
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);
