import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL!;

async function serializeCookies() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export async function getServerUser() {
  const cookieHeader = await serializeCookies();

  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.user ?? null;
  } catch {
    return null;
  }
}
