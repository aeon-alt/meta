import { searchMulti } from "@/lib/tmdb";
import type { SearchResult } from "@/types/tmdb";
import { getTitle, getPosterUrl, getReleaseYear } from "@/types/tmdb";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: "${q}" — Metanoa` : "Search — Metanoa" };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const data = query ? await searchMulti(query) : null;
  const results: SearchResult[] = data?.results ?? [];
  const movies = results.filter((r) => r.media_type === "movie");
  const tv = results.filter((r) => r.media_type === "tv");
  const people = results.filter((r) => r.media_type === "person");

  return (
    <div style={{ background: "var(--bg-primary)" }} className="min-h-screen px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {data && (
          <p className="text-gray-500 text-sm mb-8">{data.total_results.toLocaleString()} results</p>
        )}

        {!query && (
          <p className="text-gray-400 text-center py-20">Enter a search term to find movies and shows.</p>
        )}

        {query && results.length === 0 && (
          <p className="text-gray-400 text-center py-20">No results found for "{query}".</p>
        )}

        {/* Movies */}
        {movies.length > 0 && (
          <section className="mb-12">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              🎬 Movies <span className="text-gray-500 font-normal text-sm">({movies.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((result) => (
                <Link key={result.id} href={`/movie/${result.id}`} className="group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 mb-2 group-hover:ring-2 group-hover:ring-blue-500 transition">
                    <img
                      src={getPosterUrl((result as any).poster_path, "w500")}
                      alt={getTitle(result as any)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-white text-xs font-medium line-clamp-2 group-hover:text-blue-400 transition">{getTitle(result as any)}</p>
                  <p className="text-gray-500 text-[11px]">{getReleaseYear(result as any)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* TV */}
        {tv.length > 0 && (
          <section className="mb-12">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              📺 TV Shows <span className="text-gray-500 font-normal text-sm">({tv.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {tv.map((result) => (
                <Link key={result.id} href={`/tv/${result.id}`} className="group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 mb-2 group-hover:ring-2 group-hover:ring-blue-500 transition">
                    <img
                      src={getPosterUrl((result as any).poster_path, "w500")}
                      alt={getTitle(result as any)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-white text-xs font-medium line-clamp-2 group-hover:text-blue-400 transition">{getTitle(result as any)}</p>
                  <p className="text-gray-500 text-[11px]">{getReleaseYear(result as any)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* People */}
        {people.length > 0 && (
          <section>
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              👤 People <span className="text-gray-500 font-normal text-sm">({people.length})</span>
            </h2>
            <div className="flex flex-wrap gap-4">
              {people.map((result) => (
                <div key={result.id} className="flex items-center gap-3 glass-dark rounded-xl p-3 w-full sm:w-auto min-w-0 sm:min-w-[220px]">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                    <img
                      src={(result as any).profile_path
                        ? `https://image.tmdb.org/t/p/w185${(result as any).profile_path}`
                        : "/placeholder-avatar.png"}
                      alt={(result as any).name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{(result as any).name}</p>
                    <p className="text-gray-500 text-xs">{(result as any).known_for_department}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}