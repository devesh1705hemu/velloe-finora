import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
    xl: "h-14 w-14",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      {/* Velloe-Finora Dynamic Dual-V/F Vector Insignia */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-1.5 shadow-md shadow-indigo-500/20 ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/35",
          iconSizes[size]
        )}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full overflow-visible"
        >
          <defs>
            {/* Velloe Velocity Gradient */}
            <linearGradient id="vfGradientV" x1="2" y1="4" x2="20" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818CF8" />
              <stop offset="0.6" stopColor="#6366F1" />
              <stop offset="1" stopColor="#4F46E5" />
            </linearGradient>
            {/* Finora Horizon Bar Gradient (Emerald Alpha) */}
            <linearGradient id="vfGradientF" x1="16" y1="10" x2="32" y2="10" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="vfGradientF2" x1="16" y1="18" x2="28" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Left Angle of 'V' */}
          <path
            d="M6 8 L15 28 C15.5 29.2 17 29.2 17.5 28 L23 16"
            stroke="url(#vfGradientV)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Top Horizon Arm of 'F' */}
          <path
            d="M17 9 L31 9"
            stroke="url(#vfGradientF)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Middle Pulse Arm of 'F' */}
          <path
            d="M19 17 L29 17"
            stroke="url(#vfGradientF2)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Forward Velocity Arrow Particle */}
          <circle cx="31" cy="9" r="2" fill="#34D399" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={cn("font-black tracking-tight text-foreground", textSizes[size])}>
              Velloe<span className="text-primary font-light">-</span><span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">Finora</span>
            </span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
            Financial Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
