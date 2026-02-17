import { create } from "zustand";
import type { User } from "@/types/user";

/* ---------------- types ---------------- */

export type Reaction = {
  userId: string;
  type: string;
  _id: string;
};

interface UserState {
  user: User | null;
  reactions: Reaction[];

  /* auth */
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;

  /* reactions */
  setReactions: (r: Reaction[]) => void;
  addReaction: (r: Reaction) => void;
  removeReaction: (payload: {
    userId?: string;
    reactionId?: string;
  }) => void;

  /* optional helper */
  reset: () => void;
}

/* ---------------- store ---------------- */

export const useUserStore = create<UserState>((set) => ({
  /* state */
  user: null,
  reactions: [],

  /* ---------------- auth ---------------- */

  login: (user) => set({ user }),

  logout: () =>
    set({
      user: null,
    }),

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),

  /* ---------------- reactions ---------------- */

  setReactions: (reactions) => set({ reactions }),

  addReaction: (reaction) =>
    set((state) => ({
      reactions: [
        ...state.reactions.filter((r) => r.userId !== reaction.userId),
        reaction,
      ],
    })),

  removeReaction: ({ userId, reactionId }) =>
    set((state) => ({
      reactions: state.reactions.filter((r) =>
        reactionId ? r._id !== reactionId : r.userId !== userId
      ),
    })),

  /* ---------------- helper ---------------- */

  reset: () =>
    set({
      user: null,
      reactions: [],
    }),
}));
