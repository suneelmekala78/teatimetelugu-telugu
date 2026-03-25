"use server";

import { cookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_API_URL!;
const FETCH_TIMEOUT = 8000;

export async function serverFetch<T = Record<string, unknown>>(
  path: string,
  options?: { params?: Record<string, string | number>; revalidate?: number },
): Promise<T | null> {
  const { params, revalidate = 60 } = options || {};

  const query = params
    ? `?${new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>(
          (acc, [k, v]) => { acc[k] = String(v); return acc; },
          {},
        ),
      ).toString()}`
    : "";

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(`${BASE}${path}${query}`, {
      headers: { Cookie: cookieHeader },
      next: { revalidate },
      signal: controller.signal,
    });

    if (!res.ok) return null;

    return res.json() as Promise<T>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
