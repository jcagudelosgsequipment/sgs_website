import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, type Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Hammer,
  Settings,
  ShieldAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";
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

type ServiceCard = {
  icon: LucideIcon;
  titleKey: DictKey;
  descKey: DictKey;
};

const serviceCards: ServiceCard[] = [
  { icon: Settings, titleKey: "repair.svc1.title", descKey: "repair.svc1.desc" },
  { icon: Wrench, titleKey: "repair.svc2.title", descKey: "repair.svc2.desc" },
  { icon: Hammer, titleKey: "repair.svc3.title", descKey: "repair.svc3.desc" },
  { icon: ShieldAlert, titleKey: "repair.svc4.title", descKey: "repair.svc4.desc" },
];

type Metric = {
  icon: LucideIcon;
  valueKey: DictKey;
  labelKey: DictKey;
};

const metrics: Metric[] = [
  { icon: Clock, valueKey: "repair.metric1.value", labelKey: "repair.metric1.label" },
  { icon: CheckCircle2, valueKey: "repair.metric2.value", labelKey: "repair.metric2.label" },
  { icon: ShieldAlert, valueKey: "repair.metric3.value", labelKey: "repair.metric3.label" },
];

const benefitKeys: DictKey[] = [
  "repair.benefit1",
  "repair.benefit2",
  "repair.benefit3",
];

const RepairServices = () => {
  const { t } = useI18n();
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const capabilitiesInView = useInView(capabilitiesRef, { once: true, margin: "-12%" });
  const trustInView = useInView(trustRef, { once: true, margin: "-12%" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-10%" });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex items-center overflow-hidden bg-[#060b19] pb-20 pt-32 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(29,78,216,0.22),transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#060b19]/40 via-transparent to-[#060b19]/80"
        />

        <div className="relative z-20 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 md:px-12 lg:grid-cols-12 xl:px-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="w-full lg:col-span-7 xl:col-span-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
              {t("repair.badge")}
            </span>

            <h1 className="mt-6 max-w-3xl font-display text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
              {t("repair.hero.title")}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              {t("repair.hero.subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="relative flex min-h-[420px] w-full items-center justify-center gap-4 pt-8 lg:col-span-5 lg:pt-0 xl:col-span-6"
          >
            <img
              src="/Electronic_repair_service_.webp"
              alt={t("repair.hero.img1.alt")}
              className="aspect-[3/4] w-1/2 -translate-y-6 transform rounded-2xl border border-white/10 object-cover shadow-2xl lg:-translate-y-8"
            />
            <img
              src="/TUg_Service_shop_.webp"
              alt={t("repair.hero.img2.alt")}
              className="aspect-[3/4] w-1/2 translate-y-6 transform rounded-2xl border border-white/10 object-cover shadow-2xl lg:translate-y-8"
            />
          </motion.div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section ref={capabilitiesRef} className="bg-slate-50/70 px-6 py-20 md:px-12 xl:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={capabilitiesInView ? "show" : "hidden"}
          custom={0}
          className="mx-auto max-w-7xl text-center"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {t("repair.capabilities.eyebrow")}
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t("repair.capabilities.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            {t("repair.capabilities.subtitle")}
          </p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {serviceCards.map((service, index) => (
            <motion.article
              key={service.titleKey}
              variants={fadeUp}
              initial="hidden"
              animate={capabilitiesInView ? "show" : "hidden"}
              custom={index + 1}
              className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <service.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-foreground">
                {t(service.titleKey)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(service.descKey)}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section ref={trustRef} className="bg-slate-50/70 px-6 pb-8 md:px-12 xl:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={trustInView ? "show" : "hidden"}
            custom={0}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                {t("repair.trust.eyebrow")}
              </span>
              <div className="mt-8 space-y-8">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.valueKey}
                    variants={fadeUp}
                    initial="hidden"
                    animate={trustInView ? "show" : "hidden"}
                    custom={index + 1}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <metric.icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                        {t(metric.valueKey)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{t(metric.labelKey)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={trustInView ? "show" : "hidden"}
            custom={2}
            className="lg:col-span-7"
          >
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {t("repair.trust.title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
              {t("repair.trust.subtitle")}
            </p>

            <ul className="mt-8 space-y-5">
              {benefitKeys.map((key, index) => (
                <motion.li
                  key={key}
                  variants={fadeUp}
                  initial="hidden"
                  animate={trustInView ? "show" : "hidden"}
                  custom={index + 3}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={2} />
                  <span className="text-sm leading-relaxed text-foreground/90 md:text-base">
                    {t(key)}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section ref={ctaRef} className="px-6 pb-20 md:px-12 xl:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={ctaInView ? "show" : "hidden"}
          custom={0}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#060b19] via-[#0a1628] to-[#060b19] px-8 py-14 text-white shadow-xl md:px-14 md:py-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(234,88,12,0.15),transparent_50%)]"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                {t("repair.cta.title")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
                {t("repair.cta.subtitle")}
              </p>
            </div>

            <Link
              to="/contacto"
              className="inline-flex h-14 shrink-0 items-center gap-2 rounded-full bg-accent px-8 text-base font-bold text-accent-foreground shadow-glow transition-transform hover:scale-[1.02] hover:bg-accent-hover"
            >
              {t("repair.cta.button")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default RepairServices;
