"use client";

import styles from "./Comments.module.css";
import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "sonner";

import {
  FaThumbsUp,
  FaThumbsDown,
  FaReply,
  FaTrash,
  FaRegCommentDots,
} from "react-icons/fa";

import { useUserStore } from "@/store/useUserStore";
import {
  getNewsComments,
  addNewsComment,
  addNewsReplyComment,
  likeNewsComment,
  dislikeNewsComment,
  deleteNewsComment,
} from "@/lib/requests";

/* ---------------- types ---------------- */

interface Props {
  newsId: string;
}

/* ---------------- component ---------------- */

export default function Comments({ newsId }: Props) {
  const { user } = useUserStore();

  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [replyBox, setReplyBox] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  /* ---------------- fetch ---------------- */

  const fetchComments = async () => {
    const res = await getNewsComments(newsId);
    if (res?.status === "success") {
      setComments(res.data.comments);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  /* ---------------- add comment ---------------- */

  const submitComment = async () => {
    if (!text.trim()) return toast.error("కామెంట్ ఖాళీగా ఉండకూడదు");

    await addNewsComment(newsId, { comment: text, language: "te" });
    setText("");
    fetchComments();
  };

  /* ---------------- reply ---------------- */

  const submitReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    await addNewsReplyComment(newsId, {
      parentCommentId: parentId,
      comment: replyText,
      language: "te",
    });

    setReplyBox(null);
    setReplyText("");
    fetchComments();
  };

  /* ---------------- like/dislike ---------------- */

  const like = async (id: string) => {
    await likeNewsComment(id);
    fetchComments();
  };

  const dislike = async (id: string) => {
    await dislikeNewsComment(id);
    fetchComments();
  };

  /* ---------------- delete ---------------- */

  const remove = async (id: string) => {
    const ok = confirm("Are you sure you want to delete?");
    if (!ok) return;

    await deleteNewsComment(id);
    fetchComments();
  };

  /* ---------------- helpers ---------------- */

  const direct = comments.filter((c) => !c.parentComment);
  const replies = (id: string) =>
    comments.filter((c) => c.parentComment === id);

  /* ---------------- UI ---------------- */

  return (
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

      {direct.length === 0 && (
        <div className={styles.empty}>
          <FaRegCommentDots className={styles.emptyIcon} />
          <p className={styles.emptyText}>ఇప్పటికి కామెంట్స్ లేవు</p>
          <small className={styles.emptySub}>మొదటిగా కామెంట్ చేయండి!</small>
        </div>
      )}

      {/* List */}
      {direct.map((c) => (
        <div key={c._id} className={styles.comment}>
          <div className={styles.header}>
            <b>{c.postedBy?.fullName}</b>
            <span>{moment(c.createdAt).fromNow()}</span>
          </div>

          <p>{c.comment}</p>

          {/* actions */}
          <div className={styles.actions}>
            <button
              className={`${styles.iconBtn} ${
                c.likes?.includes(user?._id) ? styles.active : ""
              }`}
              onClick={() => like(c._id)}
            >
              <FaThumbsUp /> {c.likes?.length || 0}
            </button>

            <button
              className={`${styles.iconBtn} ${
                c.dislikes?.includes(user?._id) ? styles.activeRed : ""
              }`}
              onClick={() => dislike(c._id)}
            >
              <FaThumbsDown /> {c.dislikes?.length || 0}
            </button>

            <button
              className={styles.iconBtn}
              onClick={() => setReplyBox(c._id)}
            >
              <FaReply /> Reply
            </button>

            {user?._id === c.postedBy?._id && (
              <button
                className={`${styles.iconBtn} ${styles.delete}`}
                onClick={() => remove(c._id)}
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
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button
                className={styles.primaryBtn}
                onClick={() => submitReply(c._id)}
              >
                Reply
              </button>
            </div>
          )}

          {/* replies */}
          {replies(c._id).map((r) => (
            <div key={r._id} className={styles.reply}>
              <b>{r.postedBy?.fullName}</b> — {r.comment}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
