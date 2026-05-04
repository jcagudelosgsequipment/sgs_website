import { Link } from "react-router-dom";

export const Logo = ({ light = false }: { light?: boolean }) => (
  <Link to="/" className="flex items-center gap-2 group" aria-label="SGS Equipment">
    <div className="relative w-9 h-9 rounded-md bg-primary flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative text-primary-foreground font-black text-sm tracking-tight">SGS</span>
    </div>
    <div className="flex items-baseline gap-1.5 leading-none">
      <span className="font-black text-lg tracking-tight text-primary">SGS</span>
      <span className={`font-semibold text-base tracking-tight ${light ? "text-white/90" : "text-secondary"}`}>
        Equipment
      </span>
    </div>
  </Link>
);
