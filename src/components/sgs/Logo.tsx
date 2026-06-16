import { Link } from "react-router-dom";

export const Logo = ({ light = false }: { light?: boolean }) => (
  <Link
    to="/"
    className="flex items-center group transition-opacity hover:opacity-90"
    aria-label="SGS Equipment"
  >
    <img
      src="/SGS_LOGO.webp"
      alt="SGS Equipment"
      className={`h-14 w-auto md:h-16 lg:h-[68px] ${
        light
          ? "drop-shadow-[0_4px_22px_rgba(255,255,255,0.35)] brightness-110"
          : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
      }`}
    />
  </Link>
);
