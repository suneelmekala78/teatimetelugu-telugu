import { searchContent } from "@/lib/requests-server";
import TabTitle from "@/components/common/titles/TabTitle";
import styles from "./page.module.css";
import SearchClient from "./SearchClient";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let initialItems: unknown[] = [];
  let initialTotal = 0;
  let failed = false;

  if (query.length >= 3) {
    try {
      const res = await searchContent({ q: query, page: 1, limit: 9 });
      if (res?.success) {
        if (res.results) {
          for (const r of res.results) {
            const type = r.index === "gallery" ? "gallery" : r.index === "videos" ? "video" : "news";
            const tagged = (r.hits as any[] || []).map((h: any) => ({ ...h, type }));
            initialItems.push(...tagged);
            initialTotal += r.total || 0;
          }
        } else {
          initialItems = (res.hits as any[]) || [];
          initialTotal = res.total || 0;
        }
      } else {
        failed = true;
      }
    } catch {
      failed = true;
    }
  }

  return (
    <main className={styles.container}>
      <TabTitle title="శోధించండి" />
      <SearchClient
        initialQuery={query}
        initialItems={initialItems}
        initialTotal={initialTotal}
        failed={failed}
      />
    </main>
  );
}
