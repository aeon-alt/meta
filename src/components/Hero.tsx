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

  return (
    <section className="relative h-[70vh] flex items-center px-6 sm:px-10 text-white bg-gradient-to-b from-[#050b1a] via-[#0a1633] to-black">
      <div className="max-w-2xl space-y-5">

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Welcome to <span className="text-blue-400">Metanoa</span>
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-base sm:text-lg">
          Stream unlimited movies and TV shows with a futuristic experience.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

          {/* RANDOM WATCH */}
          <button
            onClick={handleRandomWatch}
            className="
              bg-blue-500 hover:bg-blue-600
              px-6 py-3 rounded-lg
              transition transform hover:scale-105
              font-semibold
            "
          >
            ▶ Watch Random
          </button>

          {/* INFO */}
          <button
            className="
              bg-white/10 hover:bg-white/20
              px-6 py-3 rounded-lg
              transition
            "
          >
            More Info
          </button>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute right-0 top-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-blue-500 opacity-20 blur-[120px]" />
    </section>
  );
}