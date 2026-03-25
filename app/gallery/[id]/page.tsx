import { getGalleryBySlug } from "@/lib/requests-server";
import GalleryView from "./GalleryView";
import { notFound } from "next/navigation";
import type { Gallery } from "@/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  try {
    const res = await getGalleryBySlug(id);

    if (res?.success && res.gallery) {
      return {
        title: res.gallery.title?.te,
        description: res.gallery.description?.te?.text,
        openGraph: {
          images: [res.gallery.images?.[0] || res.gallery.thumbnail],
        },
      };
    }
  } catch {}

  return { title: "టీ టైం తెలుగు" };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  let gallery: Gallery | null = null;
  let relatedGalleries: Gallery[] = [];

  try {
    const res = await getGalleryBySlug(id);
    if (res?.success) {
      gallery = res.gallery;
    }
  } catch {}

  if (!gallery) notFound();

  try {
    const { getRelatedGallery } = await import("@/lib/requests-server");
    const relRes = await getRelatedGallery(gallery._id);
    if (relRes?.success) {
      relatedGalleries = relRes.galleries || [];
    }
  } catch {}

  return <GalleryView gallery={gallery} suggested={relatedGalleries} />;
}
