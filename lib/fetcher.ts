const BASE = process.env.NEXT_PUBLIC_API_URL!;

/* ========= GENERIC FETCH HELPER ========= */

export async function fetchAPI<T = any>(
  path: string,
  options?: {
    params?: Record<string, any>;
    revalidate?: number;
  }
): Promise<T> {
  const { params, revalidate = 60 } = options || {};

  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";

  const res = await fetch(`${BASE}${path}${query}`, {
    credentials: "include",
    next: { revalidate }, // 🔥 Next.js caching
  });

  if (!res.ok) {
    throw new Error(`API failed: ${path}`);
  }

  return res.json();
}
