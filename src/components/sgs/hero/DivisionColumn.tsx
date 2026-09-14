import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Globe,
  Headphones,
  Play,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, type DictKey } from "@/lib/i18n";

export type HoveredCard = 0 | 1 | 2 | null;

type Feature = { icon: LucideIcon; labelKey: DictKey };

const FEATURES: Feature[] = [
  { icon: Globe, labelKey: "hero.trust1" },
  { icon: ShieldCheck, labelKey: "hero.trust2" },
  { icon: BadgeCheck, labelKey: "hero.trust4" },
  { icon: Headphones, labelKey: "hero.trust3" },
];

export type DivisionFooter = "highlights" | "none";

export type DivisionData = {
  index: 0 | 1 | 2;
  image: string;
  imagePosition: string;
  brand: string;
  moduleKey: DictKey;
  badgeKey: DictKey;
  descKey: DictKey;
  ctaKey: DictKey;
  href: string;
  external?: boolean;
  fullClick?: boolean;
  showVideo?: boolean;
  footer?: DivisionFooter;
};

type DivisionColumnProps = {
  division: DivisionData;
  hoveredCard: HoveredCard;
  onHover: (index: 0 | 1 | 2) => void;
};

export const DivisionColumn = ({
  division,
  hoveredCard,
  onHover,
}: DivisionColumnProps) => {
  const { t } = useI18n();
  const isHovered = hoveredCard === division.index;
  const isDimmed = hoveredCard !== null && !isHovered;
  const moduleName = t(division.moduleKey);
  const footer = division.footer ?? "none";

  const ctaClass = cn(
    "inline-flex h-11 items-center justify-center rounded-full bg-[#FF5500] px-5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,85,0,0.35)] transition-all duration-500 ease-out hover:bg-[#e64d00]",
    isHovered && "scale-105 shadow-[0_0_32px_rgba(255,85,0,0.7)] ring-2 ring-white/25",
  );

  const ctaContent = (
    <>
      {t(division.ctaKey)}
      <ArrowRight className="ml-1.5 h-4 w-4" />
    </>
  );

  const isHashLink = !division.external && division.href.startsWith("#");
  const cta = division.fullClick ? (
    <span className={ctaClass}>{ctaContent}</span>
  ) : division.external ? (
    <a href={division.href} target="_blank" rel="noopener noreferrer" className={ctaClass}>
      {ctaContent}
    </a>
  ) : isHashLink ? (
    <a href={division.href} className={ctaClass}>
      {ctaContent}
    </a>
  ) : (
    <Link to={division.href} className={ctaClass}>
      {ctaContent}
    </Link>
  );

  return (
    <article
      onMouseEnter={() => onHover(division.index)}
      className={cn(
        "relative isolate flex min-h-[88vh] min-w-0 w-full flex-1 flex-col overflow-hidden lg:h-full lg:min-h-0",
        "origin-center transform-gpu transition-all duration-500 ease-out",
        isHovered && "lg:z-30 lg:scale-[1.03]",
        isDimmed && "lg:z-10 lg:scale-98 lg:blur-[3px]",
        hoveredCard === null && "z-20 scale-100 blur-0",
        division.fullClick && "cursor-pointer",
      )}
    >
      {division.fullClick ? (
        isHashLink || division.external ? (
          <a
            href={division.href}
            className="absolute inset-0 z-30"
            aria-label={`${division.brand} ${moduleName}`}
            {...(division.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          />
        ) : (
          <Link
            to={division.href}
            className="absolute inset-0 z-30"
            aria-label={`${division.brand} ${moduleName}`}
          />
        )
      ) : null}
      <img
        src={division.image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: division.imagePosition }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#060b19] via-[#060b19]/70 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#060b19]/70 via-transparent to-[#060b19]/30"
      />

      <div className="relative z-10 flex h-full flex-col px-6 pb-8 pt-28 sm:px-8 lg:px-6 xl:px-8">
        <div className="flex min-h-[3.25rem] items-start">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-[#060b19]/55 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5500] shadow-[0_0_10px_#FF5500]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:text-xs">
              {t(division.badgeKey)}
            </span>
          </div>
        </div>

        <h2 className="mt-5 font-display font-black leading-[0.88] tracking-tight">
          <span className="block text-[clamp(2.4rem,4.4vw,4.75rem)] text-white">{division.brand}</span>
          <span className="mt-1 block text-[clamp(1.65rem,3.2vw,3.25rem)] text-[#FF5500]">
            {moduleName}
          </span>
        </h2>

        <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-white/85 sm:text-base">
          {t(division.descKey)}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {cta}

          {division.showVideo ? (
            <a
              href="#video"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/70 bg-transparent px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-500 hover:bg-white/10"
            >
              <Play className="mr-2 h-4 w-4 fill-white" />
              {t("hero.cta2")}
            </a>
          ) : null}
        </div>

        {footer === "highlights" ? (
          <ul className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3 pt-8 lg:grid-cols-1">
            {FEATURES.map((feature) => (
              <li key={feature.labelKey} className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF5500] text-white shadow-[0_4px_12px_rgba(255,85,0,0.35)]">
                  <feature.icon className="h-3.5 w-3.5" strokeWidth={2.4} />
                </span>
                <span className="text-xs font-semibold text-white sm:text-sm">{t(feature.labelKey)}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-20 bg-[#060b19] transition-opacity duration-500 ease-out",
          isDimmed ? "lg:opacity-[0.62]" : "opacity-0",
        )}
      />
    </article>
  );
};
