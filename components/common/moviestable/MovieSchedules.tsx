import MovieTabsTableClient from "./MovieTabsTableClient";
import { getMovieReleases } from "@/lib/requests";

export default async function MovieSchedules() {
  let rows: any[] = [];

  try {
    const res = await getMovieReleases();
    if (res?.status === "success") {
      rows = res.movieReleases || [];
    }
  } catch {}

  return (
    <MovieTabsTableClient
      title="సినిమా విడుదలలు"
      tabs={[
        { label: "సినిమా", value: "movie" },
        { label: "ఓటీటీ", value: "ott" },
      ]}
      rows={rows}
      nameKey="movie"
      valueKey="date"
    />
  );
}
