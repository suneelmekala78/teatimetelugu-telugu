"use client";

import styles from "./Comments.module.css";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaReply,
  FaTrash,
  FaRegCommentDots,
} from "react-icons/fa";
import { useUserStore } from "@/store/useUserStore";
import {
  createComment,
  getReplies,
  likeComment,
  dislikeComment,
  deleteComment,
} from "@/lib/requests-client";
import { timeAgo } from "@/lib/constants";
import AuthPopupWrapper from "@/components/common/popups/auth/AuthPopupWrapper";
import type { Comment } from "@/types";

interface Props {
  newsId: string;
  targetModel?: "News" | "Gallery";
  initialComments: Comment[];
}

function updateTree(comments: Comment[], id: string, updater: (c: Comment) => Comment): Comment[] {
  return comments.map((c) => (c._id === id ? updater({ ...c }) : { ...c }));
}

function removeFromTree(comments: Comment[], id: string): Comment[] {
  return comments.filter((c) => c._id !== id);
}

export default function CommentsClient({ newsId, targetModel = "News", initialComments }: Props) {
  const { user } = useUserStore();

  const [text, setText] = useState("");
  const [replyBox, setReplyBox] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isJoin, setIsJoin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>(() =>
    Array.isArray(initialComments) ? [...initialComments] : []
  );
  const [repliesMap, setRepliesMap] = useState<Record<string, Comment[]>>({});
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (Array.isArray(initialComments)) {
      setComments([...initialComments]);
    }
  }, [initialComments]);

  /* ── load replies for a comment ── */
  const loadReplies = useCallback(async (parentId: string) => {
    try {
      const res = await getReplies(parentId);
      if (res.data?.success && res.data.replies) {
        setRepliesMap((prev) => ({ ...prev, [parentId]: res.data.replies }));
      }
    } catch {
      toast.error("రిప్లైలు లోడ్ కాలేదు");
    }
  }, []);

  const toggleReplies = useCallback((parentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
    if (!repliesMap[parentId]) loadReplies(parentId);
  }, [repliesMap, loadReplies]);

  /* ── add comment ── */
  const submitComment = async () => {
    if (!user) return setIsJoin(true);
    const value = text.trim();
    if (!value) return toast.error("కామెంట్ ఖాళీగా ఉండకూడదు");

    const tempId = "temp-" + Date.now();
    const optimistic: Comment = {
      _id: tempId,
      text: value,
      target: newsId,
      targetModel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [],
      dislikes: [],
      author: { _id: user._id, fullName: user.fullName, avatar: user.avatar },
      language: "te",
      parentComment: null,
      isDeleted: false,
      deletedAt: null,
    };

    setComments((prev) => [optimistic, ...prev]);
    setText("");

    try {
      const res = await createComment({
        target: newsId,
        targetModel,
        text: value,
        language: "te",
      });

      if (res.data?.success && res.data.comment) {
        setComments((prev) =>
          prev.map((c) => (c._id === tempId ? res.data.comment : c))
        );
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      setComments((prev) => prev.filter((c) => c._id !== tempId));
      toast.error("కామెంట్ చేయడం విఫలమైంది");
    }
  };

  /* ── reply ── */
  const submitReply = async (parentId: string) => {
    if (!user) return setIsJoin(true);
    if (!replyText.trim()) return;

    try {
      const res = await createComment({
        target: newsId,
        targetModel,
        text: replyText.trim(),
        language: "te",
        parentComment: parentId,
      });

      if (res.data?.success && res.data.comment) {
        setRepliesMap((prev) => ({
          ...prev,
          [parentId]: [...(prev[parentId] || []), res.data.comment],
        }));
        setExpandedReplies((prev) => new Set(prev).add(parentId));
        setReplyText("");
        setReplyBox(null);
        toast.success("రిప్లై విజయవంతమైంది");
      }
    } catch {
      toast.error("రిప్లై విఫలమైంది");
    }
  };

  /* ── like/dislike ── */
  const updateReplies = (id: string, updater: (c: Comment) => Comment) => {
    setRepliesMap((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].map((r) => (r._id === id ? updater({ ...r }) : r));
      }
      return next;
    });
  };

  const handleLike = async (id: string) => {
    if (!user) return setIsJoin(true);
    const prevComments = [...comments];
    const prevReplies = { ...repliesMap };

    const updater = (item: Comment) => ({
      ...item,
      likes: item.likes.includes(user._id)
        ? item.likes.filter((u) => u !== user._id)
        : [...item.likes, user._id],
      dislikes: item.dislikes.filter((u) => u !== user._id),
    });

    setComments((curr) => updateTree(curr, id, updater));
    updateReplies(id, updater);

    try {
      await likeComment(id);
    } catch {
      setComments(prevComments);
      setRepliesMap(prevReplies);
      toast.error("విఫలమైంది");
    }
  };

  const handleDislike = async (id: string) => {
    if (!user) return setIsJoin(true);
    const prevComments = [...comments];
    const prevReplies = { ...repliesMap };

    const updater = (item: Comment) => ({
      ...item,
      dislikes: item.dislikes.includes(user._id)
        ? item.dislikes.filter((u) => u !== user._id)
        : [...item.dislikes, user._id],
      likes: item.likes.filter((u) => u !== user._id),
    });

    setComments((curr) => updateTree(curr, id, updater));
    updateReplies(id, updater);

    try {
      await dislikeComment(id);
    } catch {
      setComments(prevComments);
      setRepliesMap(prevReplies);
      toast.error("విఫలమైంది");
    }
  };

  /* ── delete ── */
  const openDeleteConfirm = (id: string) => {
    setCommentToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    const id = commentToDelete;
    const prevComments = [...comments];
    const prevReplies = { ...repliesMap };

    // Remove from top-level or from replies
    setComments((curr) => removeFromTree(curr, id));
    setRepliesMap((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].filter((r) => r._id !== id);
      }
      return next;
    });
    setShowDeleteConfirm(false);
    setCommentToDelete(null);

    try {
      await deleteComment(id);
    } catch {
      setComments(prevComments);
      setRepliesMap(prevReplies);
      toast.error("తొలగించడం విఫలమైంది");
    }
  };

  /* ── UI ── */
  const topLevel = comments.filter((c) => !c.parentComment);

  return (
    <>
      <div className={styles.wrapper}>
        <h3>కామెంట్స్ ({topLevel.length})</h3>

        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="కామెంట్ రాయండి..."
        />
        <button className={styles.primaryBtn} onClick={submitComment}>
          {user ? "పంపండి" : "లాగిన్"}
        </button>

        {topLevel.length === 0 && (
          <div className={styles.empty}>
            <FaRegCommentDots className={styles.emptyIcon} />
            <p className={styles.emptyText}>ఇప్పటికి కామెంట్స్ లేవు</p>
            <small className={styles.emptySub}>మొదటిగా కామెంట్ చేయండి!</small>
          </div>
        )}

        {topLevel.map((c) => (
          <div key={c._id} className={styles.comment}>
            <div className={styles.avatar}>
              {c.author?.avatar ? (
                <Image src={c.author.avatar} alt="user" width={36} height={36} className={styles.avatarImg} />
              ) : (
                <span>{c.author?.fullName?.charAt(0)?.toUpperCase()}</span>
              )}
            </div>

            <div className={styles.body}>
              <div className={styles.header}>
                <span className={styles.name}>{c.author?.fullName}</span>
                <span className={styles.time}>{timeAgo(c.createdAt)}</span>
              </div>
              <p className={styles.text}>{c.text}</p>

              <div className={styles.actions}>
                <button
                  className={`${styles.actionBtn} ${c.likes?.includes(user?._id || "") ? styles.liked : ""}`}
                  onClick={() => handleLike(c._id)}
                >
                  <FaThumbsUp /> {c.likes?.length || 0}
                </button>
                <button
                  className={`${styles.actionBtn} ${c.dislikes?.includes(user?._id || "") ? styles.disliked : ""}`}
                  onClick={() => handleDislike(c._id)}
                >
                  <FaThumbsDown /> {c.dislikes?.length || 0}
                </button>
                <button className={styles.replyBtn} onClick={() => {
                  const opening = replyBox !== c._id;
                  setReplyBox(opening ? c._id : null);
                  if (opening && !repliesMap[c._id]) {
                    loadReplies(c._id);
                    setExpandedReplies((prev) => new Set(prev).add(c._id));
                  }
                }}>
                  <FaReply /> రిప్లై
                </button>
                {user?._id === c.author?._id && (
                  <button className={styles.deleteBtn} onClick={() => openDeleteConfirm(c._id)}>
                    <FaTrash />
                  </button>
                )}
              </div>

              {replyBox === c._id && (
                <div className={styles.replyBox}>
                  <textarea
                    className={styles.textarea}
                    placeholder="మీ స్పందన రాయండి..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button className={styles.primaryBtn} onClick={() => submitReply(c._id)}>
                    {user ? "పంపండి" : "లాగిన్"}
                  </button>
                </div>
              )}

              {/* replies toggle */}
              {(repliesMap[c._id]?.length ?? 0) > 0 && !expandedReplies.has(c._id) && (
                <button className={styles.replyBtn} onClick={() => toggleReplies(c._id)} style={{ marginTop: 8 }}>
                  రిప్లైలు చూడండి ({repliesMap[c._id].length})
                </button>
              )}

              {expandedReplies.has(c._id) && !repliesMap[c._id] && (
                <button className={styles.replyBtn} onClick={() => toggleReplies(c._id)} style={{ marginTop: 8 }}>
                  రిప్లైలు చూడండి
                </button>
              )}

              {/* rendered replies */}
              {expandedReplies.has(c._id) && repliesMap[c._id]?.length > 0 && (
                <div className={styles.replies}>
                  <button className={styles.replyBtn} onClick={() => toggleReplies(c._id)} style={{ marginBottom: 8 }}>
                    రిప్లైలు దాచు
                  </button>
                  {repliesMap[c._id].map((r) => (
                    <div key={r._id} className={styles.reply}>
                      <div className={styles.replyAvatar}>
                        {r.author?.avatar ? (
                          <Image src={r.author.avatar} alt="user" width={28} height={28} className={styles.avatarImg} />
                        ) : (
                          <span>{r.author?.fullName?.charAt(0)?.toUpperCase()}</span>
                        )}
                      </div>
                      <div className={styles.body}>
                        <div className={styles.header}>
                          <span className={styles.name}>{r.author?.fullName}</span>
                          <span className={styles.time}>{timeAgo(r.createdAt)}</span>
                        </div>
                        <p className={styles.replyContent}>{r.text}</p>
                        <div className={styles.actions}>
                          <button
                            className={`${styles.actionBtn} ${r.likes?.includes(user?._id || "") ? styles.liked : ""}`}
                            onClick={() => handleLike(r._id)}
                          >
                            <FaThumbsUp /> {r.likes?.length || 0}
                          </button>
                          <button
                            className={`${styles.actionBtn} ${r.dislikes?.includes(user?._id || "") ? styles.disliked : ""}`}
                            onClick={() => handleDislike(r._id)}
                          >
                            <FaThumbsDown /> {r.dislikes?.length || 0}
                          </button>
                          {user?._id === r.author?._id && (
                            <button className={styles.deleteBtn} onClick={() => openDeleteConfirm(r._id)}>
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

      {showDeleteConfirm && (
        <div className={styles.deleteModal}>
          <div className={styles.deleteModalContent}>
            <p className={styles.deleteModalText}>మీరు ఖచ్చితంగా కామెంట్ తొలగించాలనుకుంటున్నారా?</p>
            <div className={styles.deleteModalActions}>
              <button onClick={() => setShowDeleteConfirm(false)} className={styles.deleteCancelBtn}>లేదు</button>
              <button onClick={handleDelete} className={styles.deleteConfirmBtn}>అవును</button>
            </div>
          </div>
        </div>
      )}

      <AuthPopupWrapper open={isJoin} onClose={() => setIsJoin(false)} />
    </>
  );
}
