"use client";

const BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function clientFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...init,
  });

  if (!res.ok) throw new Error("Client request failed");

  return res.json();
}
