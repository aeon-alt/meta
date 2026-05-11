"use client";

export default function Player({ url }: { url: string }) {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <iframe
        src={url}
        className="w-full h-full"
        allowFullScreen
        allow="autoplay; encrypted-media"
        frameBorder="0"
      />
    </div>
  );
}