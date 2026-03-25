"use client";

/**
 * HydrateReactions is no longer needed — reactions are fetched
 * per-content via the /reactions/:targetModel/:targetId/summary API.
 * Kept as a passthrough wrapper for backward compatibility.
 */
export default function HydrateReactions({
  children,
}: {
  reactions?: unknown[];
  children: React.ReactNode;
}) {
  return children;
}
