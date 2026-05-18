"use client";

type SeparatorProps = {
  variant?: "gradient" | "netflix" | "glow";
  className?: string;
};

export default function Separator({ variant = "gradient", className = "" }: SeparatorProps) {
  if (variant === "netflix") {
    return (
      <div 
        className={`h-2 w-full bg-[#030712] border-y border-slate-800/45 my-8 ${className}`} 
        role="presentation" 
      />
    );
  }

  if (variant === "glow") {
    return (
      <div className={`relative my-8 px-6 ${className}`} role="presentation">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[10px] bg-cyan-500/15 blur-md rounded-full pointer-events-none" />
      </div>
    );
  }

  // Default: premium gradient line
  return (
    <div className={`my-8 px-6 ${className}`} role="presentation">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/25 via-cyan-500/45 via-blue-500/25 to-transparent" />
    </div>
  );
}
