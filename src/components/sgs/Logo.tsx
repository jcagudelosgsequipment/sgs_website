import { Link } from "react-router-dom";

type LogoProps = {
  light?: boolean;
  href?: string;
};

export const Logo = ({ light = false, href }: LogoProps) => {
  const className = "flex items-center group transition-opacity hover:opacity-90";
  const imgClassName = `h-14 w-auto md:h-16 lg:h-[68px] ${
    light
      ? "drop-shadow-[0_4px_22px_rgba(255,255,255,0.35)] brightness-110"
      : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
  }`;
  const image = <img src="/SGS_LOGO.webp" alt="SGS Equipment" className={imgClassName} />;

  if (href) {
    return (
      <a href={href} className={className} aria-label="SGS Equipment">
        {image}
      </a>
    );
  }

  return (
    <Link to="/" className={className} aria-label="SGS Equipment">
      {image}
    </Link>
  );
};
