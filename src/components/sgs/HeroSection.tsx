import { Fragment, useState } from "react";
import {
  DivisionColumn,
  type DivisionData,
  type HoveredCard,
} from "@/components/sgs/hero/DivisionColumn";
import { TornPaperDivider } from "@/components/sgs/hero/TornPaperDivider";

const DIVISIONS: DivisionData[] = [
  {
    index: 0,
    image: "/FONDO3.png",
    imagePosition: "right center",
    brand: "SGS",
    moduleKey: "hero.col.equipment.module",
    badgeKey: "hero.col.equipment.badge",
    descKey: "hero.col.equipment.desc",
    ctaKey: "hero.col.equipment.cta",
    href: "/equipos",
    showVideo: true,
    footer: "highlights",
  },
  {
    index: 1,
    image: "/TUg_Service_shop_.webp",
    imagePosition: "center center",
    brand: "SGS",
    moduleKey: "hero.col.rentals.module",
    badgeKey: "hero.col.rentals.badge",
    descKey: "hero.col.rentals.desc",
    ctaKey: "hero.col.rentals.cta",
    href: "/rentals",
    fullClick: true,
    footer: "none",
  },
  {
    index: 2,
    image: "/Electronic_repair_service_.webp",
    imagePosition: "center center",
    brand: "SGS",
    moduleKey: "hero.col.parts.module",
    badgeKey: "hero.col.parts.badge",
    descKey: "hero.col.parts.desc",
    ctaKey: "hero.col.parts.cta",
    href: "https://gseparts.us",
    external: true,
    footer: "none",
  },
];

export const HeroSection = () => {
  const [hoveredCard, setHoveredCard] = useState<HoveredCard>(null);

  return (
    <section
      id="top"
      onMouseLeave={() => setHoveredCard(null)}
      className="relative isolate flex min-h-[100dvh] w-full max-w-full flex-col overflow-hidden bg-[#060b19] lg:h-[100dvh] lg:flex-row"
    >
      {DIVISIONS.map((division, i) => (
        <Fragment key={division.moduleKey}>
          {i > 0 ? (
            <TornPaperDivider
              orientation="horizontal"
              seed={i + 2}
              className="relative z-40 shrink-0 lg:hidden"
            />
          ) : null}
          <DivisionColumn
            division={division}
            hoveredCard={hoveredCard}
            onHover={setHoveredCard}
          />
        </Fragment>
      ))}

      <TornPaperDivider
        seed={1}
        className="absolute left-1/3 top-0 z-40 hidden -translate-x-1/2 lg:block"
      />
      <TornPaperDivider
        seed={4}
        className="absolute left-2/3 top-0 z-40 hidden -translate-x-1/2 lg:block"
      />
    </section>
  );
};
