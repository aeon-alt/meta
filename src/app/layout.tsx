import Navbar from "../components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#050b1a" }}>
        <Navbar />

        <main style={{ paddingTop: "80px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}