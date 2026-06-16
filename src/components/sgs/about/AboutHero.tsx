import { motion, type Variants } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const EASE = [0.32, 0.72, 0, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: EASE },
  }),
};

export const AboutHero = () => {
  const { t } = useI18n();

  return (
    <section className="relative flex items-center overflow-hidden bg-[#060b19] pb-20 pt-32 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(29,78,216,0.2),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#060b19]/50 via-transparent to-[#060b19]/90"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 text-center md:px-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
            {t("about.badge")}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mx-auto mt-4 max-w-4xl font-display text-4xl font-black leading-[1.1] tracking-tight md:text-6xl"
        >
          {t("about.hero.title")}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg"
        >
          {t("about.hero.subtitle")}
        </motion.p>
      </div>
    </section>
  );
};
