"use client";

import styles from "./Comments.module.css";
import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  FaThumbsUp,
  FaThumbsDown,
  FaReply,
  FaTrash,
  FaRegCommentDots,
} from "react-icons/fa";

import { useUserStore } from "@/store/useUserStore";
import {
  addNewsComment,
  addNewsReplyComment,
  likeNewsComment,
  dislikeNewsComment,
  deleteNewsComment,
} from "@/lib/requests-client";
import AuthPopup from "@/components/common/popups/auth/AuthPopup";

/* ---------------- types ---------------- */

interface Props {
  newsId: string;
  initialComments: any[];
}

function updateTree(
  comments: any[],
  id: string,
  updater: (item: any) => any,
): any[] {
  return comments.map((c) => {
    if (c._id === id) return updater({ ...c });

    if (Array.isArray(c.replies) && c.replies.length > 0) {
      return {
        ...c,
        replies: c.replies.map((r: any) =>
          r._id === id ? updater({ ...r }) : { ...r },
        ),
      };
    }

    return { ...c };
  });
}

function removeFromTree(comments: any[], id: string): any[] {
  return comments
    .filter((c) => c._id !== id)
    .map((c) => ({
      ...c,
      replies: c.replies?.filter((r: any) => r._id !== id) || [],
    }));
}

/* ---------------- component ---------------- */

export default function CommentsClient({ newsId, initialComments }: Props) {
  const { user } = useUserStore();
  const router = useRouter();

  /* SSR data becomes initial state */
  const [text, setText] = useState("");
  const [replyBox, setReplyBox] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isJoin, setIsJoin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>(() => {
    if (!Array.isArray(initialComments)) return [];

    // 🔥 detach from RSC reference
    return initialComments.map((c) => ({
      ...c,
      replies: c.replies ? [...c.replies] : [],
    }));
  });

  useEffect(() => {
    if (!Array.isArray(initialComments)) return;

    setComments((prev) => {
      // If we already have optimistic items, don't destroy them
      const hasOptimistic = prev.some((c) => c.optimistic);

      if (hasOptimistic) return prev;

      // Normal SSR sync (first load / navigation)
      return initialComments.map((c) => ({
        ...c,
        replies: c.replies ? [...c.replies] : [],
      }));
    });
  }, [initialComments]);

  /* ---------------- add comment ---------------- */

  const submitComment = async () => {
    if (!user) return setIsJoin(true);

    const value = text.trim();
    if (!value) return toast.error("కామెంట్ ఖాళీగా ఉండకూడదు");

    const tempId = "temp-" + Date.now();

    const optimisticComment = {
      _id: tempId,
      comment: value,
      news: newsId,
      createdAt: new Date().toISOString(),
      likes: [],
      dislikes: [],
      replies: [],
      postedBy: {
        _id: user._id,
        fullName: user.fullName,
        profileUrl: user.profileUrl,
      },
      language: "te",
      parentComment: null,
      optimistic: true,
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setText("");

    try {
      const res = await addNewsComment(newsId, {
        comment: value,
        language: "te",
      });

      const realComment = res?.data;
      if (!realComment) throw new Error("Invalid response");

      const normalized = {
        ...realComment,
        replies: realComment.replies ?? [],
      };

      setComments((prev) => {
        return prev.map((c) =>
          c._id === tempId ? { ...normalized, optimistic: false } : c,
        );
      });
    } catch {
      setComments((prev) => prev.filter((c) => c._id !== tempId));
      toast.error("Failed to add comment");
    }
  };

  /* ---------------- reply ---------------- */

  const submitReply = async (parentId: string) => {
    if (!user) return setIsJoin(true);
    if (!replyText.trim()) return;

    const tempId = "temp-" + Date.now();

    const optimisticReply = {
      _id: tempId,
      comment: replyText,
      createdAt: new Date().toISOString(),
      likes: [],
      dislikes: [],
      postedBy: {
        _id: user._id,
        fullName: user.fullName,
        profileUrl: user.profileUrl,
      },
      optimistic: true,
    };

    setComments((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.map((c) =>
        c._id === parentId
          ? { ...c, replies: [optimisticReply, ...(c.replies || [])] }
          : c,
      );
    });

    setReplyText("");

    try {
      const res = await addNewsReplyComment(newsId, {
        parentCommentId: parentId,
        comment: optimisticReply.comment,
        language: "te",
      });

      setComments((prev) =>
        prev.map((c) =>
          c._id === parentId
            ? {
                ...c,
                replies: [...c.replies].map((r: any) =>
                  r._id === tempId ? res.data : r,
                ),
              }
            : c,
        ),
      );
    } catch {
      // rollback
      setComments((prev) =>
        prev.map((c) =>
          c._id === parentId
            ? {
                ...c,
                replies: c.replies.filter((r: any) => r._id !== tempId),
              }
            : c,
        ),
      );
    }
  };

  /* ---------------- like/dislike ---------------- */

  const like = async (id: string) => {
    if (!user) return setIsJoin(true);

    const prev = comments;

    setComments((curr) =>
      updateTree(curr, id, (item) => {
        const liked = item.likes?.includes(user._id);

        return {
          ...item,
          likes: liked
            ? item.likes.filter((u: string) => u !== user._id)
            : [...(item.likes || []), user._id],
          dislikes: (item.dislikes || []).filter((u: string) => u !== user._id),
        };
      }),
    );

    try {
      await likeNewsComment(id);
    } catch {
      setComments(prev);
      toast.error("Failed to like");
    }
  };

  const dislike = async (id: string) => {
    if (!user) return setIsJoin(true);

    const prev = comments;

    setComments((curr) =>
      updateTree(curr, id, (item) => {
        const disliked = item.dislikes?.includes(user._id);

        return {
          ...item,
          dislikes: disliked
            ? item.dislikes.filter((u: string) => u !== user._id)
            : [...(item.dislikes || []), user._id],
          likes: (item.likes || []).filter((u: string) => u !== user._id),
        };
      }),
    );

    try {
      await dislikeNewsComment(id);
    } catch {
      setComments(prev);
      toast.error("Failed to dislike");
    }
  };

  /* ---------------- delete ---------------- */

  const openDeleteConfirm = (id: string) => {
    setCommentToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    const id = commentToDelete;
    const prev = comments;

    setComments((curr) => removeFromTree(curr, id));

    setShowDeleteConfirm(false);
    setCommentToDelete(null);

    try {
      await deleteNewsComment(id);
    } catch {
      setComments(prev);
      toast.error("Failed to delete");
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className={styles.wrapper}>
        <h3>కామెంట్స్ ({comments.length})</h3>

        {/* Add comment */}
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="కామెంట్ రాయండి..."
        />

        <button className={styles.primaryBtn} onClick={submitComment}>
          {user ? "పంపండి" : "లాగిన్"}
        </button>

        {comments.length === 0 && (
          <div className={styles.empty}>
            <FaRegCommentDots className={styles.emptyIcon} />
            <p className={styles.emptyText}>ఇప్పటికి కామెంట్స్ లేవు</p>
            <small className={styles.emptySub}>మొదటిగా కామెంట్ చేయండి!</small>
          </div>
        )}

        {/* List */}
        {comments.map((c) => (
          <div key={c._id} className={styles.comment}>
            {/* Avatar */}
            <div className={styles.avatar}>
              {c.postedBy?.profileUrl ? (
                <img src={c.postedBy.profileUrl} alt="user" />
              ) : (
                <span>{c.postedBy?.fullName?.charAt(0)?.toUpperCase()}</span>
              )}
            </div>

            {/* Body */}
            <div className={styles.body}>
              <div className={styles.header}>
                <span className={styles.name}>{c.postedBy?.fullName}</span>
                <span className={styles.time}>
                  {moment(c.createdAt).fromNow()}
                </span>
              </div>

              <p className={styles.text}>{c.comment}</p>

              {/* actions */}
              <div className={styles.actions}>
                <button
                  className={`${styles.actionBtn} ${
                    c.likes?.includes(user?._id) ? styles.liked : ""
                  }`}
                  onClick={() => like(c._id)}
                >
                  <FaThumbsUp /> {c.likes?.length || 0}
                </button>

                <button
                  className={`${styles.actionBtn} ${
                    c.dislikes?.includes(user?._id) ? styles.disliked : ""
                  }`}
                  onClick={() => dislike(c._id)}
                >
                  <FaThumbsDown /> {c.dislikes?.length || 0}
                </button>

                <button
                  className={styles.replyBtn}
                  onClick={() => setReplyBox(replyBox === c._id ? null : c._id)}
                >
                  <FaReply /> రిప్లై{" "}
                  {c.replies?.length > 0 && `(${c.replies.length})`}
                </button>

                {user?._id === c.postedBy?._id && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => openDeleteConfirm(c._id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              {/* reply box */}
              {replyBox === c._id && (
                <div className={styles.replyBox}>
                  <textarea
                    className={styles.textarea}
                    placeholder="మీ స్పందన రాయండి..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button
                    className={styles.primaryBtn}
                    onClick={() => submitReply(c._id)}
                  >
                    {user ? "పంపండి" : "లాగిన్"}
                  </button>
                </div>
              )}

              {/* replies */}
              {replyBox === c._id && c.replies?.length > 0 && (
                <div className={styles.replies}>
                  {c.replies.map((r: any) => (
                    <div key={r._id} className={styles.reply}>
                      <div className={styles.replyAvatar}>
                        {r.postedBy?.profileUrl ? (
                          <img src={r.postedBy.profileUrl} alt="user" />
                        ) : (
                          <span>
                            {r.postedBy?.fullName?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className={styles.replyContent}>
                        <div className={styles.header}>
                          <span className={styles.name}>
                            {r.postedBy?.fullName}
                          </span>
                          <span className={styles.time}>
                            {moment(r.createdAt).fromNow()}
                          </span>
                        </div>

                        <p>{r.comment}</p>

                        {/* reply actions */}
                        <div className={styles.actions}>
                          <button
                            className={`${styles.actionBtn} ${
                              r.likes?.includes(user?._id) ? styles.liked : ""
                            }`}
                            onClick={() => like(r._id)}
                          >
                            <FaThumbsUp /> {r.likes?.length || 0}
                          </button>

                          <button
                            className={`${styles.actionBtn} ${
                              r.dislikes?.includes(user?._id)
                                ? styles.disliked
                                : ""
                            }`}
                            onClick={() => dislike(r._id)}
                          >
                            <FaThumbsDown /> {r.dislikes?.length || 0}
                          </button>

                          {user?._id === r.postedBy?._id && (
                            <button
                              className={styles.deleteBtn}
                              onClick={() => openDeleteConfirm(r._id)}
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className={styles.deleteModal}>
          <div className={styles.deleteModalContent}>
            <p className={styles.deleteModalText}>
              మీరు ఖచ్చితంగా కామెంట్ తొలగించాలనుకుంటున్నారా?
            </p>
            <div className={styles.deleteModalActions}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.deleteCancelBtn}
              >
                లేదు
              </button>
              <button
                onClick={handleDelete}
                className={styles.deleteConfirmBtn}
              >
                అవును
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthPopup open={isJoin} onClose={() => setIsJoin(false)} />
    </>
  );
}
