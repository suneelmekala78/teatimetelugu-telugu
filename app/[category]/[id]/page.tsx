import { getNewsBySlug } from "@/lib/requests-server";
import NewsView from "./NewsView";
import { notFound } from "next/navigation";
import type { News } from "@/types";

type Props = {
  params: Promise<{
    category: string;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  try {
    const res = await getNewsBySlug(id);

    if (res?.success && res.news) {
      return {
        title: res.news.title?.te,
        description: res.news.description?.te?.text,
        openGraph: {
          images: [res.news.thumbnail],
        },
      };
    }
  } catch {}

  return { title: "టీ టైం తెలుగు" };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  let news: News | null = null;
  let related: News[] = [];

  try {
    const res = await getNewsBySlug(id);

    if (res?.success) {
      news = res.news;
    }
  } catch {}

  if (!news) notFound();

  // Fetch related news
  try {
    const { getRelatedNews } = await import("@/lib/requests-server");
    const relRes = await getRelatedNews(news._id);
    if (relRes?.success) {
      related = relRes.news || [];
    }
  } catch {}

  return <NewsView news={news} suggested={related} />;
}
