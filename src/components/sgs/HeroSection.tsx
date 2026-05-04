import { motion, type Variants } from "framer-motion";
import { ArrowRight, PlayCircle, Check, ChevronDown, Cog, Shield, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const EASE = [0.32, 0.72, 0, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: EASE },
  }),
};

export const HeroSection = () => {
  const { t } = useI18n();
  return (
    <section
      id="top"
      className="relative min-h-screen w-full overflow-hidden bg-gradient-hero text-white"
    >
      {/* Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-60" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,hsl(var(--accent)/0.12),transparent_45%)]" aria-hidden />

      {/* Decorative SVG circuit */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        viewBox="0 0 1200 800"
        fill="none"
        aria-hidden
      >
        <path d="M0 400 L300 400 L350 350 L600 350 L650 400 L1200 400" stroke="white" strokeWidth="1" />
        <path d="M0 200 L200 200 L250 250 L500 250" stroke="white" strokeWidth="1" />
        <path d="M700 600 L900 600 L950 550 L1200 550" stroke="white" strokeWidth="1" />
        <circle cx="300" cy="400" r="4" fill="white" />
        <circle cx="650" cy="400" r="4" fill="white" />
        <circle cx="500" cy="250" r="4" fill="white" />
      </svg>

      <div className="container mx-auto relative pt-32 pb-24 lg:pt-36 lg:pb-32 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-center">
          {/* Left content */}
          <div className="lg:col-span-3 flex flex-col">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex w-fit items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_12px_hsl(var(--accent))]" />
              <span className="text-xs font-medium tracking-wide text-white/85 uppercase">
                {t("hero.badge")}
              </span>
            </motion.div>

            <h1 className="mt-6 font-display font-extrabold tracking-[-0.03em] text-[44px] sm:text-6xl lg:text-[78px] leading-[1.02]">
              <motion.span variants={fadeUp} initial="hidden" animate="show" custom={1} className="block text-white">
                {t("hero.h1.l1")}
              </motion.span>
              <motion.span variants={fadeUp} initial="hidden" animate="show" custom={2} className="block">
                {t("hero.h1.l2a")} <span className="text-gradient-shine">{t("hero.h1.l2b")}</span>
              </motion.span>
            </h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-6 max-w-xl text-base lg:text-lg text-industrial-slate leading-relaxed"
            >
              {t("hero.sub")}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full h-14 px-7 bg-accent hover:bg-accent-hover text-accent-foreground font-semibold text-base shadow-glow hover:scale-[1.02] transition-transform"
              >
                <a href="#equipos">
                  {t("hero.cta1")}
                  <ArrowRight className="w-5 h-5 ml-1.5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full h-14 px-7 bg-transparent border-white/25 text-white hover:bg-white/10 hover:text-white font-semibold text-base"
              >
                <a href="#video">
                  <PlayCircle className="w-5 h-5 mr-1.5" />
                  {t("hero.cta2")}
                </a>
              </Button>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={5}
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3"
            >
              {(["hero.trust1", "hero.trust2", "hero.trust3"] as const).map((k) => (
                <li key={k} className="flex items-center gap-2 text-sm text-white/75">
                  <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  {t(k)}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right featured card */}
          <div className="lg:col-span-2 relative">
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
              <div className="w-[420px] h-[420px] rounded-full border border-primary-glow/15" />
              <div className="absolute w-[320px] h-[320px] rounded-full border border-primary-glow/10" />
              <div className="absolute w-[220px] h-[220px] rounded-full border border-primary-glow/10" />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 110, delay: 0.4 }}
              className="relative z-10 mx-auto max-w-sm"
            >
              <div className="animate-float">
                <div className="rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-card overflow-hidden">
                  {/* Image area */}
                  <div className="relative h-48 bg-gradient-to-br from-secondary to-industrial-navy-deep flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 grid-pattern opacity-40" />
                    <Cog className="relative w-24 h-24 text-white/20" strokeWidth={1.2} />
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest text-accent uppercase bg-accent/10 border border-accent/30 px-2 py-1 rounded-full">
                      {t("hero.featured")}
                    </span>
                  </div>

                  <div className="p-6">
                    <span className="inline-block text-[10px] font-bold tracking-widest text-primary-glow uppercase bg-primary-glow/10 px-2 py-1 rounded-full">
                      {t("hero.card.cat")}
                    </span>
                    <h3 className="mt-3 text-xl font-bold text-white tracking-tight">
                      {t("hero.card.title")}
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/50 font-medium">
                          <Gauge className="w-3 h-3" /> {t("hero.card.cap")}
                        </div>
                        <div className="mt-1 text-sm font-bold text-white">50 ton</div>
                      </div>
                      <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/50 font-medium">
                          <Shield className="w-3 h-3" /> {t("hero.card.reach")}
                        </div>
                        <div className="mt-1 text-sm font-bold text-white">40 m</div>
                      </div>
                    </div>

                    <Button
                      asChild
                      className="mt-5 w-full rounded-full h-11 bg-accent hover:bg-accent-hover text-accent-foreground font-semibold"
                    >
                      <a href="#contacto">
                        {t("hero.card.cta")}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.a
          href="#trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase">{t("hero.scroll")}</span>
          <ChevronDown className="w-4 h-4 animate-bounce-soft" />
        </motion.a>
      </div>
    </section>
  );
};
