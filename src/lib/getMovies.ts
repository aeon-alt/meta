export type Movie = {
  id: number;
  title: string;
  poster: string;
};

export async function getMovies(): Promise<Movie[]> {
  const url = "https://api.themoviedb.org/3/movie/popular";

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await res.json();

  return data.results.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path,
  }));
}