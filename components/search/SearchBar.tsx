"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import styles from "./SearchBar.module.css";

type Props = {
  initial?: string;
};

export default function SearchBar({ initial = "" }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [text, setText] = useState(initial);

  /* sync when user navigates back/forward */
  useEffect(() => {
    setText(params.get("q") || "");
  }, [params]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const term = text.trim();

    if (!term) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search news..."
        className={styles.input}
      />

      <button type="submit" className={styles.button}>
        <IoSearchOutline /> <span>శోధించండి</span>
      </button>
    </form>
  );
}
