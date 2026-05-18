import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Movie, TVShow } from "@/types/tmdb";
import { getTitle } from "@/types/tmdb";

export type WatchlistItem = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  media_type: "movie" | "tv";
  addedAt: number;
};

function toWatchlistItem(item: Movie | TVShow, mediaType: "movie" | "tv"): WatchlistItem {
  return {
    id: item.id,
    title: getTitle(item),
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    vote_average: item.vote_average,
    media_type: mediaType,
    addedAt: Date.now(),
  };
}

interface WatchlistState {
  watchlist: WatchlistItem[];
  watchHistory: WatchlistItem[];
  addToWatchlist: (item: Movie | TVShow, mediaType: "movie" | "tv") => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  addToHistory: (item: Movie | TVShow, mediaType: "movie" | "tv") => void;
  clearHistory: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      watchHistory: [],

      addToWatchlist: (item, mediaType) => {
        const existing = get().isInWatchlist(item.id);
        if (existing) return;
        set((s) => ({
          watchlist: [toWatchlistItem(item, mediaType), ...s.watchlist],
        }));
      },

      removeFromWatchlist: (id) =>
        set((s) => ({
          watchlist: s.watchlist.filter((m) => m.id !== id),
        })),

      isInWatchlist: (id) => get().watchlist.some((m) => m.id === id),

      addToHistory: (item, mediaType) => {
        const entry = toWatchlistItem(item, mediaType);
        set((s) => ({
          watchHistory: [
            entry,
            ...s.watchHistory.filter((m) => m.id !== item.id),
          ].slice(0, 50),
        }));
      },

      clearHistory: () => set({ watchHistory: [] }),
    }),
    {
      name: "metanoa-watchlist",
    }
  )
);
