"use client";

import styles from "./Reactions.module.css";
import Image from "next/image";
import { toast } from "sonner";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/store/useUserStore";
import { addNewsReaction, addGalleryReaction } from "@/lib/requests-client";
import AuthPopupWrapper from "@/components/common/popups/auth/AuthPopupWrapper";

/* ---------------- types ---------------- */

interface Props {
  newsId: string;
  isGallery?: boolean;
}

/* ---------------- config ---------------- */

const REACTIONS = [
  { type: "Happy", label: "సంతోషం", img: "/images/reactions/happy.png" },
  { type: "Normal", label: "సాధారణ", img: "/images/reactions/normal.png" },
  { type: "Amused", label: "నవ్వించారు", img: "/images/reactions/amused.png" },
  { type: "Funny", label: "హాస్యాస్పదం", img: "/images/reactions/funny.png" },
  { type: "Angry", label: "కోపం", img: "/images/reactions/angry.png" },
  { type: "Sad", label: "దుఃఖం", img: "/images/reactions/sad.png" },
];

/* ---------------- component ---------------- */

export default function Reactions({ newsId, isGallery }: Props) {
  const [isJoin, setIsJoin] = useState(false);
  const router = useRouter();

  const { user, reactions, addReaction, removeReaction } = useUserStore();

  const handleReact = async (type: string) => {
    if (!user) {
      toast.error("Login required");
      setIsJoin(true);
      return;
    }

    const apiCall = isGallery ? addGalleryReaction : addNewsReaction;

    /* optimistic update */
    addReaction({
      userId: user._id,
      type,
      _id: "temp",
    });

    try {
      await apiCall(newsId, {
        userId: user._id,
        type,
      });
    } catch {
      removeReaction({ userId: user._id });
      toast.error("Failed to react");
      return;
    }

    /* soft refresh to sync counts */
    startTransition(() => {
      router.refresh();
    });
  };

  const total = reactions.length;

  return (
    <>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>
          మీ స్పందన ఏమిటి? <span>{total} ఓట్లు</span>
        </h3>

        <div className={styles.grid}>
          {REACTIONS.map((r) => {
            const count = reactions.filter((x) => x.type === r.type).length;
            const percent = total ? Math.round((count / total) * 100) : 0;

            const isSelected = reactions.find(
              (x) => x.userId === user?._id && x.type === r.type,
            );

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
