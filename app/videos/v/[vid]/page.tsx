import { getVideoBySlug } from "@/lib/requests-server";
import VideoView from "./VideoView";
import { notFound } from "next/navigation";
import type { Video } from "@/types";

type Props = {
  params: Promise<{ vid: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { vid } = await params;

  try {
    const res = await getVideoBySlug(vid);

    if (res?.success && res.video) {
      return {
        title: res.video.title?.te,
        description: res.video.title?.te,
        openGraph: {
          images: [res.video.thumbnail],
        },
      };
    }
  } catch {}

  return { title: "టీ టైం తెలుగు" };
}

export default async function Page({ params }: Props) {
  const { vid } = await params;

  let video: Video | null = null;
  let relatedVideos: Video[] = [];
  let suggestedVideos: Video[] = [];

  try {
    const res = await getVideoBySlug(vid);
    if (res?.success) {
      video = res.video;
    }
  } catch {}

  if (!video) notFound();

  try {
    const { getRelatedVideos, getLatestVideos } = await import("@/lib/requests-server");
    const [relRes, sugRes] = await Promise.all([
      getRelatedVideos(video._id),
      getLatestVideos(),
    ]);
    if (relRes?.success) {
      relatedVideos = relRes.videos || [];
    }
    if (sugRes?.success) {
      suggestedVideos = (sugRes.videos || []).filter((v: Video) => v._id !== video!._id);
    }
  } catch {}

  return <VideoView video={video} related={relatedVideos} suggested={suggestedVideos} />;
}
