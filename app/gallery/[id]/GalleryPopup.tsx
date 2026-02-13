"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./GalleryView.module.css";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
} from "react-icons/fa";

type Props = {
  images: string[];
  index: number;
  thumbnail: string;
};

export default function GalleryPopup({
  images,
  index: startIndex,
  thumbnail,
}: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(startIndex);
  const [fit, setFit] = useState<"contain" | "cover">("contain");

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  return (
    <>
      {/* THUMBNAIL */}
      <div className={styles.card} onClick={() => setOpen(true)}>
        <Image src={thumbnail} alt="" fill className={styles.img} />
      </div>

      {/* POPUP */}
      {open && (
        <div className={styles.popup}>
          <FaTimes className={styles.close} onClick={() => setOpen(false)} />

          <FaChevronLeft className={styles.navLeft} onClick={prev} />
          <FaChevronRight className={styles.navRight} onClick={next} />

          <FaEye
            className={styles.eye}
            onClick={() =>
              setFit((f) => (f === "contain" ? "cover" : "contain"))
            }
          />

          <div className={styles.popupImg}>
            <Image
              src={images[index]}
              alt=""
              fill
              style={{ objectFit: fit }}
            />
          </div>

          <span className={styles.count}>
            {index + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
