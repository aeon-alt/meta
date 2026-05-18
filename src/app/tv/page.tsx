import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import {
  getPopularTV,
  getTopRatedTV,
  getAiringTodayTV,
  getTrending,
} from "@/lib/tmdb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TV Shows — Metanoa",
  description: "Binge-watch the most popular and highly rated TV shows on Metanoa.",
};

export default async function TVShowsPage() {
  const [
    trendingData,
    popularData,
    topRatedData,
    airingTodayData,
  ] = await Promise.all([
    getTrending("week"),
    getPopularTV(),
    getTopRatedTV(),
    getAiringTodayTV(),
  ]);

  // Filter trending for just TV
  const trending = trendingData.results.filter(r => r.media_type === "tv") as any[];
  const popular = popularData.results as any[];
  const topRated = topRatedData.results as any[];
  const airingToday = airingTodayData.results as any[];

  return (
    <div style={{ background: "var(--bg-primary)" }} className="min-h-screen">
      {/* Cinematic Hero Billboard using the trending TV show */}
      <Hero movies={trending} mediaType="tv" />

      {/* Movie Rows (used for TV shows via mediaType="tv" prop) */}
      <div className="pt-4 pb-24 space-y-2">
        <MovieRow title="Trending TV Shows" items={trending} mediaType="tv" />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Airing Today" items={airingToday} mediaType="tv" />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Popular Series" items={popular} mediaType="tv" />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Top 10 Rated TV Shows" items={topRated.slice(0, 10)} mediaType="tv" showRank />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Highly Rated" items={topRated} mediaType="tv" />
      </div>
    </div>
  );
}
