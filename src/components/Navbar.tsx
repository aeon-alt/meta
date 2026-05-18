"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { searchMulti } from "@/lib/tmdb";
import type { SearchResult } from "@/types/tmdb";
import { getPosterUrl, getTitle } from "@/types/tmdb";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/my-list", label: "My List" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { watchlist } = useWatchlistStore();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchMulti(query);
        const moviesOnly = data.results.filter(r => r.media_type === "movie");
        setResults(moviesOnly);
      } catch { /* silent */ }
      finally { setSearching(false); }
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    if (result.media_type === "movie") router.push(`/movie/${result.id}`);
    else if (result.media_type === "tv") router.push(`/tv/${result.id}`);
    closeSearch();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    closeSearch();
  };

  // ESC to close search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeSearch(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSearch]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        initial={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)" }}
        animate={{ 
          background: scrolled 
            ? "linear-gradient(to bottom, rgba(11,11,15,0.98) 0%, rgba(11,11,15,0.92) 100%)" 
            : "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none"
        }}
        transition={{ duration: 0.3 }}
        style={{ backdropFilter: scrolled ? "blur(10px)" : "none" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 h-16 sm:h-20 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.span
              className="text-2xl font-black tracking-widest"
              style={{ color: "#3b82f6", fontFamily: "Poppins, sans-serif", textShadow: "0 0 20px rgba(59,130,246,0.5)" }}
              whileHover={{ scale: 1.05 }}
            >
              METANOA
            </motion.span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    active ? "text-white" : "text-gray-300 hover:text-gray-400"
                  }`}
                >
                  {link.href === "/my-list" && watchlist.length > 0 ? (
                    <span className="flex items-center gap-1.5">
                      {link.label}
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        {watchlist.length}
                      </span>
                    </span>
                  ) : link.label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-blue-600 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Search icon */}
            <motion.button
              onClick={() => setSearchOpen(true)}
              className="btn-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open search"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </motion.button>

            {/* Avatar */}
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center font-bold text-sm cursor-pointer select-none"
              whileHover={{ scale: 1.1 }}
            >
              M
            </motion.div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden btn-icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-dark border-t border-white/5"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium py-2 transition-colors ${pathname === link.href ? "text-white" : "text-gray-400"}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) closeSearch(); }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl mx-auto px-4 pt-20"
            >
              {/* Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies, shows, people..."
                  className="w-full pl-12 pr-12 py-4 text-lg bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>

              {/* Search Results */}
              <AnimatePresence>
                {(results.length > 0 || searching) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="mt-2 glass-dark rounded-xl overflow-hidden flex flex-col"
                  >
                    <div className="overflow-y-auto max-h-[55vh]">
                      {searching && !results.length && (
                        <div className="p-4 text-center text-gray-400 text-sm">Searching…</div>
                      )}
                    {results.map((result) => {
                      const title = result.media_type === "person" ? result.name : getTitle(result as any);
                      const poster = result.media_type === "person" ? result.profile_path : (result as any).poster_path;
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition text-left group"
                        >
                          <div className="w-9 h-12 rounded overflow-hidden flex-shrink-0 bg-gray-800">
                            {poster && (
                              <img
                                src={getPosterUrl(poster, "w200")}
                                alt={title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate group-hover:text-blue-400 transition">{title}</p>
                            <p className="text-gray-500 text-xs capitalize">{result.media_type}</p>
                          </div>
                          <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      );
                    })}
                    </div>
                    {results.length > 0 && (
                      <div className="border-t border-white/5 bg-gray-900/50">
                        <button
                          onClick={handleSearchSubmit as any}
                          className="w-full py-3 text-center text-sm text-blue-400 hover:text-blue-300 transition"
                        >
                          See all results for &quot;{query}&quot;
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}