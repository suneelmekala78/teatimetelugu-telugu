import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 1800;

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const SITE_BASE = (
  process.env.NEXT_PUBLIC_CLIENT_URL ||
  process.env.NEXT_PUBLIC_REDIRECT_URL ||
  "https://teatimetelugu.com"
).replace(/\/$/, "");

const PAGE_SIZE = 100;
const MAX_ITEMS = 5000;
const MAX_PAGES = Math.ceil(MAX_ITEMS / PAGE_SIZE);
const REQUEST_TIMEOUT_MS = 8000;

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

type NewsItem = {
  newsId?: string;
  category?: { en?: string };
  createdAt?: string;
  updatedAt?: string;
};

type GalleryItem = {
  newsId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type VideoItem = {
  newsId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type PagedResponse<T> = {
  status?: string;
  pagination?: {
    totalPages?: number;
  };
  news?: T[];
  gallery?: T[];
  videos?: T[];
};

function toAbsolute(path: string) {
  return `${SITE_BASE}${path}`;
}

function toDate(value?: string) {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

async function fetchJson<T>(path: string, params: Record<string, string | number>) {
  if (!API_BASE) return null;

  const query = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, val]) => {
      acc[key] = String(val);
      return acc;
    }, {})
  ).toString();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response | null = null;

  try {
    res = await fetch(`${API_BASE}${path}?${query}`, {
      next: { revalidate },
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res?.ok) return null;

  return (await res.json()) as T;
}

async function getNewsUrls(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const data = await fetchJson<PagedResponse<NewsItem>>("/news/filter", {
      category: "",
      time: "",
      searchText: "",
      page,
      limit: PAGE_SIZE,
    });

    const items = data?.news ?? [];
    if (!items.length) break;

    for (const item of items) {
      if (!item.newsId) continue;
      const category = item.category?.en || "news";

      entries.push({
        url: toAbsolute(`/${category}/${item.newsId}`),
        lastModified: toDate(item.updatedAt || item.createdAt),
        changeFrequency: "hourly",
        priority: 1,
      });

      if (entries.length >= MAX_ITEMS) break;
    }

    if (entries.length >= MAX_ITEMS) break;

    const totalPages = data?.pagination?.totalPages;
    if (typeof totalPages === "number" && page >= totalPages) break;
  }

  return entries;
}

async function getGalleryUrls(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const data = await fetchJson<PagedResponse<GalleryItem>>("/gallery/filter", {
      category: "",
      time: "",
      searchText: "",
      page,
      limit: PAGE_SIZE,
    });

    const items = data?.gallery ?? [];
    if (!items.length) break;

    for (const item of items) {
      if (!item.newsId) continue;

      entries.push({
        url: toAbsolute(`/gallery/${item.newsId}`),
        lastModified: toDate(item.updatedAt || item.createdAt),
        changeFrequency: "daily",
        priority: 0.8,
      });

      if (entries.length >= MAX_ITEMS) break;
    }

    if (entries.length >= MAX_ITEMS) break;

    const totalPages = data?.pagination?.totalPages;
    if (typeof totalPages === "number" && page >= totalPages) break;
  }

  return entries;
}

async function getVideoUrls(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const data = await fetchJson<PagedResponse<VideoItem>>("/videos/filter", {
      category: "",
      time: "",
      searchText: "",
      page,
      limit: PAGE_SIZE,
    });

    const items = data?.videos ?? [];
    if (!items.length) break;

    for (const item of items) {
      if (!item.newsId) continue;

      entries.push({
        url: toAbsolute(`/videos/v/${item.newsId}`),
        lastModified: toDate(item.updatedAt || item.createdAt),
        changeFrequency: "daily",
        priority: 0.7,
      });

      if (entries.length >= MAX_ITEMS) break;
    }

    if (entries.length >= MAX_ITEMS) break;

    const totalPages = data?.pagination?.totalPages;
    if (typeof totalPages === "number" && page >= totalPages) break;
  }

  return entries;
}

function staticUrl(path: string, changeFrequency: ChangeFreq, priority: number) {
  return {
    url: toAbsolute(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  } satisfies MetadataRoute.Sitemap[number];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    staticUrl("/", "hourly", 1),
    staticUrl("/about-us", "monthly", 0.4),
    staticUrl("/contact-us", "monthly", 0.4),
    staticUrl("/privacy-policy", "monthly", 0.3),
    staticUrl("/gallery", "daily", 0.8),
    staticUrl("/videos", "daily", 0.8),
    staticUrl("/search", "daily", 0.5),
    staticUrl("/c/movies", "hourly", 0.9),
    staticUrl("/c/news", "hourly", 0.9),
    staticUrl("/c/politics", "hourly", 0.9),
    staticUrl("/c/gossips", "hourly", 0.9),
    staticUrl("/c/ott", "hourly", 0.8),
    staticUrl("/c/gallery", "daily", 0.7),
    staticUrl("/c/videos", "daily", 0.7),
    staticUrl("/c/reviews", "hourly", 0.8),
    staticUrl("/c/sports", "hourly", 0.8),
    staticUrl("/c/technology", "hourly", 0.8),
    staticUrl("/c/business", "hourly", 0.8),
    staticUrl("/c/health", "hourly", 0.8),
  ];

  const [newsEntries, galleryEntries, videoEntries] = await Promise.all([
    getNewsUrls(),
    getGalleryUrls(),
    getVideoUrls(),
  ]);

  const merged = [...staticEntries, ...newsEntries, ...galleryEntries, ...videoEntries];
  const dedup = new Map<string, MetadataRoute.Sitemap[number]>();

  for (const entry of merged) {
    dedup.set(entry.url, entry);
  }

  return Array.from(dedup.values());
}
