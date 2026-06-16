import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
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

const YOUTUBE_EMBED_ID = "MhCIKi6wn_Q";

const highlightKeys: DictKey[] = [
  "about.core.highlight1",
  "about.core.highlight2",
  "about.core.highlight3",
];

export const AboutCorporateCore = () => {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section ref={ref} className="bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:px-12 lg:grid-cols-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={0}
          className="lg:col-span-6"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/50 shadow-2xl">
            <iframe
              className="absolute left-0 top-0 h-full w-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_EMBED_ID}?rel=0`}
              title={t("about.core.videoTitle")}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          custom={1}
          className="lg:col-span-6"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {t("about.core.eyebrow")}
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t("about.core.title")}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>{t("about.core.p1")}</p>
            <p>{t("about.core.p2")}</p>
          </div>
          <ul className="mt-8 space-y-3">
            {highlightKeys.map((key) => (
              <li key={key} className="flex items-start gap-3 text-sm text-foreground/90 md:text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={2} />
                {t(key)}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
