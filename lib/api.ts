import axios from "axios";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/* ================= REFRESH ================= */

const refreshToken = async () => {
  try {
    await API.post("/auth/refresh-token");
    return true;
  } catch {
    return false;
  }
};

/* ================= INTERCEPTOR ================= */

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const errData = error.response?.data;

    if (original?.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (
      (errData?.tokenExpired || error.response?.status === 403) &&
      !original._retry
    ) {
      original._retry = true;

      const ok = await refreshToken();

      if (ok) return API(original);

      useUserStore.getState().logout();
      toast.error("Session expired. Please login again.");
    }

    toast.error(errData?.message || "Something went wrong");
    return Promise.reject(error);
  }
);

/* ================= GENERIC ================= */

export const api = async <T = any>({
  url,
  method = "GET",
  data,
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
}): Promise<T> => {
  const res = await API({ url, method, data });
  return res.data;
};
