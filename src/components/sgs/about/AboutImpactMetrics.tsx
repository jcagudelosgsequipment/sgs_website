import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Award, ShieldCheck, Users, type LucideIcon } from "lucide-react";
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

type Metric = {
  icon: LucideIcon;
  valueKey: DictKey;
  labelKey: DictKey;
};

const metrics: Metric[] = [
  { icon: Award, valueKey: "about.metric1.value", labelKey: "about.metric1.label" },
  { icon: Users, valueKey: "about.metric2.value", labelKey: "about.metric2.label" },
  { icon: ShieldCheck, valueKey: "about.metric3.value", labelKey: "about.metric3.label" },
];

export const AboutImpactMetrics = () => {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} className="px-6 pb-20 md:px-12">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        custom={0}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#060b19] via-[#0a1628] to-[#060b19] px-6 py-12 text-white shadow-xl md:px-10 md:py-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(234,88,12,0.12),transparent_50%)]"
        />

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.labelKey}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={index + 1}
              className="flex flex-col items-center text-center md:items-start md:text-left md:border-r md:border-white/10 md:px-6 md:last:border-r-0"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-orange-500">
                <metric.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                {t(metric.valueKey)}
              </p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70 md:text-base">
                {t(metric.labelKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
