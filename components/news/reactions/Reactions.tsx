"use client";

import styles from "./Reactions.module.css";
import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { toggleReaction, getMyReaction } from "@/lib/requests-client";
import AuthPopupWrapper from "@/components/common/popups/auth/AuthPopupWrapper";
import type { ReactionSummary } from "@/types";
import { api } from "@/lib/api";

interface Props {
  newsId: string;
  targetModel?: "News" | "Gallery";
}

const REACTIONS = [
  { type: "happy", label: "సంతోషం", img: "/images/reactions/happy.png" },
  { type: "normal", label: "సాధారణ", img: "/images/reactions/normal.png" },
  { type: "amused", label: "నవ్వించారు", img: "/images/reactions/amused.png" },
  { type: "funny", label: "హాస్యాస్పదం", img: "/images/reactions/funny.png" },
  { type: "angry", label: "కోపం", img: "/images/reactions/angry.png" },
  { type: "sad", label: "దుఃఖం", img: "/images/reactions/sad.png" },
];

export default function Reactions({ newsId, targetModel = "News" }: Props) {
  const [isJoin, setIsJoin] = useState(false);
  const [summary, setSummary] = useState<ReactionSummary>({});
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const user = useUserStore((s) => s.user);

  // Fetch reaction summary
  useEffect(() => {
    api.get(`/reactions/${targetModel}/${newsId}/summary`)
      .then((res) => {
        if (res.data?.success) setSummary(res.data.summary || {});
      })
      .catch(() => {});
  }, [newsId, targetModel]);

  // Fetch my reaction
  useEffect(() => {
    if (!user) return;
    getMyReaction(targetModel, newsId)
      .then((res) => {
        if (res.data?.success) setMyReaction(res.data.type || null);
      })
      .catch(() => {});
  }, [newsId, targetModel, user]);

  const handleReact = async (type: string) => {
    if (!user) {
      toast.error("దయచేసి లాగిన్ చేయండి");
      setIsJoin(true);
      return;
    }

    const prevSummary = { ...summary };
    const prevMyReaction = myReaction;

    // Optimistic update
    const newSummary = { ...summary };
    if (myReaction) {
      newSummary[myReaction] = Math.max(0, (newSummary[myReaction] || 0) - 1);
    }
    if (myReaction !== type) {
      newSummary[type] = (newSummary[type] || 0) + 1;
      setMyReaction(type);
    } else {
      setMyReaction(null);
    }
    setSummary(newSummary);

    try {
      await toggleReaction({ target: newsId, targetModel, type });
    } catch {
      setSummary(prevSummary);
      setMyReaction(prevMyReaction);
      toast.error("స్పందన విఫలమైంది");
    }
  };

  const total = Object.values(summary).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>
          మీ స్పందన ఏమిటి? <span>{total} ఓట్లు</span>
        </h3>

        <div className={styles.grid}>
          {REACTIONS.map((r) => {
            const count = summary[r.type] || 0;
            const percent = total ? Math.round((count / total) * 100) : 0;
            const isSelected = myReaction === r.type;

            return (
              <button
                key={r.type}
                className={`${styles.box} ${isSelected ? styles.active : ""}`}
                onClick={() => handleReact(r.type)}
              >
                <Image src={r.img} alt={r.type} width={40} height={40} />
                <span>{r.label}</span>
                <b>{percent}%</b>
              </button>
            );
          })}
        </div>
      </div>

      <AuthPopupWrapper open={isJoin} onClose={() => setIsJoin(false)} />
    </>
  );
}
