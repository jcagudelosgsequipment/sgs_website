import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { FeaturedCarousel } from "@/components/sgs/home/FeaturedCarousel";
import { useI18n } from "@/lib/i18n";

const EASE = [0.32, 0.72, 0, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const FeaturedSection = () => {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section id="featured" className="relative overflow-hidden bg-[#060b19] py-20 text-white lg:py-28">
      <div className="absolute inset-0 grid-pattern opacity-60" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(29,78,216,0.28),transparent_55%)]"
      />
      <div className="container relative mx-auto px-4">
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {t("featured.eyebrow")}
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[44px]">
            {t("featured.title")}
          </h2>
          <p className="mt-4 text-base text-white/70 lg:text-lg">{t("featured.subtitle")}</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="mx-auto mt-12 max-w-5xl"
        >
          <FeaturedCarousel />
        </motion.div>
      </div>
    </section>
  );
};
