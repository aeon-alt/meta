import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getTVDetails,
  getTVCredits,
  getTVVideos,
  getTVReviews,
  getSimilarTV,
  getTVRecommendations,
  getTVWatchProviders,
} from "@/lib/tmdb";
import { getBackdropUrl } from "@/types/tmdb";
import TVDetailClient from "./TVDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const tv = await getTVDetails(Number(id));
    return {
      title: `${tv.name} — Metanoa`,
      description: tv.overview,
      openGraph: {
        title: tv.name,
        description: tv.overview,
        images: [{ url: getBackdropUrl(tv.backdrop_path, "w1280") }],
      },
    };
  } catch {
    return { title: "TV Show — Metanoa" };
  }
}

export default async function TVPage({ params }: Props) {
  const { id } = await params;
  const tvId = Number(id);

  if (isNaN(tvId)) notFound();

  try {
    const [tv, credits, videos, reviews, similar, recommendations, providers] = await Promise.all([
      getTVDetails(tvId),
      getTVCredits(tvId),
      getTVVideos(tvId),
      getTVReviews(tvId),
      getSimilarTV(tvId),
      getTVRecommendations(tvId),
      getTVWatchProviders(tvId),
    ]);

    return (
      <TVDetailClient
        tv={tv}
        credits={credits}
        videos={videos}
        reviews={reviews}
        similar={similar.results as any[]}
        recommendations={recommendations.results as any[]}
        providers={providers}
      />
    );
  } catch {
    notFound();
  }
}
