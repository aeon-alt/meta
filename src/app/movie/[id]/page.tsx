import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieReviews,
  getSimilarMovies,
  getMovieRecommendations,
  getMovieWatchProviders,
} from "@/lib/tmdb";
import { getBackdropUrl, getPosterUrl } from "@/types/tmdb";
import MovieDetailClient from "./MovieDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const movie = await getMovieDetails(Number(id));
    return {
      title: `${movie.title} — Metanoa`,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: [{ url: getBackdropUrl(movie.backdrop_path, "w1280") }],
      },
    };
  } catch {
    return { title: "Movie — Metanoa" };
  }
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId)) notFound();

  try {
    const [movie, credits, videos, reviews, similar, recommendations, providers] = await Promise.all([
      getMovieDetails(movieId),
      getMovieCredits(movieId),
      getMovieVideos(movieId),
      getMovieReviews(movieId),
      getSimilarMovies(movieId),
      getMovieRecommendations(movieId),
      getMovieWatchProviders(movieId),
    ]);

    return (
      <MovieDetailClient
        movie={movie}
        credits={credits}
        videos={videos}
        reviews={reviews}
        similar={similar.results}
        recommendations={recommendations.results}
        providers={providers}
      />
    );
  } catch {
    notFound();
  }
}
