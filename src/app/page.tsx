import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getMoviesByGenre,
  getPopularTV,
  GENRE_IDS,
} from "@/lib/tmdb";

export default async function HomePage() {
  const [
    trendingData,
    popularData,
    topRatedData,
    upcomingData,
    nowPlayingData,
    actionData,
    horrorData,
    comedyData,
    animeData,
    tvData,
  ] = await Promise.all([
    getTrendingMovies("week"),
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
    getMoviesByGenre(GENRE_IDS.ACTION),
    getMoviesByGenre(GENRE_IDS.HORROR),
    getMoviesByGenre(GENRE_IDS.COMEDY),
    getMoviesByGenre(GENRE_IDS.ANIMATION),
    getPopularTV(),
  ]);

  const trending = trendingData.results as any[];
  const popular = popularData.results;
  const topRated = topRatedData.results;
  const upcoming = upcomingData.results;
  const nowPlaying = nowPlayingData.results;
  const action = actionData.results;
  const horror = horrorData.results;
  const comedy = comedyData.results;
  const anime = animeData.results;
  const tv = tvData.results as any[];

  return (
    <div style={{ background: "var(--bg-primary)" }} className="min-h-screen">
      {/* Cinematic Hero Billboard */}
      <Hero movies={trending} />

      {/* Movie Rows */}
      <div className="pt-4 pb-24 space-y-2">

        <MovieRow title="Trending This Week" items={trending} mediaType="movie" showRank={false} />

        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />

        <MovieRow title="Top 10 Movies" items={topRated.slice(0, 10)} mediaType="movie" showRank />

        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />

        <MovieRow title="Now Playing" items={nowPlaying} mediaType="movie" />

        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />

        <MovieRow title="Popular Movies" items={popular} mediaType="movie" />

        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />

        <MovieRow title="Upcoming Releases" items={upcoming} mediaType="movie" />

        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />

        <MovieRow title="Action & Adventure" items={action} mediaType="movie" />

        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />

        <MovieRow title="Horror" items={horror} mediaType="movie" />

        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />

        <MovieRow title="Comedy" items={comedy} mediaType="movie" />

        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />

        <MovieRow title="Anime & Animation" items={anime} mediaType="movie" />

        <div className="separator-glow mx-6 md:mx-12 lg:mx-16 my-2" />

        <MovieRow title="Popular TV Shows" items={tv} mediaType="tv" />

      </div>
    </div>
  );
}