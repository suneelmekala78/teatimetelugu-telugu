import { getSearchNews } from "@/lib/requests";

import SearchBar from "@/components/search/SearchBar";
import SearchGrid from "@/components/search/SearchGrid";
import Suggestions from "@/components/search/Suggestions";
import NoResults from "@/components/search/NoResults";

import styles from "./page.module.css";
import TabTitle from "@/components/common/titles/TabTitle";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const query = q?.trim() || "";

  let items: any[] = [];
  let failed = false;

  if (query.length >= 3) {
    try {
      const res = await getSearchNews(query);
      items = res?.results || [];
    } catch (err) {
      // console.error("Search failed:", err); 
      failed = true;
    }
  }

  return (
    <main className={styles.container}>
      <TabTitle title="శోధించండి" />

      <SearchBar initial={query} />

      {!query && <Suggestions />}

      {query.length > 0 && query.length < 3 && (
        <p className={styles.loading}>Enter minimum 3 letters</p>
      )}

      {failed && (
        <p className={styles.loading}>
          Something went wrong. Please try again.
        </p>
      )}

      {!failed && items.length > 0 && <SearchGrid items={items} />}

      {!failed && query.length >= 3 && items.length === 0 && (
        <NoResults text={query} />
      )}
    </main>
  );
}
