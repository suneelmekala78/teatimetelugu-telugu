"use client";

import { api } from "./api";

/* ================= AUTH ================= */

export const logoutUser = () =>
  api.post("/auth/logout");

export const loginUser = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const registerUser = (data: { fullName: string; email: string; password: string }) =>
  api.post("/auth/register", data);

export const verifyRegistration = (data: { fullName: string; email: string; password: string; code: string }) =>
  api.post("/auth/verify-registration", data);

export const googleAuth = (data: { idToken: string }) =>
  api.post("/auth/google", data);

export const forgotPassword = (data: { email: string }) =>
  api.post("/auth/forgot-password", data);

export const verifyOtp = (data: { email: string; code: string }) =>
  api.post("/auth/verify-otp", data);

export const resetPassword = (data: { email: string; code: string; newPassword: string }) =>
  api.post("/auth/reset-password", data);

/* ================= CONTACT ================= */

export const submitContact = (data: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}) => api.post("/contact", data);

/* ================= REACTIONS ================= */

export const toggleReaction = (data: {
  target: string;
  targetModel: "News" | "Gallery";
  type: string;
}) => api.post("/reactions", data);

export const getMyReaction = (targetModel: string, targetId: string) =>
  api.get(`/reactions/${targetModel}/${targetId}/me`);

/* ================= COMMENTS ================= */

export const createComment = (data: {
  target: string;
  targetModel: "News" | "Gallery";
  text: string;
  language: string;
  parentComment?: string;
}) => api.post("/comments", data);

export const getReplies = (commentId: string) =>
  api.get(`/comments/replies/${commentId}`);

export const deleteComment = (id: string) =>
  api.delete(`/comments/${id}`);

export const likeComment = (id: string) =>
  api.post(`/comments/${id}/like`);

export const dislikeComment = (id: string) =>
  api.post(`/comments/${id}/dislike`);
