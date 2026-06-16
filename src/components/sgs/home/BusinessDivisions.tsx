import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, type Variants } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ConstructionIcon,
  Package,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartsCarousel } from "@/components/sgs/home/PartsCarousel";
import { ReconditionedCarousel } from "@/components/sgs/home/ReconditionedCarousel";
import { useI18n, type DictKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: EASE },
  }),
};

const slideIn = (fromRight: boolean): Variants => ({
  hidden: { opacity: 0, x: fromRight ? 40 : -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE },
  },
});

type CardKind = "default" | "carousel" | "parts-carousel" | "image";

type Division = {
  icon: LucideIcon;
  eyebrowKey: DictKey;
  titleKey: DictKey;
  description: ReactNode;
  highlightKeys: DictKey[];
  cta: { labelKey: DictKey; to: string; external?: boolean };
  brand: string;
  card: CardKind;
  imageSrc?: string;
  imageAltKey?: DictKey;
};

const CardInner = ({ division, t }: { division: Division; t: (k: DictKey) => string }) => {
  if (division.card === "carousel") {
    return <ReconditionedCarousel />;
  }

  if (division.card === "parts-carousel") {
    return <PartsCarousel />;
  }

  if (division.card === "image" && division.imageSrc) {
    return (
      <div className="relative h-[320px] w-full overflow-hidden">
        <img
          src={division.imageSrc}
          alt={division.imageAltKey ? t(division.imageAltKey) : division.brand}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2.5 text-center">
      {division.highlightKeys.map((key) => (
        <div
          key={key}
          className="flex min-h-[68px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-[10px] font-semibold uppercase leading-tight tracking-wider text-white/85"
        >
          {t(key)}
        </div>
      ))}
    </div>
  );
};

const DivisionRow = ({ division, reversed }: { division: Division; reversed: boolean }) => {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const isVisualCard =
    division.card === "carousel" ||
    division.card === "parts-carousel" ||
    division.card === "image";

  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <motion.div
        variants={slideIn(reversed)}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className={reversed ? "lg:order-2" : ""}
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {t(division.eyebrowKey)}
        </span>
        <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[40px] lg:leading-[1.1]">
          {t(division.titleKey)}
        </h3>
        <div className="mt-5 text-base leading-relaxed text-muted-foreground lg:text-lg">
          {division.description}
        </div>
        {division.highlightKeys.length > 0 && (
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {division.highlightKeys.map((key) => (
              <li key={key} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t(key)}
              </li>
            ))}
          </ul>
        )}
        <Button
          asChild
          size="lg"
          className="mt-8 h-12 rounded-full bg-accent px-7 font-semibold text-accent-foreground shadow-glow transition-transform hover:bg-accent-hover hover:scale-[1.02]"
        >
          {division.cta.external ? (
            <a href={division.cta.to} target="_blank" rel="noopener noreferrer">
              {t(division.cta.labelKey)}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </a>
          ) : (
            <Link to={division.cta.to}>
              {t(division.cta.labelKey)}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          )}
        </Button>
      </motion.div>

      <motion.div
        variants={slideIn(!reversed)}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className={reversed ? "lg:order-1" : ""}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-hero shadow-card",
            isVisualCard ? "p-0" : "p-8 lg:p-10",
          )}
        >
          <div className="absolute inset-0 grid-pattern opacity-60" aria-hidden />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,hsl(var(--accent)/0.18),transparent_55%)]"
            aria-hidden
          />

          {isVisualCard ? (
            <CardInner division={division} t={t} />
          ) : (
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-accent/30 bg-accent/15 text-accent">
                  <division.icon className="h-7 w-7" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                  {t(division.eyebrowKey)}
                </span>
              </div>

              <div className="mt-10">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary-glow">
                  {t("footer.brand")}
                </div>
                <div className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
                  {division.brand}
                </div>
              </div>

              <div className="mt-6">
                <CardInner division={division} t={t} />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const BusinessDivisions = () => {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  const divisions: Division[] = useMemo(
    () => [
      {
        icon: ConstructionIcon,
        eyebrowKey: "biz.div1.eyebrow",
        titleKey: "biz.div1.title",
        description: t("biz.div1.desc"),
        highlightKeys: ["biz.div1.h1", "biz.div1.h2", "biz.div1.h3"],
        cta: { labelKey: "biz.div1.cta", to: "/equipos" },
        brand: "SGS Equipment",
        card: "carousel",
      },
      {
        icon: Calendar,
        eyebrowKey: "biz.div2.eyebrow",
        titleKey: "biz.div2.title",
        description: (
          <>
            <p>{t("biz.div2.p1")}</p>
            <p className="mt-4">
              {t("biz.div2.p2.before")}{" "}
              <a
                href="https://sgs.rentals/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent transition-colors hover:text-accent-hover hover:underline"
              >
                SGS.RENTALS
              </a>{" "}
              {t("biz.div2.p2.after")}
            </p>
            <p className="mt-4">{t("biz.div2.p3")}</p>
          </>
        ),
        highlightKeys: [],
        cta: { labelKey: "biz.div2.cta", to: "/contacto" },
        brand: "SGS Rentals",
        card: "image",
        imageSrc: "/Equipment.png",
        imageAltKey: "biz.div2.imgAlt",
      },
      {
        icon: Package,
        eyebrowKey: "biz.div3.eyebrow",
        titleKey: "biz.div3.title",
        description: t("biz.div3.desc"),
        highlightKeys: ["biz.div3.h1", "biz.div3.h2", "biz.div3.h3"],
        cta: { labelKey: "biz.div3.cta", to: "https://gseparts.us", external: true },
        brand: "GS Express",
        card: "parts-carousel",
      },
    ],
    [t],
  );

  return (
    <section className="relative bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={0}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {t("biz.eyebrow")}
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[44px]">
            {t("biz.title")}
          </h2>
          <p className="mt-4 text-base text-muted-foreground lg:text-lg">
            {t("biz.subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 space-y-20 lg:space-y-28">
          {divisions.map((division, index) => (
            <DivisionRow
              key={division.titleKey}
              division={division}
              reversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
