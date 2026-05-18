"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Movie, TVShow } from "@/types/tmdb";
import { getPosterUrl, getTitle, getReleaseYear, isMovie } from "@/types/tmdb";
import { useWatchlistStore } from "@/store/useWatchlistStore";

interface MovieCardProps {
  item: Movie | TVShow;
  mediaType?: "movie" | "tv";
  rank?: number;
}

export default function MovieCard({ item, mediaType = "movie", rank }: MovieCardProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  const inList = isInWatchlist(item.id);
  const title = getTitle(item);
  const year = getReleaseYear(item);
  const href = mediaType === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) removeFromWatchlist(item.id);
    else addToWatchlist(item, mediaType);
  };

  return (
    <motion.div
      className="relative flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 group cursor-pointer"
      whileHover={{ scale: 1.06, zIndex: 10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      suppressHydrationWarning
    >
      <Link href={href} className="block">
        {/* Poster */}
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 shadow-lg group-hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)] transition-shadow duration-300">
          <img
            src={getPosterUrl(item.poster_path, "w500")}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient overlay always */}
          <div className="absolute inset-0 card-gradient opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Hover quick actions */}
          <div className="absolute inset-x-0 bottom-0 p-2.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center justify-between gap-2">
              {/* Play button */}
              <Link
                href={href}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1.5 rounded-md transition"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </Link>
              {/* Watchlist */}
              <button
                onClick={handleWatchlist}
                className={`w-8 h-8 flex items-center justify-center rounded-full border transition ${inList ? "bg-blue-600 border-blue-600 text-white" : "border-white/30 text-white hover:border-blue-500 hover:text-blue-400"}`}
                aria-label={inList ? "Remove from watchlist" : "Add to watchlist"}
              >
                {inList ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Rating badge */}
          <div className="absolute top-2 right-2">
            <span className="rating-badge">
              ★ {item.vote_average.toFixed(1)}
            </span>
          </div>

          {/* Rank number (Top 10) */}
          {rank !== undefined && (
            <div
              className="absolute -bottom-2 -left-1 text-[4rem] font-black leading-none select-none"
              style={{
                fontFamily: "Poppins, sans-serif",
                WebkitTextStroke: "2px rgba(255,255,255,0.5)",
                color: "transparent",
                textShadow: "2px 2px 0 rgba(0,0,0,0.8)",
              }}
            >
              {rank}
            </div>
          )}
        </div>

        {/* Text below card */}
        <div className="mt-2 px-0.5">
          <p className="text-white text-xs font-medium line-clamp-1 group-hover:text-blue-400 transition-colors">{title}</p>
          <p className="text-gray-500 text-[11px] mt-0.5">{year}</p>
        </div>
      </Link>
    </motion.div>
  );
}