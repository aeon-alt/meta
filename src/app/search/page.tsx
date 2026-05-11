import MovieCard from "@/components/MovieCard";
import { getSearchMovies } from "@/lib/getSearchMovies";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query = "" } = await searchParams;

  const movies = query ? await getSearchMovies(query) : [];

  return (
    <main style={{ padding: "20px", marginTop: "80px" }}>
      <h2 style={{ color: "white", marginBottom: "20px" }}>
        Results for: {query}
      </h2>

      {movies.length === 0 && query && (
        <p style={{ color: "gray" }}>No movies found.</p>
      )}

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
    </main>
  );
}