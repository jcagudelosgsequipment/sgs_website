import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { useHomeWatermark } from "@/contexts/HomeWatermarkContext";
import {
  ArrowRight,
  Globe,
  PhoneCall,
  PlayCircle,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, type DictKey } from "@/lib/i18n";
import { FeaturedCarousel } from "@/components/sgs/home/FeaturedCarousel";

const EASE = [0.32, 0.72, 0, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: EASE },
  }),
};

const WATERMARK_WIDTH = "clamp(7.5rem, min(20vw, 34vh), 29rem)";
const WATERMARK_HEIGHT = "clamp(5rem, min(15vw, 26vh), 22rem)";

type Feature = { icon: typeof Globe; labelKey: DictKey };

const features: Feature[] = [
  { icon: Globe, labelKey: "hero.trust1" },
  { icon: ShieldCheck, labelKey: "hero.trust2" },
  { icon: PhoneCall, labelKey: "hero.trust3" },
  { icon: Settings, labelKey: "hero.trust4" },
];

export const HeroSection = () => {
  const { t } = useI18n();
  const { registerWatermark } = useHomeWatermark();
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerWatermark(watermarkRef.current);
    return () => registerWatermark(null);
  }, [registerWatermark]);

  return (
    <section
      id="top"
      className="relative isolate min-h-[100dvh] w-full overflow-hidden bg-[#060b19] text-white pt-[clamp(5.5rem,10vh,7rem)] pb-[clamp(2.5rem,5vh,4rem)]"
    >
      <img
        src="/FONDO3.png"
        alt=""
        aria-hidden
        className="absolute right-0 top-0 h-full w-full md:w-[88vw] lg:w-[85vw] object-cover object-right pointer-events-none z-0"
      />

      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-full md:w-[72vw] lg:w-[65vw] xl:w-[60vw] z-10 pointer-events-none bg-gradient-to-r from-[#060b19] via-[#060b19] to-transparent"
      />

      <div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#060b19]/90 via-[#060b19]/60 via-[#060b19]/20 to-transparent"
      />

      <div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#060b19]/50 via-transparent to-[#060b19]/90"
      />

      <div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_15%_45%,rgba(29,78,216,0.25),transparent_55%)]"
      />

      <div className="relative z-20 w-full px-[clamp(1.25rem,4vw,4rem)] min-h-[calc(100dvh-clamp(8rem,14vh,11rem))] flex flex-col justify-start hero-tall:justify-center">
        <div className="w-full max-w-[min(100%,1050px)] flex flex-col gap-[clamp(0.75rem,2.5vh,2rem)]">
          {/* Watermark — siempre en flujo; escala con ancho Y alto del viewport */}
          <motion.div
            ref={watermarkRef}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="relative z-30 shrink-0"
            style={{ width: WATERMARK_WIDTH }}
          >
            <div className="relative w-full">
              <div
                aria-hidden
                className="absolute -inset-[clamp(0.5rem,2vh,2rem)] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.18),rgba(29,78,216,0.08)_45%,transparent_72%)] blur-xl"
              />
              <Link to="/" className="relative block w-full transition-opacity hover:opacity-95">
                <img
                  src="/SGS%20watermark.png"
                  alt="SGS Equipment"
                  style={{ maxHeight: WATERMARK_HEIGHT }}
                  className="w-full h-auto object-contain object-left origin-left drop-shadow-[0_8px_28px_rgba(255,255,255,0.24)] brightness-[1.1] contrast-[1.05]"
                />
              </Link>
            </div>
          </motion.div>

          <div className="flex flex-col gap-[clamp(0.5rem,1.8vh,2rem)]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="inline-flex w-fit items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_12px_hsl(var(--accent))]" />
              <span className="text-xs font-semibold tracking-wider text-white/90 uppercase">
                {t("hero.badge")}
              </span>
            </motion.div>

            <h1
              className="font-display font-black tracking-tight text-white leading-[1.05]"
              style={{ fontSize: "clamp(2.25rem, 3.8vw + 1.4vh, 6rem)" }}
            >
              <motion.span
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
                className="block"
              >
                {t("hero.h1.l1")}
              </motion.span>

              <motion.span
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
                className="block mt-[clamp(0.25rem,0.8vh,0.75rem)]"
              >
                <motion.span
                  className="inline-block text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, hsl(var(--accent)) 30%, hsl(18 95% 60%) 50%, hsl(var(--accent)) 70%)",
                    backgroundColor: "hsl(var(--accent))",
                    backgroundSize: "300% 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                  animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
                  transition={{
                    duration: 6,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                >
                  {t("hero.h1.l2a")} {t("hero.h1.l2b")}
                </motion.span>
              </motion.span>
            </h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="max-w-2xl text-white/80 leading-relaxed font-medium"
              style={{ fontSize: "clamp(0.95rem, 1.1vw + 0.6vh, 1.25rem)" }}
            >
              {t("hero.sub")}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="flex flex-col sm:flex-row gap-[clamp(0.75rem,2vh,1.25rem)]"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full h-[clamp(2.75rem,6vh,3.5rem)] px-[clamp(1.5rem,4vw,2.5rem)] bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-base shadow-glow hover:scale-[1.02] transition-transform duration-300"
              >
                <Link to="/equipos">
                  {t("hero.cta1")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full h-[clamp(2.75rem,6vh,3.5rem)] px-[clamp(1.5rem,4vw,2.5rem)] bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white font-bold text-base backdrop-blur-sm transition-all"
              >
                <a href="#video">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  {t("hero.cta2")}
                </a>
              </Button>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={5}
              className="flex flex-wrap items-center gap-x-[clamp(0.75rem,2vw,1.5rem)] gap-y-3 max-w-[38rem]"
            >
              {features.map((f) => (
                <li
                  key={f.labelKey}
                  className="flex items-center gap-2.5 text-left group shrink-0"
                >
                  <div className="h-10 w-10 shrink-0 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-orange-500 backdrop-blur-sm shadow-[0_4px_16px_rgba(29,78,216,0.12)] transition-all group-hover:scale-105 group-hover:border-white/25">
                    <f.icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug max-w-[5.5rem] sm:max-w-none group-hover:text-white transition-colors">
                    {t(f.labelKey)}
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
        className="hidden hero-wide-tall:block absolute bottom-[clamp(4rem,10vh,7rem)] right-[clamp(1.5rem,4vw,5rem)] z-20 w-[min(38vw,32rem)] 2xl:w-[min(42vw,36rem)] origin-bottom-right scale-[0.9] 2xl:scale-100"
      >
        <FeaturedCarousel />
      </motion.div>

      <div className="hero-wide-tall:hidden relative z-20 px-[clamp(1.25rem,4vw,3rem)] mt-[clamp(1.5rem,4vh,2.5rem)] pb-4 w-full max-w-xl mx-auto">
        <FeaturedCarousel />
      </div>
    </section>
  );
};
