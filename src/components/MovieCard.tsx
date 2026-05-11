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
        relative cursor-pointer overflow-hidden rounded-xl
        bg-slate-900
        transition-transform duration-300
        hover:scale-105 hover:shadow-2xl
      "
    >
      {/* Image */}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
        alt={movie.title}
        className="
          w-full
          h-[220px] sm:h-[260px] md:h-[300px]
          object-cover
          block
        "
      />

      {/* Overlay */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          bg-gradient-to-t from-black/90 via-black/40 to-transparent
          p-3
        "
      >
        <p
          className="
            text-white font-semibold text-sm sm:text-base
            line-clamp-2
          "
        >
          {movie.title}
        </p>
      </div>
    </div>
  );
}