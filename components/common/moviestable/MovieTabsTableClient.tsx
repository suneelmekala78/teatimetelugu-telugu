"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/titles/SectionTitle";
import styles from "./MovieTabsTable.module.css";

interface Tab {
  label: string;
  value: string;
}

interface Props {
  title: string;
  tabs: Tab[];
  rows: any[];
  nameKey: string;   // movie name key
  valueKey: string;  // amount/date key
  nav?: string;
}

export default function MovieTabsTableClient({
  title,
  tabs,
  rows,
  nameKey,
  valueKey,
  nav,
}: Props) {
  const [active, setActive] = useState(tabs[0].value);

  const filtered = rows.filter(
    (r) => r?.category?.en === active
  );

  return (
    <section className={styles.container}>
      <SectionTitle title={title} nav={nav} />

      {/* ===== TABS ===== */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={`${styles.tab} ${
              active === tab.value ? styles.active : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== LIST ===== */}
      <div className={styles.list}>
        {/* header */}
        <div className={`${styles.row} ${styles.header}`}>
          <span>పేరు</span>
          <span>వివరాలు</span>
        </div>

        {filtered.map((item, i) => (
          <div key={i} className={styles.row}>
            <span>{item?.movie?.te || item?.[nameKey]?.te}</span>
            <span>{item?.[valueKey]?.te}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
