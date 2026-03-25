"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import styles from "./page.module.css";
import Suggestions from "@/components/search/Suggestions";
import SearchBar from "@/components/search/SearchBar";
import SearchGrid from "@/components/search/SearchGrid";
import LoadMore from "@/components/common/loadmore/LoadMore";
import NoResults from "@/components/search/NoResults";

interface Props {
  initialQuery: string;
  initialItems: unknown[];
  initialTotal: number;
  failed: boolean;
}

export default function SearchClient({ initialQuery, initialItems, initialTotal, failed }: Props) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [hasFailed, setHasFailed] = useState(failed);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  const limit = 9;
  const hasQuery = query.trim().length > 0;
  const canSearch = query.trim().length >= 3;
  const isBusy = isSearching || isPending;
  const hasMore = items.length < total;

  useEffect(() => {
    setQuery(initialQuery);
    setItems(initialItems);
    setPage(1);
    setTotal(initialTotal);
    setHasFailed(failed);
    setIsSearching(false);
  }, [initialQuery, initialItems, initialTotal, failed]);

  const handleSearch = (term: string) => {
    const clean = term.trim();
    setHasFailed(false);
    setIsSearching(true);
    setQuery(clean);
    setItems([]);
    setPage(1);
    setTotal(0);

    startTransition(() => {
      router.push(clean ? `/search?q=${encodeURIComponent(clean)}` : "/search");
      router.refresh();
    });
  };

  const handleLoadMore = async () => {
    if (!hasMore || isBusy || isLoadingMore) return;

    const nextPage = page + 1;
    try {
      setIsLoadingMore(true);
      const res = await api.get("/search", {
        params: { q: query, page: nextPage, limit },
      });

      if (!res.data?.success) {
        setHasFailed(true);
        return;
      }

      const newHits: unknown[] = [];
      let newTotal = 0;
      if (res.data.results) {
        for (const r of res.data.results) {
          const type = r.index === "gallery" ? "gallery" : r.index === "videos" ? "video" : "news";
          const tagged = (r.hits || []).map((h: any) => ({ ...h, type }));
          newHits.push(...tagged);
          newTotal += r.total || 0;
        }
      } else {
        newHits.push(...(res.data.hits || []));
        newTotal = res.data.total || 0;
      }
      setItems((prev) => [...prev, ...newHits]);
      setPage(nextPage);
      setTotal(newTotal);
    } catch {
      setHasFailed(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <>
      <SearchBar initial={query} onSearch={handleSearch} isLoading={isBusy} />

      {!hasQuery && <Suggestions />}

      {hasQuery && !canSearch && (
        <p className={`${styles.statusCard} ${styles.info}`}>కనీసం 3 అక్షరాలు ఇవ్వండి</p>
      )}

      {isBusy && canSearch && (
        <p className={`${styles.statusCard} ${styles.loading}`}>
          <span className={styles.loadingText}>
            <b className={styles.queryPill}>"{query}"</b> కోసం వెతుకుతున్నాం
            <span className={styles.loadingDots} aria-hidden="true"></span>
          </span>
        </p>
      )}

      {hasFailed && (
        <p className={`${styles.statusCard} ${styles.error}`}>
          ఫలితాలను లోడ్ చేయలేకపోయాం. మళ్లీ ప్రయత్నించండి.
        </p>
      )}

      {!isBusy && canSearch && !hasFailed && (
        <div className={styles.resultsMeta}>
          <p className={styles.resultsLabel}><span className={styles.queryPill}>"{query}"</span> కోసం ఫలితాలు</p>
          <p className={styles.resultsCount}><span className={styles.countPill}>{total}</span> దొరికాయి</p>
        </div>
      )}

      {items.length > 0 && <SearchGrid items={items} />}

      {hasMore && <LoadMore isLoading={isLoadingMore} onLoadMore={handleLoadMore} />}

      {canSearch && !hasFailed && !isBusy && items.length === 0 && <NoResults text={query} />}
    </>
  );
}
