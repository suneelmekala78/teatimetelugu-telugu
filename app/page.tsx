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
import { getHomePageData } from "@/lib/requests-server";
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

// Skip static generation — news homepage must render at request time
export const dynamic = "force-dynamic";

export default async function Home() {
  // Single DB query for all Home-model data (breakingNews, trends, hotTopics, movies)
  const homeData = await getHomePageData();

  return (
    <div className="home-page">
      <BreakingNews news={homeData?.breakingNews} />

      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedGrid />
      </Suspense>

      {/* DH AD */}
      <AdBlock>
        <SmartAdUnit slot="3315432893" />
      </AdBlock>

      <div className="duo-content">
        <div className="duo-content-left">
          <TrendingGrid news={homeData?.trends} />
          {/* DH AD */}
          <AdBlock>
            <SmartAdUnit slot="3315432893" style={{ height: "150px" }} />
          </AdBlock>
        </div>
        <div className="duo-content-right">
          {/* DS AD */}
          <AdBlock>
            <SmartAdUnit slot="9180743912" />
          </AdBlock>
          <ScrollGrid news={homeData?.hotTopics} />
        </div>
      </div>

      <Suspense fallback={<GallerySkeleton />}>
        <GalleryGrid />
      </Suspense>

      {/* DH AD */}
      <AdBlock>
        <SmartAdUnit slot="3315432893" />
      </AdBlock>

      <Suspense fallback={<MostViewedSkeleton />}>
        <MostViewed news={homeData?.trendingNews} />
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsGrid reviews={homeData?.reviewsNews} />
      </Suspense>

      {/* DH AD */}
      <AdBlock>
        <SmartAdUnit slot="3315432893" style={{ height: "150px" }} />
      </AdBlock>

      <Suspense fallback={<CategoryTopSkeleton />}>
        <CategoryTopGrid />
      </Suspense>

      <Suspense fallback={<VideoGallerySkeleton />}>
        <VideoGallery
          title="కొత్త ట్రైలర్లు"
          nav="/videos?subcategory=trailers"
          subcategory="trailers"
        />
      </Suspense>

      {/* DH AD */}
      <AdBlock>
        <SmartAdUnit slot="3315432893" style={{ height: "150px" }} />
      </AdBlock>

      <Suspense fallback={<MoreStoriesSkeleton />}>
        <MoreStories />
      </Suspense>

      <Suspense fallback={<OtherPostsSkeleton />}>
        <OtherPosts category="technology" />
      </Suspense>

      {/* DH AD */}
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
          nav="/videos?subcategory=lyrical_songs"
          subcategory="lyrical_songs"
        />
      </Suspense>

      <div className="movies-tables-section">
        <MovieSchedules rows={homeData?.movieReleases} />
        <MovieCollections rows={homeData?.movieCollections} />
      </div>

      {/* MH AD */}
      <AdBlock>
        <SmartAdUnit slot="9182003090" />
      </AdBlock>

      <Discover />
    </div>
  );
}
