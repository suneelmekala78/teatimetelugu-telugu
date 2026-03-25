"use client";

import { useState } from "react";
import Image from "next/image";
import SectionTitle from "@/components/common/titles/SectionTitle";
import type { Video } from "@/types";
import styles from "./VideoGallery.module.css";

interface Props {
  title: string;
  nav: string;
  videos: Video[];
}

export default function VideoGalleryClient({ title, nav, videos }: Props) {
  const [current, setCurrent] = useState(videos[0]);

  return (
    <section className={styles.container}>
      <SectionTitle title={title} nav={nav} />

      <div className={styles.gallery}>
        <div className={styles.player}>
          <iframe
            src={current.videoUrl}
            title={current.title?.te}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        </div>

        <div className={styles.list}>
          {videos.map((item) => (
            <button
              key={item._id}
              onClick={() => setCurrent(item)}
              className={`${styles.item} ${current._id === item._id ? styles.active : ""}`}
            >
              <div className={styles.thumb}>
                <Image src={item.thumbnail} alt={item.title?.te} fill sizes="120px" />
              </div>
              <span className={styles.itemTitle}>{item.title?.te}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
