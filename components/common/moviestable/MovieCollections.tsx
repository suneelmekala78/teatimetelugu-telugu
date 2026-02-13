import MovieTabsTableClient from "./MovieTabsTableClient";
import { getMovieCollections } from "@/lib/requests";

export default async function MovieCollections() {
  let rows: any[] = [];

  try {
    const res = await getMovieCollections();
    if (res?.status === "success") {
      rows = res.movieCollections || [];
    }
  } catch {}

  return (
    <MovieTabsTableClient
      title="సినిమా సేకరణలు"
      tabs={[
        { label: "1వ రోజు AP&TS", value: "1st-day-ap&ts" },
        { label: "1వ రోజు WW", value: "1st-day-ww" },
        { label: "టోటల్ WW", value: "closing-ww" },
      ]}
      rows={rows}
      nameKey="movie"
      valueKey="amount"
    />
  );
}
