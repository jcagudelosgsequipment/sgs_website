import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Eye, Heart, Target, type LucideIcon } from "lucide-react";
import { useI18n, type DictKey } from "@/lib/i18n";

const EASE = [0.32, 0.72, 0, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.65, ease: EASE },
  }),
};

type Pillar = {
  icon: LucideIcon;
  titleKey: DictKey;
  descKey: DictKey;
};

const pillars: Pillar[] = [
  { icon: Target, titleKey: "about.pillar.mission.title", descKey: "about.pillar.mission.desc" },
  { icon: Eye, titleKey: "about.pillar.vision.title", descKey: "about.pillar.vision.desc" },
  { icon: Heart, titleKey: "about.pillar.values.title", descKey: "about.pillar.values.desc" },
];

export const AboutPillars = () => {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section ref={ref} className="bg-slate-50/70 py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        custom={0}
        className="mx-auto max-w-7xl px-6 text-center"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {t("about.pillars.eyebrow")}
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("about.pillars.title")}
        </h2>
      </motion.div>

      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <motion.article
            key={pillar.titleKey}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            custom={index + 1}
            className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <pillar.icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground">
              {t(pillar.titleKey)}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {t(pillar.descKey)}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
