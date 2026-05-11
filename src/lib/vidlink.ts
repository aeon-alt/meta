const BASE_URL = "https://vidlink.pro";

export function getMovieUrl(id: string | number) {
  return `${BASE_URL}/movie/${id}`;
}

export function getTVUrl(
  id: string | number,
  season: number = 1,
  episode: number = 1
) {
  return `${BASE_URL}/tv/${id}/${season}/${episode}`;
}