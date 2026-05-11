"use client";

type Movie = {
  id: number;
  title: string;
  poster: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div
      onClick={() =>
        (window.location.href = `https://vidlink.pro/movie/${movie.id}`)
      }
      className="
        group relative cursor-pointer overflow-hidden rounded-2xl
        bg-slate-900
        transform transition-all duration-300
        hover:scale-[1.04] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      "
    >
      {/* Poster Image */}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
        alt={movie.title}
        className="
          w-full
          h-[220px] sm:h-[260px] md:h-[320px]
          object-cover
          transition-transform duration-500
          group-hover:scale-110
        "
      />

      {/* Dark overlay gradient */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t from-black/95 via-black/30 to-transparent
        "
      />

      {/* Hover glow effect */}
      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          bg-cyan-500/10
        "
      />

      {/* Title */}
      <div className="absolute bottom-0 w-full p-3 sm:p-4">
        <p
          className="
            text-white font-semibold text-sm sm:text-base md:text-lg
            line-clamp-2
            drop-shadow-md
          "
        >
          {movie.title}
        </p>
      </div>

      {/* Top badge (optional style flair) */}
      <div
        className="
          absolute top-2 left-2
          bg-black/60 text-cyan-300
          text-[10px] sm:text-xs
          px-2 py-1 rounded-md
          backdrop-blur-md
        "
      >
        HD
      </div>
    </div>
  );
}