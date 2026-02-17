"use client";

import axios from "axios";
import { useUserStore } from "@/store/useUserStore";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // VERY IMPORTANT
});

/* ---------- refresh logic ---------- */

let isRefreshing = false;
let queue: any[] = [];

const processQueue = (error: any) => {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  queue = [];
};

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry
    ) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: () => resolve(API(original)),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true } // browser stores new cookies here
        );

        processQueue(null);
        return API(original);
      } catch (err) {
        processQueue(err);
        useUserStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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
