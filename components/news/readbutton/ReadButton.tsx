"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ReadButton.module.css";
import { toast } from "sonner";
import { FaPlay, FaPause, FaStop, FaVolumeUp } from "react-icons/fa";
import { getSpeech } from "@/lib/requests";

/* ---------------- types ---------------- */

interface Props {
  news: {
    _id: string;
    title: { te: string };
    description: { en: string };
    newsAudio?: { te?: string };
  };
}

/* ---------------- component ---------------- */

export default function ReadButton({ news }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  /* ---------------- cleanup ---------------- */

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  /* ---------------- helpers ---------------- */

  const base64ToUrl = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return URL.createObjectURL(new Blob([bytes], { type: "audio/mp3" }));
  };

  /* ---------------- play ---------------- */

  const handlePlay = async () => {
    try {
      setLoading(true);

      let audioUrl = src;

      /* fetch audio only once */
      if (!audioUrl) {
        let base64 = news.newsAudio?.te;

        if (!base64) {
          const res = await getSpeech({
            newsId: news._id,
            text: `<p>శీర్షిక: ${news.title.te}</p>${news.description.en}`,
          });

          base64 = res?.audioContent;
        }

        if (!base64) {
          toast.error("Audio unavailable");
          return;
        }

        audioUrl = base64ToUrl(base64);
        setSrc(audioUrl);
      }

      if (!audioRef.current) return;

      audioRef.current.src = audioUrl;
      await audioRef.current.play();

      setPlaying(true);
      setPaused(false);
    } catch (err) {
      toast.error("Failed to play audio");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- pause ---------------- */

  const handlePause = () => {
    audioRef.current?.pause();
    setPlaying(false);
    setPaused(true);
  };

  /* ---------------- stop ---------------- */

  const handleStop = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    setPlaying(false);
    setPaused(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className={styles.wrapper}>
      <audio
        ref={audioRef}
        hidden
        onEnded={() => {
          setPlaying(false);
          setPaused(false);
        }}
      />

      {!playing && !paused && (
        <button
          onClick={handlePlay}
          disabled={loading}
          className={styles.primary}
        >
          <FaVolumeUp />
          {loading ? "లోడ్ అవుతోంది..." : "చదువు"}
        </button>
      )}

      {(playing || paused) && (
        <div className={styles.controls}>
          <button
            onClick={playing ? handlePause : handlePlay}
            className={styles.control}
          >
            {playing ? <FaPause /> : <FaPlay />}
            {playing ? "విరామం" : "చదువు"}
          </button>

          <button onClick={handleStop} className={styles.stop}>
            <FaStop /> ఆపు
          </button>
        </div>
      )}
    </div>
  );
}
