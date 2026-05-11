"use client";

type Movie = {
  id: number;
  title: string;
  poster: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div
      onClick={() =>
        (window.location.href = `https://vidlink.pro/movie/${movie.id}`)
      }
      style={{
        cursor: "pointer",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 10px 30px rgba(0,0,0,0.5)";
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
        alt={movie.title}
        style={{
          width: "100%",
          height: "260px",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
          padding: "10px",
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {movie.title}
        </p>
      </div>
    </div>
  );
}