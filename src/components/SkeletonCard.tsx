export default function SkeletonCard({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-36 sm:w-44 md:w-48">
          <div className="skeleton aspect-[2/3] rounded-lg" />
          <div className="skeleton h-3 w-3/4 rounded mt-2" />
          <div className="skeleton h-3 w-1/2 rounded mt-1.5" />
        </div>
      ))}
    </>
  );
}
