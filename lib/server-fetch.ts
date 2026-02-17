"use server";

import { cookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function serverFetch(
  path: string,
  options?: { params?: Record<string, any>; revalidate?: number }
): Promise<any> {
  const { params, revalidate = 60 } = options || {};

  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";

  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${BASE}${path}${query}`, {
    headers: { Cookie: cookieHeader },
    next: { revalidate },
  });

  if (!res.ok) return null as any;

  return res.json();
}
