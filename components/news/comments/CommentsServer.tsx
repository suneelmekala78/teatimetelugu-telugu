import { getComments } from "@/lib/requests-server";
import CommentsClient from "./CommentsClient";
import type { Comment } from "@/types";

interface Props {
  newsId: string;
  targetModel?: "News" | "Gallery";
}

export default async function CommentsServer({ newsId, targetModel = "News" }: Props) {
  let comments: Comment[] = [];

  try {
    const res = await getComments(targetModel, newsId, { language: "te" });
    if (res?.success) {
      comments = res.comments || [];
    }
  } catch (e) {
    console.error("Failed to fetch comments", e);
  }

  return <CommentsClient newsId={newsId} targetModel={targetModel} initialComments={comments} />;
}
