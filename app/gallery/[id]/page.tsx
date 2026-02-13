import { getSingleGallery } from "@/lib/requests";
import GalleryView from "./GalleryView";

type Props = {
  params: Promise<{ id: string }>;
};

/* ========= SEO ========= */
export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  try {
    const res = await getSingleGallery(id);

    if (res?.status === "success") {
      return {
        title: res.gallery?.title?.te,
        description: res.gallery?.title?.te,
        openGraph: {
          images: [res.gallery?.galleryPics?.[0]],
        },
      };
    }
  } catch {}

  return { title: "టీ టైం తెలుగు" };
}

/* ========= PAGE ========= */
export default async function Page({ params }: Props) {
  const { id } = await params;

  let gallery = null;
  let suggested = [];

  try {
    const res = await getSingleGallery(id);

    if (res?.status === "success") {
      gallery = res.gallery;
      suggested = res.suggestedGallery || [];
    }
  } catch {}

  if (!gallery) return <p style={{ padding: 40 }}>Not found</p>;

  return <GalleryView gallery={gallery} suggested={suggested} />;
}
