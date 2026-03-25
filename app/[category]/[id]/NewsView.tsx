import Image from "next/image";
import { Fragment, Suspense } from "react";
import styles from "./NewsView.module.css";
import Reactions from "@/components/news/reactions/Reactions";
import { FaCalendarAlt } from "react-icons/fa";
import LatestStories from "@/components/common/lateststories/LatestStories";
import ReadButton from "@/components/news/readbutton/ReadButton";
import Social from "@/components/news/social/Social";
import Tags from "@/components/news/tags/Tags";
import SuggestedNews from "@/components/news/suggestednews/SuggestedNews";
import CommentsServer from "@/components/news/comments/CommentsServer";
import NewsShare from "@/components/common/share/NewsShare";
import SmartAdUnit from "@/components/google-ads/SmartAdUnit";
import AdBlock from "@/components/google-ads/AdBlock";
import type { News } from "@/types";

type Props = {
  news: News;
  suggested: News[];
};

const INLINE_AD_SLOT = "3315432893";
const MAX_INLINE_ADS = 3;

function splitDescriptionForAds(html: string) {
  if (!html?.trim()) return [];

  const marker = "<!--__TTT_INLINE_AD__-->";
  const tagPattern =
    /(<p\b[^>]*>[\s\S]*?<\/p>|<img\b[^>]*\/?>|<iframe\b[^>]*>[\s\S]*?<\/iframe>|<video\b[^>]*>[\s\S]*?<\/video>)/gi;

  let output = "";
  let lastIndex = 0;
  let score = 0;
  let adCount = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(html)) !== null) {
    const matchedTag = match[0];
    const chunkEnd = tagPattern.lastIndex;
    output += html.slice(lastIndex, chunkEnd);

    if (/^<p\b/i.test(matchedTag.trim())) score += 1;
    else if (/^<(img|iframe|video)\b/i.test(matchedTag.trim())) score += 2;

    if (score >= 3 && adCount < MAX_INLINE_ADS) {
      output += marker;
      score = 0;
      adCount += 1;
    }
    lastIndex = chunkEnd;
  }

  output += html.slice(lastIndex);
  return output.split(marker).map((s) => s.trim()).filter(Boolean);
}

export default function NewsView({ news, suggested }: Props) {
  const descriptionHtml = news?.description?.te?.html || "";
  const contentSegments = splitDescriptionForAds(descriptionHtml);
  const date = new Date(news.createdAt);

  const time = new Intl.DateTimeFormat("te-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  const dayDate = new Intl.DateTimeFormat("te-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const formattedDate = `${time.toUpperCase()}, ${dayDate}`;

  return (
    <main className={styles.wrapper}>
      <div className={styles.left}>
        <h1 className={styles.title}>{news?.title?.te}</h1>

        <div className={styles.metaflex}>
          <div className={styles.meta}>
            <span><FaCalendarAlt /> {formattedDate}</span>
            {news?.audio?.te && <ReadButton news={news} />}
          </div>
          <NewsShare title={news?.title?.te} />
        </div>

        <div className={styles.imageWrap}>
          <Image src={news?.thumbnail} alt={news?.title?.te} fill sizes="800px" className={styles.image} />
        </div>

        {contentSegments.map((segment, index) => (
          <Fragment key={`content-${index}`}>
            <div className={styles.content} dangerouslySetInnerHTML={{ __html: segment }} />
            {index < contentSegments.length - 1 && (
              <AdBlock><SmartAdUnit slot={INLINE_AD_SLOT} /></AdBlock>
            )}
          </Fragment>
        ))}

        <Reactions newsId={news._id} targetModel="News" />
        <Suspense fallback={<div style={{ padding: 20 }}>కామెంట్లు లోడ్ అవుతున్నాయి...</div>}>
          <CommentsServer newsId={news._id} />
        </Suspense>
        <AdBlock><SmartAdUnit slot="3315432893" /></AdBlock>
        <SuggestedNews items={suggested} />
        <AdBlock><SmartAdUnit slot="9182003090" /></AdBlock>
      </div>

      <aside className={styles.right}>
        <Tags tags={news?.tags} />
        <AdBlock><SmartAdUnit slot="9180743912" /></AdBlock>
        <Social />
        <Suspense fallback={<div style={{ padding: 20 }}>తాజా కథనాలు లోడ్ అవుతున్నాయి...</div>}>
          <LatestStories />
        </Suspense>
        <AdBlock><SmartAdUnit slot="6909803795" /></AdBlock>
      </aside>
    </main>
  );
}
