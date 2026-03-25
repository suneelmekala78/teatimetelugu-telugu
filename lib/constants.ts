import { CATEGORIES, type CategoryKey } from "./categories";

export { CATEGORIES, type CategoryKey };

/**
 * Get the Telugu label for a category key.
 */
export function getCategoryLabel(key: string, lang: "en" | "te" = "te"): string {
  const cat = CATEGORIES[key as CategoryKey];
  return cat?.label[lang] ?? key;
}

/**
 * Get the Telugu label for a subcategory key within a category.
 */
export function getSubCategoryLabel(
  category: string,
  subCategory: string,
  lang: "en" | "te" = "te",
): string {
  const cat = CATEGORIES[category as CategoryKey];
  if (!cat) return subCategory;
  const sub = (cat.subCategories as Record<string, { en: string; te: string }>)[subCategory];
  return sub?.[lang] ?? subCategory;
}

/**
 * Format date in Telugu locale.
 */
export function formatDate(
  date: string | Date,
  opts?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("te-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(d);
}

/**
 * Format relative time (e.g., "5 నిమిషాల క్రితం").
 */
export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  const now = Date.now();
  const diff = now - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "ఇప్పుడే";
  if (minutes < 60) return `${minutes} నిమిషాల క్రితం`;
  if (hours < 24) return `${hours} గంటల క్రితం`;
  if (days < 7) return `${days} రోజుల క్రితం`;

  return formatDate(d);
}
