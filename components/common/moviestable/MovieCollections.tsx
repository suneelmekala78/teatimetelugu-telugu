import MovieTabsTableClient from "./MovieTabsTableClient";
import type { CollectionEntry } from "@/types";

interface Props {
  rows?: CollectionEntry[];
}

export default function MovieCollections({ rows = [] }: Props) {
  return (
    <MovieTabsTableClient
      title="సినిమా సేకరణలు"
      tabs={[
        { label: "1వ రోజు AP&TS", value: "1st-day-ap&ts" },
        { label: "1వ రోజు WW", value: "1st-day-ww" },
        { label: "టోటల్ WW", value: "closing-ww" },
      ]}
      rows={rows as any[]}
      nameKey="movie"
      valueKey="amount"
    />
  );
}
