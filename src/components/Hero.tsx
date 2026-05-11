export default function Hero() {
  return (
    <section className="relative h-[70vh] flex items-center px-10 text-white bg-gradient-to-b from-[#050b1a] via-[#0a1633] to-black">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-5xl font-bold">
          Welcome to <span className="text-blue-400">Metanoa</span>
        </h1>

        <p className="text-gray-300 text-lg">
          Stream unlimited movies and TV shows with a futuristic experience.
        </p>

        <div className="flex gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition">
            ▶ Watch Now
          </button>

          <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg transition">
            More Info
          </button>
        </div>
      </div>

      <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px]" />
    </section>
  );
}