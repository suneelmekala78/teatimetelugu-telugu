import { api } from "./api";
import { fetchAPI } from "./fetcher";

/* ================= AUTH (mutations → axios) ================= */

export const logoutUser = () =>
  api({ url: "/auth/logout", method: "POST" });

export const loginUser = (data: any) =>
  api({ url: "/auth/login", method: "POST", data });

export const sendAdminForgotPassword = (data: any) =>
  api({ url: "/auth/admin/forgot-password", method: "POST", data });

export const sendWriterForgotPassword = (data: any) =>
  api({ url: "/auth/writer/forgot-password", method: "POST", data });

export const resetAdminPassword = (token: string, data: any) =>
  api({ url: `/auth/admin/reset-password/${token}`, method: "POST", data });

/* ================= AUTH (GET → fetch) ================= */

export const getLoggedInUser = () =>
  fetchAPI("/user/me", { revalidate: 0 }); // no cache

/* ================= HOME ================= */

export const getHomeGridPosts = () =>
  fetchAPI("/home/get-featured-posts");

export const getTopNinePosts = () =>
  fetchAPI("/home/get-top-nine");

export const getTrendingNews = () =>
  fetchAPI("/news/trending");

export const getHotTopics = () =>
  fetchAPI("/home/get-hot-topics");

export const getBreakingNews = () =>
  fetchAPI("/home/get-breaking-news");

export const getCategoryTopPosts = (category: string) =>
  fetchAPI("/home/get-category-top", { params: { category } });

export const getMovieReleases = () =>
  fetchAPI("/home/get-movie-releases");

export const getMovieCollections = () =>
  fetchAPI("/home/get-movie-collections");

/* ================= CONTACT ================= */

export const contactUsEmail = (data: any) =>
  api({ url: "/user/contact-mail", method: "POST", data });

export const adWithUsEmail = (data: any) =>
  api({ url: "/user/ad-mail", method: "POST", data });

/* ================= REACTIONS ================= */

export const addNewsReaction = (id: string, data: any) =>
  api({ url: `/news/${id}/add-reaction`, method: "PUT", data });

export const addGalleryReaction = (id: string, data: any) =>
  api({ url: `/gallery/${id}/add-reaction`, method: "PUT", data });

/* ================= COMMENTS ================= */

export const getNewsComments = (id: string) =>
  fetchAPI(`/comments/${id}`, { params: { language: "te" }, revalidate: 0 });

export const addNewsComment = (id: string, data: any) =>
  api({ url: `/comments/${id}/add-comment`, method: "POST", data });

export const addNewsReplyComment = (id: string, data: any) =>
  api({ url: `/comments/${id}/add-reply-comment`, method: "POST", data });

export const deleteNewsComment = (id: string) =>
  api({ url: `/comments/${id}`, method: "DELETE" });

export const likeNewsComment = (id: string) =>
  api({ url: `/comments/${id}/like-comment`, method: "PUT" });

export const dislikeNewsComment = (id: string) =>
  api({ url: `/comments/${id}/dislike-comment`, method: "PUT" });

/* ================= ADS ================= */

export const getPopupPoster = () =>
  fetchAPI("/home/get-popup-poster");

export const getMoviePoster = () =>
  fetchAPI("/home/get-movie-poster");

export const getNavbarAd = () =>
  fetchAPI("/home/get-navbar-ad");

export const getHomeLongAd = () =>
  fetchAPI("/home/get-home-long-ad");

export const getHomeShortAd = () =>
  fetchAPI("/home/get-home-short-ad");

export const getCategoryLongAd = () =>
  fetchAPI("/home/get-category-long-ad");

export const getCategoryShortAd = () =>
  fetchAPI("/home/get-category-short-ad");

export const getNewsLongAd = () =>
  fetchAPI("/home/get-news-long-ad");

export const getNewsShortAd = () =>
  fetchAPI("/home/get-news-short-ad");

/* ================= NEWS ================= */

export const getLatestNews = () =>
  fetchAPI("/news/latest", { revalidate: 120 });

export const getFilteredNews = (params: any) =>
  fetchAPI("/news/filter", { params });

export const getCategoryNewsPosts = (params: any) =>
  fetchAPI("/news/category", { params, revalidate: 120 });

export const getSingleNews = (id: string) =>
  fetchAPI(`/news/n/${id}`, { revalidate: 300 });

export const getSearchNews = (query: string, page = 1, limit = 9, type = "all") =>
  fetchAPI("/news/search", {
    params: { query, page, limit, type },
  });

/* ================= SPEECH ================= */

export const getSpeech = (data: { text: string; newsId: string }) =>
  api({ url: "/speech/text-to-speech", method: "POST", data });

/* ================= GALLERY ================= */

export const getFilteredGallery = (params: any) =>
  fetchAPI("/gallery/filter", { params });

export const getSingleGallery = (id: string) =>
  fetchAPI(`/gallery/g/${id}`);

/* ================= VIDEOS ================= */

export const getFilteredVideos = (params: any) =>
  fetchAPI("/videos/filter", { params });

export const getVideo = (id: string) =>
  fetchAPI(`/videos/v/${id}`);
