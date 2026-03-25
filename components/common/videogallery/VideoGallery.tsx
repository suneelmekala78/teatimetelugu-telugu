import { getVideosBySubCategory } from "@/lib/requests-server";
import VideoGalleryClient from "./VideoGalleryClient";
import type { Video } from "@/types";

interface Props {
  title: string;
  nav: string;
  subcategory: string;
  limit?: number;
}

export default async function VideoGallery({ title, nav, subcategory, limit = 10 }: Props) {
  const res = await getVideosBySubCategory(subcategory, { limit });
  const videos: Video[] = res?.success ? res.videos : [];

  if (!videos.length) return null;

  return <VideoGalleryClient title={title} nav={nav} videos={videos} />;
}
