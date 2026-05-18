"use client";

import { useRouter } from "next/navigation";

type Movie = {
  id: number;
  title: string;
  poster: string;
};

export default function Hero({ movies }: { movies: Movie[] }) {
  const router = useRouter();

  const handleRandomWatch = () => {
    if (!movies || movies.length === 0) return;

    const randomMovie =
      movies[Math.floor(Math.random() * movies.length)];

    router.push(`https://vidlink.pro/movie/${randomMovie.id}`);
  };

  // Slice movies for two scrolling rows
  // Row 1 uses first 10, Row 2 uses next 10.
  // We duplicate each array to create an infinite loop effect.
  const firstRowMovies = movies.slice(0, 10);
  const secondRowMovies = movies.slice(10, 20);

  const row1 = [...firstRowMovies, ...firstRowMovies];
  const row2 = [...secondRowMovies, ...secondRowMovies];

  return (
    <section className="relative min-h-[85vh] lg:h-[80vh] flex items-center px-6 sm:px-10 text-white bg-gradient-to-b from-[#050b1a] via-[#0a1633] to-slate-950 overflow-hidden select-none">
      
      {/* Content wrapper with grid for desktop side-by-side layout */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10 py-16 lg:py-0">
        
        {/* Left side content (welcoming text, buttons) */}
        <div className="lg:col-span-6 space-y-6 text-left relative z-10 max-w-2xl">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wide">
            ✨ Now Streaming Futuristic Media
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Metanoa</span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl">
            Stream unlimited movies and TV shows with a futuristic experience. Explore high definition content instantaneously.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            {/* RANDOM WATCH */}
            <button
              onClick={handleRandomWatch}
              className="
                bg-cyan-500 hover:bg-cyan-400 text-slate-950
                px-7 py-3.5 rounded-xl
                transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]
                font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer
              "
            >
              <span>▶</span> Watch Random Movie
            </button>

            {/* INFO */}
            <button
              className="
                bg-white/10 hover:bg-white/20 text-white border border-white/10
                px-7 py-3.5 rounded-xl
                transition-all duration-300 font-semibold text-sm sm:text-base cursor-pointer
              "
            >
              More Info
            </button>
          </div>
        </div>

        {/* Right side / Background: Auto-scrolling Movie Wall */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-auto overflow-hidden flex flex-col gap-4 py-8 lg:relative lg:top-0 lg:translate-y-0 opacity-20 lg:opacity-100 pointer-events-auto z-0 lg:z-10 lg:pl-4 lg:col-span-6 lg:w-full">
          
          {/* Row 1: Left to Right (Moving scroll-right) */}
          {row1.length > 0 && (
            <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] pointer-events-auto">
              <div className="animate-scroll-right flex gap-3 pr-3">
                {row1.map((movie, idx) => (
                  <div
                    key={`row1-${movie.id}-${idx}`}
                    onClick={() => router.push(`https://vidlink.pro/movie/${movie.id}`)}
                    className="relative w-28 sm:w-36 h-40 sm:h-52 shrink-0 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:scale-108 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 border border-slate-800/80 hover:border-cyan-400/50 group/item"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster}`}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-[10px] sm:text-xs font-semibold text-white truncate w-full drop-shadow-md">{movie.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: Right to Left (Moving scroll-left) */}
          {row2.length > 0 && (
            <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] pointer-events-auto">
              <div className="animate-scroll-left flex gap-3 pr-3">
                {row2.map((movie, idx) => (
                  <div
                    key={`row2-${movie.id}-${idx}`}
                    onClick={() => router.push(`https://vidlink.pro/movie/${movie.id}`)}
                    className="relative w-28 sm:w-36 h-40 sm:h-52 shrink-0 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:scale-108 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 border border-slate-800/80 hover:border-cyan-400/50 group/item"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster}`}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-[10px] sm:text-xs font-semibold text-white truncate w-full drop-shadow-md">{movie.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute right-0 top-0 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-cyan-500 opacity-15 blur-[120px] z-0" />

      {/* Netflix-style Bottom Fade Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-0" />
    </section>
  );
}