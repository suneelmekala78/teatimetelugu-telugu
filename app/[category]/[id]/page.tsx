import { getSingleNews } from "@/lib/requests";
import NewsView from "./NewsView";

type Props = {
  params: Promise<{
    category: string;
    id: string;
  }>;
};

/* ========= SEO ========= */
export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  try {
    const res = await getSingleNews(id);

    if (res?.status === "success") {
      return {
        title: res.news?.title?.te,
        description: res.news?.title?.te,
        openGraph: {
          images: [res.news?.mainUrl],
        },
      };
    }
  } catch {}

  return { title: "టీ టైం తెలుగు" };
}

/* ========= PAGE ========= */
export default async function Page({ params }: Props) {
  const { id } = await params;

  let news = null;
  let suggested = [];

  try {
    const res = await getSingleNews(id);

    if (res?.status === "success") {
      news = res.news;
      suggested = res.suggestedNews || [];
    }
  } catch {}

  if (!news) return <p style={{ padding: 40 }}>Not found</p>;

  return <NewsView news={news} suggested={suggested} />;
}
