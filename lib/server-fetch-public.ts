const BASE = process.env.NEXT_PUBLIC_API_URL!;
const FETCH_TIMEOUT = 8000; // 8s — must finish before Netlify's 10s function timeout

export async function publicFetch(
  path: string,
  options?: { params?: Record<string, any>; revalidate?: number }
): Promise<any> {
  const { params, revalidate = 60 } = options || {};

  const query = params
    ? `?${new URLSearchParams(params as any).toString()}`
    : "";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const res = await fetch(`${BASE}${path}${query}`, {
      next: { revalidate },
      signal: controller.signal,
    });

    if (!res.ok) return null as any;

    return res.json();
  } catch {
    return null as any;
  } finally {
    clearTimeout(timer);
  }
}
