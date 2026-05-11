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
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-sm border-b border-blue-900/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo (CLICK → HOME) */}
        <Link href="/">
          <h1 className="text-cyan-400 text-3xl font-bold cursor-pointer hover:opacity-80 transition">
            METANOA
          </h1>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="px-3 py-1 rounded bg-slate-800 text-white outline-none"
          />
          <button className="text-white hover:text-cyan-400">
            🔍
          </button>
        </form>

        {/* Profile */}
        <div className="w-9 h-9 rounded bg-cyan-500 text-slate-900 flex items-center justify-center font-bold">
          M
        </div>
      </div>
    </nav>
  );
}