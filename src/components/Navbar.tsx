export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-sm border-b border-blue-900/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left Side */}
        <div className="flex items-center gap-8">
          
          {/* Logo */}
          <h1 className="text-cyan-400 text-3xl font-bold tracking-wide cursor-pointer">
            METANOA
          </h1>

          {/* Navigation */}
          <ul className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <li className="hover:text-cyan-400 transition cursor-pointer">
              Home
            </li>

            <li className="hover:text-cyan-400 transition cursor-pointer">
              Series
            </li>

            <li className="hover:text-cyan-400 transition cursor-pointer">
              Movies
            </li>

            <li className="hover:text-cyan-400 transition cursor-pointer">
              My List
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          
          {/* Search */}
          <button className="text-white text-xl hover:text-cyan-400 hover:scale-110 transition">
            🔍
          </button>

          {/* Profile */}
          <div className="w-9 h-9 rounded bg-cyan-500 text-slate-900 flex items-center justify-center font-bold cursor-pointer">
            M
          </div>
        </div>
      </div>
    </nav>
  )
}