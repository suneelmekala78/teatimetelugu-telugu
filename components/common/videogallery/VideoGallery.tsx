import { getFilteredVideos } from "@/lib/requests";
import VideoGalleryClient from "./VideoGalleryClient";

/* ================= TYPES ================= */

interface Props {
  title: string;
  nav: string;
  subcategory: string;
  limit?: number;
}

export default async function VideoGallery({
  title,
  nav,
  subcategory,
  limit = 10,
}: Props) {
  let videos: any[] = [];

  try {
    const res = await getFilteredVideos({
      category: subcategory || "", // 🔥 dynamic
      searchText: "",
      page: 1,
      limit,
      subcategory, // 🔥 dynamic
    });

    if (res?.status === "success") {
      videos = res.videos;
    }
  } catch {
    videos = [];
  }

  if (!videos.length) return null;

  return (
    <VideoGalleryClient
      title={title}
      nav={nav}
      videos={videos}
    />
  );
}
