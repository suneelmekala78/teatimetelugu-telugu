import { create } from "zustand";
import type { User } from "@/types";

interface UserState {
  user: User | null;

  /* auth */
  login: (user: User, token?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;

  /* helper */
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  login: (user, token) => {
    if (token && typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    set({ user: null });
  },

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),

  reset: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    set({ user: null });
  },
}));
