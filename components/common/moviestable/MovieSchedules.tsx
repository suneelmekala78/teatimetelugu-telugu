import MovieTabsTableClient from "./MovieTabsTableClient";
import type { MovieEntry } from "@/types";

interface Props {
  rows?: MovieEntry[];
}

export default function MovieSchedules({ rows = [] }: Props) {
  return (
    <MovieTabsTableClient
      title="సినిమా విడుదలలు"
      tabs={[
        { label: "సినిమా", value: "movie" },
        { label: "ఓటీటీ", value: "ott" },
      ]}
      rows={rows as any[]}
      nameKey="movie"
      valueKey="releaseDate"
    />
  );
}
