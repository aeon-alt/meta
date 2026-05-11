"use client";

import { useRef } from "react";
import MovieCard from "./MovieCard";

type Movie = {
  id: number;
  title: string;
  poster: string;
  type: "movie" | "tv";
};

export default function MovieRow({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    rowRef.current?.scrollBy({
      left: -500,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    rowRef.current?.scrollBy({
      left: 500,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-10 px-6 relative">
      {/* Title */}
      <h2 className="text-white text-xl font-semibold mb-3 border-l-4 border-blue-500 pl-3">
        {title}
      </h2>

      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 
        bg-black/60 hover:bg-black/80 text-white 
        w-10 h-10 rounded-full"
      >
        ◀
      </button>

      {/* Movies Row */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="shrink-0 w-40">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 
        bg-black/60 hover:bg-black/80 text-white 
        w-10 h-10 rounded-full"
      >
        ▶
      </button>
    </div>
  );
}