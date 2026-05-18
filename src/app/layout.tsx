import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metanoa — Stream Premium Movies & TV Shows",
  description: "Discover and stream unlimited movies, TV shows, and more on Metanoa. Your cinematic streaming experience powered by TMDB.",
  keywords: ["movies", "TV shows", "streaming", "watch online", "Metanoa"],
  openGraph: {
    title: "Metanoa — Premium Streaming",
    description: "Stream unlimited movies and TV shows with a cinematic experience.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <QueryProvider>
          <Navbar />
          <main style={{ paddingTop: "64px" }}>
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}