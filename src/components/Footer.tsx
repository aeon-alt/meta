export default function Footer() {
  return (
    <footer className="mt-20 px-6 py-10 border-t border-blue-500/20 text-gray-400 text-sm">
      <div className="text-center text-gray-500">
        © {new Date().getFullYear()} Metanoa
      </div>
    </footer>
  );
}