import { serverFetch } from "./server-fetch";
import { publicFetch } from "./server-fetch-public";
import type { News, Gallery, Video, Comment, HomeConfig, ReactionSummary, Pagination } from "@/types";

/* ── Response helpers ──────────────────────────────────────────────── */

interface ApiOk { success: boolean }

interface NewsBySlugRes extends ApiOk { news: News }
interface NewsListRes extends ApiOk { news: News[]; pagination?: Pagination }
interface HomeRes extends ApiOk { config: HomeConfig }
interface GalleryBySlugRes extends ApiOk { gallery: Gallery }
interface GalleryListRes extends ApiOk { galleries: Gallery[]; pagination?: Pagination }
interface VideoBySlugRes extends ApiOk { video: Video }
interface VideoListRes extends ApiOk { videos: Video[]; pagination?: Pagination }
interface CommentsRes extends ApiOk { comments: Comment[] }
interface ReactionSummaryRes extends ApiOk { summary: ReactionSummary }
interface AuthMeRes extends ApiOk { user: { _id: string; fullName: string; email: string; avatar: string; role: string } }
interface SearchRes extends ApiOk {
  query: string;
  hits?: unknown[];
  total?: number;
  results?: Array<{ index: string; hits: unknown[]; total: number }>;
}

/* ================= AUTH ================= */

export const getLoggedInUser = () =>
  serverFetch<AuthMeRes>("/auth/me", { revalidate: 0 });

/* ================= HOME ================= */

export const getHomeConfig = () =>
  publicFetch<HomeRes>("/home");

/* ================= NEWS ================= */

export const getLatestNews = (limit = 12) =>
  publicFetch<NewsListRes>("/news/latest", { params: { limit }, revalidate: 120 });

export const getMostViewedNews = () =>
  publicFetch<NewsListRes>("/news/most-viewed", { revalidate: 120 });

export const getPublishedNews = (params: Record<string, string | number>) =>
  publicFetch<NewsListRes>("/news/published", { params, revalidate: 120 });

export const getCategoryNews = (category: string, params?: Record<string, string | number>) =>
  publicFetch<NewsListRes>(`/news/category/${category}`, { params, revalidate: 120 });

export const getRelatedNews = (id: string) =>
  publicFetch<NewsListRes>(`/news/related/${id}`, { revalidate: 300 });

export const getNewsBySlug = (slug: string) =>
  publicFetch<NewsBySlugRes>(`/news/slug/${slug}`, { revalidate: 300 });

/* ================= SEARCH ================= */

export const searchContent = (params: Record<string, string | number>) =>
  publicFetch<SearchRes>("/search", { params, revalidate: 0 });

/* ================= REACTIONS ================= */

export const getReactionSummary = (targetModel: string, targetId: string) =>
  publicFetch<ReactionSummaryRes>(`/reactions/${targetModel}/${targetId}/summary`, { revalidate: 0 });

/* ================= COMMENTS ================= */

export const getComments = (targetModel: string, targetId: string, params?: Record<string, string | number>) =>
  publicFetch<CommentsRes>(`/comments/${targetModel}/${targetId}`, { params, revalidate: 0 });

/* ================= GALLERY ================= */

export const getPublishedGallery = (params: Record<string, string | number>) =>
  publicFetch<GalleryListRes>("/gallery/published", { params });

export const getLatestGallery = () =>
  publicFetch<GalleryListRes>("/gallery/latest", { revalidate: 120 });

export const getGalleryBySlug = (slug: string) =>
  publicFetch<GalleryBySlugRes>(`/gallery/slug/${slug}`);

export const getRelatedGallery = (id: string) =>
  publicFetch<GalleryListRes>(`/gallery/related/${id}`, { revalidate: 300 });

/* ================= VIDEOS ================= */

export const getPublishedVideos = (params: Record<string, string | number>) =>
  publicFetch<VideoListRes>("/videos/published", { params });

export const getLatestVideos = () =>
  publicFetch<VideoListRes>("/videos/latest", { revalidate: 120 });

export const getVideosBySubCategory = (subCategory: string, params?: Record<string, string | number>) =>
  publicFetch<VideoListRes>(`/videos/subcategory/${subCategory}`, { params });

export const getVideoBySlug = (slug: string) =>
  publicFetch<VideoBySlugRes>(`/videos/slug/${slug}`);

export const getRelatedVideos = (id: string) =>
  publicFetch<VideoListRes>(`/videos/related/${id}`, { revalidate: 300 });
