"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-blue-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">

        {/* TOP ROW (Logo + Profile for mobile layout) */}
        <div className="flex items-center justify-between w-full sm:w-auto">

          {/* Logo */}
          <Link href="/">
            <h1 className="text-cyan-400 text-2xl sm:text-3xl font-bold tracking-wide hover:opacity-80 transition">
              METANOA
            </h1>
          </Link>

          {/* Profile (mobile only) */}
          <div className="sm:hidden w-9 h-9 rounded-full bg-cyan-500 text-slate-900 flex items-center justify-center font-bold">
            M
          </div>
        </div>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSearch}
          className="
            flex items-center w-full sm:max-w-md
            bg-slate-800/70
            border border-slate-700
            rounded-full
            px-3 py-2
            focus-within:ring-2 focus-within:ring-cyan-400
            transition
          "
        >
          {/* Icon */}
          <span className="text-slate-400 text-lg mr-2">🔍</span>

          {/* Input */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="
              w-full bg-transparent outline-none
              text-white text-sm sm:text-base
              placeholder:text-slate-400
            "
          />

          {/* Button */}
          <button
            type="submit"
            className="
              ml-2 px-3 py-1
              bg-cyan-500 hover:bg-cyan-400
              text-slate-900 font-semibold
              text-xs sm:text-sm
              rounded-full
              transition
            "
          >
            Go
          </button>
        </form>

        {/* PROFILE (desktop only) */}
        <div className="hidden sm:flex w-9 h-9 rounded-full bg-cyan-500 text-slate-900 items-center justify-center font-bold">
          M
        </div>
      </div>
    </nav>
  );
}