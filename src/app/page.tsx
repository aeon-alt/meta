import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";

type Movie = {
  id: number;
  title: string;
  poster: string;
};

async function getMovies(): Promise<Movie[]> {
  const res = await fetch("http://localhost:3000/api/movie", {
    cache: "no-store",
  });

  return res.json();
}

export default async function Page() {
  const movies = await getMovies();

  return (
    <main>
      {/* HERO SECTION */}
      <Hero />

      {/* MOVIE ROWS */}
      <MovieRow title="Trending Movies" movies={movies} />
      <MovieRow title="Popular Movies" movies={movies} />
      <MovieRow title="Top Rated" movies={movies} />
    </main>
  );
}