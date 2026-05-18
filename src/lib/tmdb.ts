import type {
  MoviesResponse,
  TVShowsResponse,
  MovieDetails,
  TVDetails,
  Credits,
  VideosResponse,
  ReviewsResponse,
  WatchProvidersResponse,
  SearchResponse,
  TrendingResponse,
  PaginatedResponse,
  Movie,
  TVSeasonDetails,
} from "@/types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  const token = process.env.TMDB_READ_TOKEN;
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  
  if (!token && apiKey) {
    url.searchParams.set("api_key", apiKey);
  }
  
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 3600 }, // 1 hour cache via Next.js fetch
  });

  if (!res.ok) {
    throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText} — ${endpoint}`);
  }

  return res.json() as Promise<T>;
}

// ─── Movies ──────────────────────────────────────────────────────────────────

export const getTrending = (timeWindow: "day" | "week" = "day") =>
  tmdbFetch<TrendingResponse>(`/trending/all/${timeWindow}`);

export const getTrendingMovies = (timeWindow: "day" | "week" = "week") =>
  tmdbFetch<MoviesResponse>(`/trending/movie/${timeWindow}`);

export const getPopularMovies = () =>
  tmdbFetch<MoviesResponse>("/movie/popular");

export const getTopRatedMovies = () =>
  tmdbFetch<MoviesResponse>("/movie/top_rated");

export const getUpcomingMovies = () =>
  tmdbFetch<MoviesResponse>("/movie/upcoming");

export const getNowPlayingMovies = () =>
  tmdbFetch<MoviesResponse>("/movie/now_playing");

export const getMoviesByGenre = (genreId: number) =>
  tmdbFetch<MoviesResponse>("/discover/movie", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
  });

export const getMovieDetails = (id: number) =>
  tmdbFetch<MovieDetails>(`/movie/${id}`);

export const getMovieCredits = (id: number) =>
  tmdbFetch<Credits>(`/movie/${id}/credits`);

export const getMovieVideos = (id: number) =>
  tmdbFetch<VideosResponse>(`/movie/${id}/videos`);

export const getMovieReviews = (id: number) =>
  tmdbFetch<ReviewsResponse>(`/movie/${id}/reviews`);

export const getSimilarMovies = (id: number) =>
  tmdbFetch<MoviesResponse>(`/movie/${id}/similar`);

export const getMovieRecommendations = (id: number) =>
  tmdbFetch<MoviesResponse>(`/movie/${id}/recommendations`);

export const getMovieWatchProviders = (id: number) =>
  tmdbFetch<WatchProvidersResponse>(`/movie/${id}/watch/providers`);

// ─── TV Shows ────────────────────────────────────────────────────────────────

export const getPopularTV = () =>
  tmdbFetch<TVShowsResponse>("/tv/popular");

export const getTopRatedTV = () =>
  tmdbFetch<TVShowsResponse>("/tv/top_rated");

export const getAiringTodayTV = () =>
  tmdbFetch<TVShowsResponse>("/tv/airing_today");

export const getTVDetails = (id: number) =>
  tmdbFetch<TVDetails>(`/tv/${id}`);

export const getTVCredits = (id: number) =>
  tmdbFetch<Credits>(`/tv/${id}/credits`);

export const getTVVideos = (id: number) =>
  tmdbFetch<VideosResponse>(`/tv/${id}/videos`);

export const getTVReviews = (id: number) =>
  tmdbFetch<ReviewsResponse>(`/tv/${id}/reviews`);

export const getSimilarTV = (id: number) =>
  tmdbFetch<TVShowsResponse>(`/tv/${id}/similar`);

export const getTVRecommendations = (id: number) =>
  tmdbFetch<TVShowsResponse>(`/tv/${id}/recommendations`);

export const getTVSeason = (tvId: number, seasonNumber: number) =>
  tmdbFetch<TVSeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);

export const getTVWatchProviders = (id: number) =>
  tmdbFetch<WatchProvidersResponse>(`/tv/${id}/watch/providers`);

// ─── Search ──────────────────────────────────────────────────────────────────

export const searchMulti = (query: string, page = 1) =>
  tmdbFetch<SearchResponse>("/search/multi", { query, page: String(page) });

// ─── Genre IDs ───────────────────────────────────────────────────────────────

export const GENRE_IDS = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FANTASY: 14,
  HORROR: 27,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
} as const;
