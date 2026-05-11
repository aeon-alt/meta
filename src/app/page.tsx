import Hero from "../components/Hero";
import MovieCard from "../components/MovieCard";
import { getMovies } from "../lib/getMovies";

export default async function Page() {
  const movies = await getMovies();

  return (
    <main>
      <Hero />

      <section style={{ padding: "20px" }}>
        <h2 style={{ color: "white" }}>Trending Movies</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "16px",
          }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </main>
  );
}