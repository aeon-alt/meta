export async function GET() {
  const url = "https://api.themoviedb.org/3/movie/popular";

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
    },
  });

  if (!res.ok) {
    return Response.json(
      { error: "Failed to fetch movies" },
      { status: res.status }
    );
  }

  const data = await res.json();

  const movies = data.results.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path,
  }));

  return Response.json(movies);
}