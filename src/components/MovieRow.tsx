"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Movie, TVShow } from "@/types/tmdb";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";

interface MovieRowProps {
  title: string;
  items: (Movie | TVShow)[];
  mediaType?: "movie" | "tv";
  showRank?: boolean;
  loading?: boolean;
  viewAllHref?: string;
}

export default function MovieRow({
  title,
  items,
  mediaType = "movie",
  showRank = false,
  loading = false,
  viewAllHref,
}: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    const scrollAmt = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({ left: direction === "right" ? scrollAmt : -scrollAmt, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <section className="py-2 group/section">
      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-16 mb-3">
        <h2 className="text-white font-bold text-lg sm:text-xl lg:text-2xl tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
          {title}
        </h2>
        {viewAllHref && (
          <a href={viewAllHref} className="text-blue-500 hover:text-blue-400 text-sm font-medium transition flex items-center gap-1">
            See all
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>

      {/* Row wrapper */}
      <div className="relative group">
        {/* Left arrow */}
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 sm:w-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to right, rgba(11,11,15,0.95) 0%, rgba(11,11,15,0) 100%)" }}
            aria-label="Scroll left"
          >
            <svg className="w-8 h-8 text-white hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        )}

        {/* Right arrow */}
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 sm:w-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to left, rgba(11,11,15,0.95) 0%, rgba(11,11,15,0) 100%)" }}
            aria-label="Scroll right"
          >
            <svg className="w-8 h-8 text-white hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}

        {/* Scrollable cards */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 lg:px-16 pb-6 pt-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {loading ? (
            <SkeletonCard count={8} />
          ) : (
            items.map((item, index) => (
              <div key={item.id} style={{ scrollSnapAlign: "start" }}>
                <MovieCard
                  item={item}
                  mediaType={mediaType}
                  rank={showRank ? index + 1 : undefined}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}