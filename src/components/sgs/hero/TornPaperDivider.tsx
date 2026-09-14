import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

type Orientation = "vertical" | "horizontal";

type TornPaperDividerProps = {
  orientation?: Orientation;
  seed?: number;
  className?: string;
};

function buildTornPath(orientation: Orientation, seed: number): string {
  const major = 1000;
  const segs = 64;
  const left: string[] = [];
  const right: string[] = [];

  for (let i = 0; i <= segs; i += 1) {
    const t = i / segs;
    const along = t * major;
    const n1 = Math.sin(i * 2.4 + seed) * 1.6;
    const n2 = Math.sin(i * 7.1 + seed * 1.7) * 0.9;
    const center = 8 + n1 + n2;
    const half = 1.15 + Math.abs(Math.sin(i * 4.2 + seed * 0.8)) * 0.7;

    const a = (center - half).toFixed(2);
    const b = (center + half).toFixed(2);
    const p = along.toFixed(1);

    if (orientation === "vertical") {
      left.push(`${a},${p}`);
      right.push(`${b},${p}`);
    } else {
      left.push(`${p},${a}`);
      right.push(`${p},${b}`);
    }
  }

  return `M ${left.join(" L ")} L ${right.reverse().join(" L ")} Z`;
}

export const TornPaperDivider = ({
  orientation = "vertical",
  seed = 1,
  className,
}: TornPaperDividerProps) => {
  const rawId = useId();
  const filterId = `torn-${rawId.replace(/:/g, "")}`;
  const path = useMemo(() => buildTornPath(orientation, seed), [orientation, seed]);
  const isVertical = orientation === "vertical";

  return (
    <svg
      aria-hidden
      viewBox={isVertical ? "0 0 16 1000" : "0 0 1000 16"}
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.35)]",
        isVertical ? "h-full w-[10px]" : "h-[10px] w-full",
        className,
      )}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-2%" width="200%" height="104%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={isVertical ? "1.4 0.04" : "0.04 1.4"}
            numOctaves="3"
            seed={seed * 11}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <path d={path} fill="currentColor" filter={`url(#${filterId})`} />
    </svg>
  );
};
