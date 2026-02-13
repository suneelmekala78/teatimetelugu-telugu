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

export default function Home() {
  return (
    <div className="home-page">
      <BreakingNews />
      <FeaturedGrid />
      <div className="duo-content">
        <div className="duo-content-left">
          <TrendingGrid />
        </div>
        <div className="duo-content-right">
          <ScrollGrid />
        </div>
      </div>
      <GalleryGrid />
      <MostViewed />
      <ReviewsGrid />
      <CategoryTopGrid />
      <VideoGallery
        title="కొత్త ట్రైలర్లు"
        nav="/videos?subcategory=trailers"
        subcategory="trailers"
      />
      <MoreStories />
      <OtherPosts category="technology" />
      <OtherPosts category="business" />
      <OtherPosts category="health" />
      <VideoGallery
        title="లిరికల్ సాంగ్స్"
        nav="/videos?subcategory=lyrical_songs"
        subcategory="lyrical_songs"
      />
      <div className="movies-tables-section">
        <MovieSchedules />
        <MovieCollections />
      </div>
      <Discover />
    </div>
  );
}
