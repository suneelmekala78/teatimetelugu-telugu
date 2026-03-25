import Link from "next/link";
import Image from "next/image";
import styles from "./CategoryPosts.module.css";
import { getCategoryNews } from "@/lib/requests-server";
import { getCategoryLabel, getSubCategoryLabel, formatDate } from "@/lib/constants";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import SmartAdUnit from "@/components/google-ads/SmartAdUnit";
import AdBlock from "@/components/google-ads/AdBlock";
import type { News } from "@/types";

const POSTS_PER_PAGE = 16;

interface Props {
  category: string;
  subcategory?: string;
  page: number;
}

export default async function CategoryPosts({ category, subcategory, page }: Props) {
  let posts: News[] = [];
  let totalPages = 1;

  try {
    const params: Record<string, string | number> = { page: page || 1, limit: POSTS_PER_PAGE };
    if (subcategory) params.subCategory = subcategory;

    const res = await getCategoryNews(category, params);

    if (res?.success) {
      posts = res.news || [];
      totalPages = res.pagination?.pages || 1;
    }
  } catch {
    return <p style={{ padding: 20 }}>Something went wrong.</p>;
  }

  const buildLink = (p: number) => {
    const query = new URLSearchParams();
    if (subcategory) query.set("subcategory", subcategory);
    query.set("page", String(p));
    return `/c/${category}?${query.toString()}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {posts.length ? (
          posts.map((post) => (
            <Link href={`/${post.category}/${post.slug}`} key={post._id} className={`${styles.card} ${styles.shadow}`}>
              <div className={styles.imageWrap}>
                <Image src={post.thumbnail} alt={post.title?.te} fill sizes="300px" className={styles.image} />
              </div>
              <div className={styles.texts}>
                <span className={styles.meta}>
                  {post.subCategory
                    ? getSubCategoryLabel(post.category, post.subCategory)
                    : getCategoryLabel(post.category)} • {formatDate(post.createdAt)}
                </span>
                <h3 className={styles.title}>{post.title?.te}</h3>
              </div>
            </Link>
          ))
        ) : (
          <p>ఫలితాలు ఏవీ దొరకలేదు!</p>
        )}
      </div>

      <AdBlock><SmartAdUnit slot="9182003090" /></AdBlock>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {page > 1 && <Link href={buildLink(page - 1)}><FaAngleLeft /></Link>}
          <span>పేజీ {page} / {totalPages}</span>
          {page < totalPages && <Link href={buildLink(page + 1)}><FaAngleRight /></Link>}
        </div>
      )}
    </div>
  );
}
