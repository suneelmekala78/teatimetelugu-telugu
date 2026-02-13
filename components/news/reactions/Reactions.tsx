"use client";

import styles from "./Reactions.module.css";
import Image from "next/image";
import { toast } from "sonner";

import { useUserStore } from "@/store/useUserStore";
import { addNewsReaction, addGalleryReaction } from "@/lib/requests";

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
  const { user, reactions, addReaction } = useUserStore();

  const handleReact = async (type: string) => {
    if (!user) {
      toast.error("Login required");
      return;
    }

    const apiCall = isGallery ? addGalleryReaction : addNewsReaction;

    const res = await apiCall(newsId, {
      userId: user._id,
      type,
    });

    if (res?.status === "success") {
      addReaction({ userId: user._id, type, _id: res.reactionId });
    }
  };

  const total = reactions.length;

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        మీ స్పందన ఏమిటి? <span>{total} ఓట్లు</span>
      </h3>

      <div className={styles.grid}>
        {REACTIONS.map((r) => {
          const count = reactions.filter((x) => x.type === r.type).length;
          const percent = total ? Math.round((count / total) * 100) : 0;

          return (
            <button
              key={r.type}
              className={styles.box}
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
  );
}
