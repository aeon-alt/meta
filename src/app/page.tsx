import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import Separator from "@/components/Separator";
import { getMovies } from "@/lib/getMovies";

export default async function Page() {
  // Fetch multiple movie categories in parallel for speed
  const [popularMovies, topRatedMovies, upcomingMovies] = await Promise.all([
    getMovies("popular"),
    getMovies("top_rated"),
    getMovies("upcoming"),
  ]);

  return (
    <main className="bg-slate-950 min-h-screen pb-20">
      {/* Hero Header Billboard */}
      <Hero movies={popularMovies} />

      {/* Movie categories with dynamic Netflix separators */}
      <div className="relative z-10 -mt-4 lg:-mt-12 space-y-6">
        
        {/* Row 1: Trending Now */}
        <MovieRow title="Trending Now" movies={popularMovies} />
        
        {/* Glowing Gradient Separator */}
        <Separator variant="glow" />

        {/* Row 2: Top Rated */}
        <MovieRow title="Top Rated Masterpieces" movies={topRatedMovies} />

        {/* Dark subtle Netflix bar separator */}
        <Separator variant="netflix" />

        {/* Row 3: Upcoming Releases */}
        <MovieRow title="Upcoming Releases" movies={upcomingMovies} />

      </div>
    </main>
  );
}