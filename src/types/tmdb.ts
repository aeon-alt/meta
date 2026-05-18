// TMDB TypeScript Types

export type MediaType = "movie" | "tv" | "person";

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

// ─── Base Media ──────────────────────────────────────────────────────────────

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  media_type?: "movie";
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  media_type?: "tv";
}

export type MediaItem = (Movie | TVShow) & { media_type: MediaType };

// ─── Details ─────────────────────────────────────────────────────────────────

export interface MovieDetails extends Omit<Movie, "genre_ids"> {
  genres: Genre[];
  runtime: number | null;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string | null;
  production_companies: ProductionCompany[];
  spoken_languages: { name: string; iso_639_1: string }[];
}

export interface TVSeason {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
}

export interface TVEpisode {
  air_date: string | null;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface TVSeasonDetails extends TVSeason {
  episodes: TVEpisode[];
}

export interface TVDetails extends Omit<TVShow, "genre_ids"> {
  genres: Genre[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string;
  homepage: string;
  episode_run_time: number[];
  created_by: { id: number; name: string; profile_path: string | null }[];
  seasons: TVSeason[];
}

// ─── Cast & Crew ─────────────────────────────────────────────────────────────

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

// ─── Videos ──────────────────────────────────────────────────────────────────

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: "Trailer" | "Teaser" | "Clip" | "Featurette" | "Behind the Scenes" | "Bloopers";
  official: boolean;
  published_at: string;
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface ReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface Review {
  id: string;
  author: string;
  author_details: ReviewAuthorDetails;
  content: string;
  created_at: string;
  url: string;
}

export interface ReviewsResponse {
  id: number;
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

// ─── Watch Providers ─────────────────────────────────────────────────────────

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface CountryProviders {
  link: string;
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
}

export interface WatchProvidersResponse {
  id: number;
  results: Record<string, CountryProviders>;
}

// ─── Search ──────────────────────────────────────────────────────────────────

export interface PersonResult {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  media_type: "person";
  known_for: (Movie | TVShow)[];
}

export type SearchResult = (Movie & { media_type: "movie" }) | (TVShow & { media_type: "tv" }) | PersonResult;

// ─── API Responses ───────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TrendingResponse extends PaginatedResponse<MediaItem> {}
export interface MoviesResponse extends PaginatedResponse<Movie> {}
export interface TVShowsResponse extends PaginatedResponse<TVShow> {}
export interface SearchResponse extends PaginatedResponse<SearchResult> {}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function isMovie(item: Movie | TVShow): item is Movie {
  return "title" in item;
}

export function isTVShow(item: Movie | TVShow): item is TVShow {
  return "name" in item;
}

export function getTitle(item: Movie | TVShow): string {
  return isMovie(item) ? item.title : item.name;
}

export function getReleaseYear(item: Movie | TVShow): string {
  const date = isMovie(item) ? item.release_date : item.first_air_date;
  return date ? new Date(date).getFullYear().toString() : "N/A";
}

export function getPosterUrl(path: string | null, size: "w200" | "w300" | "w500" | "original" = "w500"): string {
  if (!path) return "/placeholder-poster.png";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: "w780" | "w1280" | "original" = "original"): string {
  if (!path) return "/placeholder-backdrop.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
