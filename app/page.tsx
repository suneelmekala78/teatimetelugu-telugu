import { Suspense } from "react";
import "@/components/home/home.css";
import FeaturedGrid from "@/components/home/featured/FeaturedGrid";
import ScrollGrid from "@/components/home/scroll/ScrollGrid";
import TrendingGrid from "@/components/home/trending/TrendingGrid";
import GalleryGrid from "@/components/home/gallery/GalleryGrid";
import MostViewed from "@/components/home/mostviewed/MostViewed";
import ReviewsGrid from "@/components/home/reviews/ReviewsGrid";
import CategoryTopGrid from "@/components/home/categorytop/CategoryTopGrid";
import VideoGallery from "@/components/common/videogallery/VideoGallery";
import MoreStories from "@/components/home/morestories/MoreStories";
import OtherPosts from "@/components/other/OtherPosts";
import MovieCollections from "@/components/common/moviestable/MovieCollections";
import MovieSchedules from "@/components/common/moviestable/MovieSchedules";
import Discover from "@/components/common/discover/Discover";
import BreakingNews from "@/components/common/breakingnews/BreakingNews";
import SmartAdUnit from "@/components/google-ads/SmartAdUnit";
import AdBlock from "@/components/google-ads/AdBlock";
import { getHomeConfig } from "@/lib/requests-server";
import type { HomeConfig } from "@/types";
import {
  BreakingNewsSkeleton,
  FeaturedSkeleton,
  TrendingSkeleton,
  ScrollSkeleton,
  GallerySkeleton,
  MostViewedSkeleton,
  ReviewsSkeleton,
  CategoryTopSkeleton,
  VideoGallerySkeleton,
  MoreStoriesSkeleton,
  OtherPostsSkeleton,
  MovieTableSkeleton,
} from "@/components/home/skeletons/HomeSectionSkeletons";

export const dynamic = "force-dynamic";

export default async function Home() {
  const res = await getHomeConfig();
  const config: HomeConfig | null = res?.success ? res.config : null;

  return (
    <div className="home-page">
      <BreakingNews news={config?.breakingNews} />

      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedGrid />
      </Suspense>

      <AdBlock>
        <SmartAdUnit slot="3315432893" />
      </AdBlock>

      <div className="duo-content">
        <div className="duo-content-left">
          <TrendingGrid news={config?.trendingNews} />
          <AdBlock>
            <SmartAdUnit slot="3315432893" style={{ height: "150px" }} />
          </AdBlock>
        </div>
        <div className="duo-content-right">
          <AdBlock>
            <SmartAdUnit slot="9180743912" />
          </AdBlock>
          <ScrollGrid news={config?.hotTopics} />
        </div>
      </div>

      <Suspense fallback={<GallerySkeleton />}>
        <GalleryGrid />
      </Suspense>

      <AdBlock>
        <SmartAdUnit slot="3315432893" />
      </AdBlock>

      <Suspense fallback={<MostViewedSkeleton />}>
        <MostViewed />
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsGrid />
      </Suspense>

      <AdBlock>
        <SmartAdUnit slot="3315432893" style={{ height: "150px" }} />
      </AdBlock>

      <Suspense fallback={<CategoryTopSkeleton />}>
        <CategoryTopGrid />
      </Suspense>

      <Suspense fallback={<VideoGallerySkeleton />}>
        <VideoGallery
          title="కొత్త ట్రైలర్లు"
          nav="/videos?subcategory=trailers-teasers"
          subcategory="trailers-teasers"
        />
      </Suspense>

      <AdBlock>
        <SmartAdUnit slot="3315432893" style={{ height: "150px" }} />
      </AdBlock>

      <Suspense fallback={<MoreStoriesSkeleton />}>
        <MoreStories />
      </Suspense>

      <Suspense fallback={<OtherPostsSkeleton />}>
        <OtherPosts category="technology" />
      </Suspense>

      <AdBlock>
        <SmartAdUnit slot="3315432893" style={{ height: "150px" }} />
      </AdBlock>

      <Suspense fallback={<OtherPostsSkeleton />}>
        <OtherPosts category="business" />
      </Suspense>

      <Suspense fallback={<OtherPostsSkeleton />}>
        <OtherPosts category="health" />
      </Suspense>

      <Suspense fallback={<VideoGallerySkeleton />}>
        <VideoGallery
          title="లిరికల్ సాంగ్స్"
          nav="/videos?subcategory=lyrical-songs"
          subcategory="lyrical-songs"
        />
      </Suspense>

      <div className="movies-tables-section">
        <MovieSchedules rows={config?.movieReleases} />
        <MovieCollections rows={config?.movieCollections} />
      </div>

      <AdBlock>
        <SmartAdUnit slot="9182003090" />
      </AdBlock>

      <Discover />
    </div>
  );
}
