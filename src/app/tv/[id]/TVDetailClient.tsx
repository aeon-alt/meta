"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type {
  TVDetails, Credits, VideosResponse, ReviewsResponse,
  WatchProvidersResponse, TVShow,
} from "@/types/tmdb";
import { getBackdropUrl, getPosterUrl } from "@/types/tmdb";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import MovieRow from "@/components/MovieRow";

interface Props {
  tv: TVDetails;
  credits: Credits;
  videos: VideosResponse;
  reviews: ReviewsResponse;
  similar: TVShow[];
  recommendations: TVShow[];
  providers: WatchProvidersResponse;
}

export default function TVDetailClient({
  tv,
  credits,
  videos,
  reviews,
  similar,
  recommendations,
  providers,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState<any>(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSeason = async () => {
      setLoadingSeason(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${tv.id}/season/${season}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
        const data = await res.json();
        setSeasonDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSeason(false);
      }
    };
    if (tv.seasons && tv.seasons.length > 0) {
      // default to first valid season if season 1 doesn't exist
      const validSeason = tv.seasons.find(s => s.season_number === season) || tv.seasons.find(s => s.season_number > 0);
      if (validSeason && validSeason.season_number !== season) {
        setSeason(validSeason.season_number);
      } else {
        fetchSeason();
      }
    } else {
      fetchSeason();
    }
  }, [tv.id, season, tv.seasons]);

  const handlePlayEpisode = (s: number, e: number) => {
    setSeason(s);
    setEpisode(e);
    setPlaying(true);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlistStore();
  const inList = isInWatchlist(tv.id);

  const trailer = videos.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  ) || videos.results.find((v) => v.site === "YouTube");

  const creator = tv.created_by?.[0];
  const cast = credits.cast.slice(0, 12);
  const phProviders = providers.results?.["PH"] || providers.results?.["US"];

  const handleWatchlist = () => {
    if (inList) removeFromWatchlist(tv.id);
    else addToWatchlist(tv as any, "tv");
  };

  const runtimeStr = tv.episode_run_time?.[0]
    ? `${tv.episode_run_time[0]}m per ep`
    : null;

  return (
    <div style={{ background: "var(--bg-primary)" }} className="min-h-screen">

      {/* ── BACKDROP HERO ─────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ height: "65vh", minHeight: "400px" }}>
        <img
          src={getBackdropUrl(tv.backdrop_path, "original")}
          alt={tv.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient-bottom" />
        <div className="absolute inset-0 hero-gradient-left" />
        <div className="absolute inset-0" style={{ background: "rgba(11,11,15,0.2)" }} />

        <Link
          href="/tv"
          className="absolute top-6 left-6 btn-icon z-10"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 -mt-48 relative z-10">

        <div className="flex flex-col md:flex-row gap-8">

          {/* Poster */}
          <div className="flex-shrink-0 w-48 sm:w-56 md:w-64 mx-auto md:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            >
              <img
                src={getPosterUrl(tv.poster_path, "w500")}
                alt={tv.name}
                className="w-full aspect-[2/3] object-cover"
              />
            </motion.div>
          </div>

          {/* Info */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tv.genres.map((g) => (
                <span key={g.id} className="px-3 py-1 rounded-full text-xs font-semibold glass text-gray-300">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {tv.name}
            </h1>

            {/* Tagline */}
            {tv.tagline && (
              <p className="text-gray-400 italic mb-4 text-sm sm:text-base">"{tv.tagline}"</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-gray-400">
              <span className="flex items-center gap-1 text-yellow-400 font-bold text-base">
                ★ {tv.vote_average.toFixed(1)}
                <span className="text-gray-500 font-normal text-xs">/ 10 ({tv.vote_count.toLocaleString()})</span>
              </span>
              <span>{tv.number_of_seasons} Seasons</span>
              {runtimeStr && <span>{runtimeStr}</span>}
              <span>{tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : ""}</span>
              <span className="px-2 py-0.5 border border-gray-700 rounded text-xs">HD</span>
            </div>

            {/* Overview */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-7 max-w-2xl">
              {tv.overview}
            </p>

            {/* Creator */}
            {creator && (
              <p className="text-gray-400 text-sm mb-6">
                <span className="text-gray-500">Creator: </span>
                <span className="text-white font-medium">{creator.name}</span>
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => handlePlayEpisode(season, episode)}
                className="btn-primary text-base px-8 py-3.5"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Now
              </button>

              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="btn-secondary text-base px-6 py-3.5"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.277A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  Trailer
                </button>
              )}

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

            {/* Watch Providers */}
            {phProviders && (
              <div className="mb-4">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Stream On</p>
                <div className="flex flex-wrap gap-2">
                  {phProviders.flatrate?.map((p) => (
                    <div key={p.provider_id} className="flex items-center gap-2 glass px-2.5 py-1.5 rounded-lg">
                      <img
                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                        alt={p.provider_name}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-xs text-gray-300">{p.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── VIDEO PLAYER ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {playing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.2)] border border-blue-900/30"
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--bg-secondary)" }}>
                <span className="text-white font-semibold text-sm flex items-center gap-4">
                  Now Watching: {tv.name}
                  
                  {/* Removed quick episode selector in favor of the panel below */}
                  <span className="text-gray-400 text-xs font-normal">S{season} E{episode}</span>
                </span>

                <button
                  onClick={() => setPlaying(false)}
                  className="text-gray-400 hover:text-white transition text-xs flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close player
                </button>
              </div>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://vidlink.pro/tv/${tv.id}/${season}/${episode}`}
                  frameBorder="0"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  title={`Watch ${tv.name}`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={playerRef} />

        {/* ── EPISODES PANEL ──────────────────────────────────────────── */}
        {tv.seasons && tv.seasons.length > 0 && (
          <section className="mt-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>Episodes</h2>
              
              {/* Season Dropdown */}
              <div className="relative">
                <select
                  value={season}
                  onChange={(e) => setSeason(Number(e.target.value))}
                  className="appearance-none bg-gray-900 border border-gray-700 text-white px-4 py-2 pr-10 rounded-lg outline-none focus:border-blue-500 transition cursor-pointer"
                >
                  {tv.seasons.filter(s => s.season_number > 0).map((s) => (
                    <option key={s.id} value={s.season_number}>
                      {s.name} ({s.episode_count} Episodes)
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {loadingSeason ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-64 sm:w-72 h-40 bg-gray-900 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : seasonDetails?.episodes ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {seasonDetails.episodes.map((ep: any) => (
                  <div 
                    key={ep.id} 
                    onClick={() => handlePlayEpisode(season, ep.episode_number)}
                    className="flex-shrink-0 w-64 sm:w-72 glass-dark rounded-xl overflow-hidden group cursor-pointer snap-start hover:ring-2 hover:ring-blue-500 transition-all duration-300"
                  >
                    <div className="relative aspect-video bg-gray-800">
                      <img
                        src={getBackdropUrl(ep.still_path, "w780")}
                        alt={ep.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300" />
                      
                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-blue-600/90 flex items-center justify-center text-white shadow-lg">
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-[10px] font-bold text-white">
                        E{ep.episode_number}
                      </div>
                      {ep.runtime && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-[10px] font-bold text-white">
                          {ep.runtime}m
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-white text-sm font-semibold truncate group-hover:text-blue-400 transition">{ep.name}</h3>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed" title={ep.overview}>
                        {ep.overview || "No description available."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No episodes found for this season.</p>
            )}
          </section>
        )}

        {/* ── CAST ────────────────────────────────────────────────────── */}
        {cast.length > 0 && (
          <section className="mt-14">
            <h2 className="text-white text-xl font-bold mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3">
              {cast.map((member) => (
                <div key={member.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 mx-auto mb-2 border-2 border-transparent hover:border-blue-500 transition">
                    <img
                      src={member.profile_path
                        ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                        : "/placeholder-avatar.png"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white text-xs font-medium line-clamp-2">{member.name}</p>
                  <p className="text-gray-500 text-[11px] line-clamp-1">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── REVIEWS ─────────────────────────────────────────────────── */}
        {reviews.results.length > 0 && (
          <section className="mt-14">
            <h2 className="text-white text-xl font-bold mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>Reviews</h2>
            <div className="space-y-4">
              {reviews.results.slice(0, 4).map((review) => (
                <div key={review.id} className="glass-dark rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center font-bold text-sm">
                      {review.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{review.author}</p>
                      {review.author_details.rating && (
                        <p className="text-yellow-400 text-xs">★ {review.author_details.rating}/10</p>
                      )}
                    </div>
                    <span className="ml-auto text-gray-500 text-xs">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-gray-300 text-sm leading-relaxed ${expandedReview !== review.id ? "line-clamp-3" : ""}`}>
                    {review.content}
                  </p>
                  {review.content.length > 300 && (
                    <button
                      onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                      className="text-blue-400 hover:text-blue-300 text-xs mt-2 transition"
                    >
                      {expandedReview === review.id ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── RECOMMENDATIONS ─────────────────────────────────────────── */}
        {recommendations.length > 0 && (
          <div className="mt-14">
            <MovieRow title="Recommended" items={recommendations} mediaType="tv" />
          </div>
        )}

        {/* ── SIMILAR ─────────────────────────────────────────────────── */}
        {similar.length > 0 && (
          <div className="mt-6 pb-16">
            <MovieRow title="More Like This" items={similar} mediaType="tv" />
          </div>
        )}
      </div>

      {/* ── TRAILER MODAL ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showTrailer && trailer && (
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
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full rounded-xl"
                title={`${tv.name} Trailer`}
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
