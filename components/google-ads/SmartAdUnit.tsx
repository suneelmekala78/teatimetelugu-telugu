"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Props = {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
};

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function SmartAdUnit({
  slot,
  format = "auto",
  style,
  lazy = true,
}: Props) {
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement | null>(null);

  // ✅ MUST be HTMLModElement (because <ins> is typed like that)
  const insRef = useRef<HTMLModElement | null>(null);

  const [shouldRender, setShouldRender] = useState(!lazy);
  const hasCustomHeight = style?.height !== undefined;

  const mergedStyle: React.CSSProperties = {
    display: "block",
    ...style,
  };

  if (hasCustomHeight) {
    mergedStyle.minHeight = style?.height;
  }

  const containerStyle: React.CSSProperties | undefined = hasCustomHeight
    ? { minHeight: style?.height }
    : undefined;

  /* ---------------- Lazy Load ---------------- */
  useEffect(() => {
    if (!lazy || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  /* ---------------- Refresh On Route Change ---------------- */
  useEffect(() => {
    if (!shouldRender || !insRef.current) return;

    // Clear previous ad (important for Next.js SPA)
    insRef.current.innerHTML = "";

    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.debug("AdSense push skipped:", err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [pathname, shouldRender]);

  return (
    <div ref={containerRef} style={containerStyle}>
      {shouldRender && (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={mergedStyle}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={hasCustomHeight ? undefined : format}
          data-full-width-responsive={hasCustomHeight ? undefined : "true"}
        />
      )}
    </div>
  );
}
