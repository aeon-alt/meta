"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Movie } from "@/types/tmdb";
import { getBackdropUrl, getPosterUrl, getTitle, getReleaseYear } from "@/types/tmdb";
import { useWatchlistStore } from "@/store/useWatchlistStore";

interface HeroProps {
  movies: (Movie | any)[]; // Accept TVShow or Movie
  mediaType?: "movie" | "tv";
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 14: "Fantasy",
  27: "Horror", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  53: "Thriller", 10752: "War", 37: "Western",
};

const AUTOPLAY_INTERVAL = 7000;

export default function Hero({ movies, mediaType = "movie" }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();

  const featured = movies.slice(0, 8);
  const movie = featured[current];
  const inList = movie ? isInWatchlist(movie.id) : false;

  const title = movie ? getTitle(movie as any) : "";
  const year = movie ? getReleaseYear(movie as any) : "";
  const href = movie ? `/${mediaType}/${movie.id}` : "";

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  const goNext = useCallback(() => {
    setCurrent((c) => (c + 1) % featured.length);
  }, [featured.length]);

  const goPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + featured.length) % featured.length);
  }, [featured.length]);

  // Autoplay
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, goNext]);

  const handleWatchlist = () => {
    if (!movie) return;
    if (inList) removeFromWatchlist(movie.id);
    else addToWatchlist(movie as any, mediaType);
  };

  const handleTrailerClick = async () => {
    if (!movie) return;
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await res.json();
      const trailer = data.results?.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      ) || data.results?.[0];
      if (trailer) {
        setTrailerKey(trailer.key);
        setShowTrailer(true);
      }
    } catch { /* silent */ }
  };

  if (!movie) return null;

  const genres = movie.genre_ids
    .slice(0, 3)
    .map((id: number) => GENRE_MAP[id])
    .filter(Boolean);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: "580px", maxHeight: "900px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrop images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`backdrop-${movie.id}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <img
            src={getBackdropUrl(movie.backdrop_path, "original")}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradients */}
      <div className="absolute inset-0 hero-gradient-left" />
      <div className="absolute inset-0 hero-gradient-bottom" />
      <div className="absolute inset-0" style={{ background: "rgba(11,11,15,0.25)" }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 md:px-12 lg:px-16 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${movie.id}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {/* Genre pills */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((g: string) => (
                  <span key={g} className="px-3 py-1 rounded-full text-xs font-semibold glass text-gray-300">
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-4 tracking-tight"
              style={{ fontFamily: "Poppins, sans-serif", textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
            >
              {title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-400">
                {year}
              </span>
              <span className="px-2 py-0.5 border border-gray-600 text-gray-400 rounded text-xs">HD</span>
            </div>

            {/* Overview */}
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed line-clamp-3 mb-8 max-w-2xl text-shadow-sm">
              {movie.overview}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 items-center">
              <Link href={href} className="btn-primary text-base px-7 py-3.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Now
              </Link>

              <button onClick={handleTrailerClick} className="btn-secondary text-base px-6 py-3.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.277A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                Trailer
              </button>

              <button
                onClick={handleWatchlist}
                className={`btn-icon w-12 h-12 ${inList ? "bg-blue-600 border-blue-600" : ""}`}
                title={inList ? "Remove from My List" : "Add to My List"}
              >
                {inList ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left/Right nav arrows */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-0 bottom-0 z-20 w-16 hidden sm:flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 group"
        style={{ background: "linear-gradient(to right, rgba(11,11,15,0.8) 0%, rgba(11,11,15,0) 100%)" }}
        aria-label="Previous movie"
      >
        <svg className="w-10 h-10 text-white group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute right-0 top-0 bottom-0 z-20 w-16 hidden sm:flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 group"
        style={{ background: "linear-gradient(to left, rgba(11,11,15,0.8) 0%, rgba(11,11,15,0) 100%)" }}
        aria-label="Next movie"
      >
        <svg className="w-10 h-10 text-white group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 right-6 sm:right-10 z-20 flex gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${i === current ? "w-6 h-2 bg-blue-600" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <motion.div
          key={`progress-${current}`}
          className="absolute bottom-0 left-0 h-0.5 z-20"
          style={{ background: "var(--accent)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
        />
      )}

      {/* Thumbnail strip */}
      <div className="absolute bottom-12 right-6 sm:right-10 lg:right-16 z-20 hidden lg:flex gap-2">
        {featured.slice(0, 5).map((m, i) => (
          <button
            key={m.id}
            onClick={() => goTo(i)}
            className={`w-16 h-10 rounded overflow-hidden transition-all duration-300 ${i === current ? "ring-2 ring-blue-500 opacity-100 scale-110" : "opacity-50 hover:opacity-80"}`}
          >
            <img src={getPosterUrl(m.poster_path, "w200")} alt={m.title} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.95)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video mx-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full rounded-xl"
              />
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute -top-4 -right-4 btn-icon bg-blue-600 border-blue-600 w-10 h-10"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}