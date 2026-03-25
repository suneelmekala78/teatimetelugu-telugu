"use client";

import { useState } from "react";
import SectionTitle from "@/components/common/titles/SectionTitle";
import styles from "./MovieTabsTable.module.css";

interface Tab {
  label: string;
  value: string;
}

interface BilingualField {
  en: string;
  te: string;
}

interface Row {
  movie?: BilingualField;
  category?: BilingualField;
  [key: string]: BilingualField | string | undefined;
}

interface Props {
  title: string;
  tabs: Tab[];
  rows: Row[];
  nameKey: string;
  valueKey: string;
  nav?: string;
}

export default function MovieTabsTableClient({ title, tabs, rows, nameKey, valueKey, nav }: Props) {
  const [active, setActive] = useState(tabs[0]?.value || "");

  const filtered = rows.filter((r) => r?.category?.en === active);

  return (
    <section className={styles.container}>
      <SectionTitle title={title} nav={nav} />

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={`${styles.tab} ${active === tab.value ? styles.active : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        <div className={`${styles.row} ${styles.header}`}>
          <span>పేరు</span>
          <span>వివరాలు</span>
        </div>

        {filtered.map((item, i) => {
          const name = item?.movie?.te || (item?.[nameKey] as BilingualField | undefined)?.te;
          const value = (item?.[valueKey] as BilingualField | undefined)?.te;
          return (
            <div key={i} className={styles.row}>
              <span>{name}</span>
              <span>{value}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
