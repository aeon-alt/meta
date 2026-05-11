import Hero from "../components/Hero";
import MovieCard from "../components/MovieCard";
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
      
      {/* MOVIES SECTION */}
      <section style={{ padding: "20px" }}>
        <h2 style={{ color: "white", marginBottom: "20px" }}>Trending Movies</h2>

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