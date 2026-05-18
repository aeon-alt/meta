import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMoviesByGenre,
  GENRE_IDS,
} from "@/lib/tmdb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies — Metanoa",
  description: "Browse the latest and greatest movies on Metanoa.",
};

export default async function MoviesPage() {
  const [
    popularData,
    topRatedData,
    nowPlayingData,
    upcomingData,
    actionData,
    scifiData,
    dramaData,
    thrillerData,
    romanceData,
  ] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getMoviesByGenre(GENRE_IDS.ACTION),
    getMoviesByGenre(GENRE_IDS.SCIENCE_FICTION),
    getMoviesByGenre(GENRE_IDS.DRAMA),
    getMoviesByGenre(GENRE_IDS.THRILLER),
    getMoviesByGenre(GENRE_IDS.ROMANCE),
  ]);

  const popular = popularData.results;
  const topRated = topRatedData.results;
  const nowPlaying = nowPlayingData.results;
  const upcoming = upcomingData.results;
  const action = actionData.results;
  const scifi = scifiData.results;
  const drama = dramaData.results;
  const thriller = thrillerData.results;
  const romance = romanceData.results;

  return (
    <div style={{ background: "var(--bg-primary)" }} className="min-h-screen">
      <Hero movies={popular} />

      <div className="pt-4 pb-24 space-y-2">
        <MovieRow title="Now Playing in Theaters" items={nowPlaying} mediaType="movie" />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Popular Movies" items={popular} mediaType="movie" />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Top Rated Movies" items={topRated} mediaType="movie" showRank />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Action & Adventure" items={action} mediaType="movie" />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Science Fiction" items={scifi} mediaType="movie" />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Drama" items={drama} mediaType="movie" />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Thrillers" items={thriller} mediaType="movie" />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Romance" items={romance} mediaType="movie" />
        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />
        <MovieRow title="Upcoming Releases" items={upcoming} mediaType="movie" />
      </div>
    </div>
  );
}
