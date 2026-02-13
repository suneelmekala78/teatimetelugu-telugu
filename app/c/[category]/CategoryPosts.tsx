import Link from "next/link";
import Image from "next/image";
import styles from "./CategoryPosts.module.css";
import { getCategoryNewsPosts } from "@/lib/requests";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const POSTS_PER_PAGE = 16;

interface Props {
  category: string;
  subcategory?: string;
  page: number;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("te-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default async function CategoryPosts({
  category,
  subcategory,
  page,
}: Props) {
  let posts: any[] = [];
  let totalPages = 1;

  try {
    const res = await getCategoryNewsPosts({
      category: category || "",
      subcategory: subcategory || "",
      page: page || 1,
      limit: POSTS_PER_PAGE || 16,
    });

    if (res?.status === "success") {
      posts = res.news || [];
      totalPages = Math.ceil((res.total || 0) / POSTS_PER_PAGE);
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
      {/* ===== POSTS GRID ===== */}
      <div className={styles.grid}>
        {posts.length ? (
          posts.map((post) => (
            <Link
              href={`/${post?.category?.en}/${post?.newsId}`}
              key={post._id}
              className={`${styles.card} ${styles.shadow}`}
            >
              <div className={styles.imageWrap}>
                <Image
                  src={post?.mainUrl}
                  alt={post?.title?.te}
                  fill
                  sizes="300px"
                  className={styles.image}
                />
              </div>

              <div className={styles.texts}>
                <span className={styles.meta}>
                  {post?.subCategory?.te || post?.category?.te} •{" "}
                  {formatDate(post?.createdAt)}
                </span>

                <h3 className={styles.title}>{post?.title?.te}</h3>
              </div>
            </Link>
          ))
        ) : (
          <p>ఫలితాలు ఏవీ దొరకలేదు!</p>
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {page > 1 && (
            <Link href={buildLink(page - 1)}>
              <FaAngleLeft />
            </Link>
          )}

          <span>
            పేజీ {page} / {totalPages}
          </span>

          {page < totalPages && (
            <Link href={buildLink(page + 1)}>
              <FaAngleRight />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
