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
      className="relative isolate min-h-[100dvh] w-full max-w-full overflow-x-clip bg-[#060b19] text-white pt-[clamp(5.5rem,10vh,7rem)] pb-[clamp(2.5rem,5vh,4rem)]"
    >
      <img
        src="/FONDO3.png"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full max-w-none object-cover object-right pointer-events-none z-0 md:left-auto md:right-0 md:w-[min(88%,88vw)] lg:w-[min(85%,85vw)]"
      />

      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-full max-w-full md:w-[72%] lg:w-[65%] xl:w-[60%] z-10 pointer-events-none bg-gradient-to-r from-[#060b19] via-[#060b19] to-transparent"
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

      <div className="relative z-20 w-full max-w-full px-[clamp(1rem,4vw,4rem)] min-h-[calc(100dvh-clamp(8rem,14vh,11rem))] flex flex-col justify-start hero-tall:justify-center">
        <div className="w-full max-w-[min(100%,1050px)] min-w-0 flex flex-col gap-[clamp(0.75rem,2.5vh,2rem)]">
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
              className="max-w-full break-words font-display font-black tracking-tight text-white leading-[1.08]"
              style={{ fontSize: "clamp(1.85rem, 3.2vw + 1.2vh, 6rem)" }}
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
                className="mt-[clamp(0.25rem,0.8vh,0.75rem)] block max-w-full"
              >
                <motion.span
                  className="max-w-full text-transparent bg-clip-text [background-clip:text] [-webkit-text-fill-color:transparent]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, hsl(var(--accent)) 30%, hsl(18 95% 60%) 50%, hsl(var(--accent)) 70%)",
                    backgroundColor: "hsl(var(--accent))",
                    backgroundSize: "300% 100%",
                    backgroundRepeat: "no-repeat",
                    boxDecorationBreak: "clone",
                    WebkitBoxDecorationBreak: "clone",
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
              className="flex w-full max-w-full flex-col gap-[clamp(0.75rem,2vh,1.25rem)] sm:flex-row sm:flex-wrap"
            >
              <Button
                asChild
                size="lg"
                className="h-[clamp(2.75rem,6vh,3.5rem)] w-full max-w-full rounded-full bg-accent px-[clamp(1.25rem,4vw,2.5rem)] text-base font-bold text-accent-foreground shadow-glow transition-transform duration-300 hover:scale-[1.02] hover:bg-accent-hover sm:w-auto"
              >
                <Link to="/equipos">
                  {t("hero.cta1")}
                  <ArrowRight className="ml-2 h-5 w-5 shrink-0" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-[clamp(2.75rem,6vh,3.5rem)] w-full max-w-full rounded-full border-white/20 bg-transparent px-[clamp(1.25rem,4vw,2.5rem)] text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <a href="#video">
                  <PlayCircle className="mr-2 h-5 w-5 shrink-0" />
                  {t("hero.cta2")}
                </a>
              </Button>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={5}
              className="grid w-full max-w-[38rem] grid-cols-2 gap-x-3 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-[clamp(0.75rem,2vw,1.5rem)]"
            >
              {features.map((f) => (
                <li
                  key={f.labelKey}
                  className="group flex min-w-0 items-center gap-2.5 text-left sm:shrink-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-orange-500 shadow-[0_4px_16px_rgba(29,78,216,0.12)] backdrop-blur-sm transition-all group-hover:scale-105 group-hover:border-white/25 sm:h-10 sm:w-10">
                    <f.icon className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <span className="min-w-0 break-words text-xs font-semibold leading-snug text-slate-200 transition-colors group-hover:text-white sm:max-w-none sm:text-sm">
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
        className="absolute bottom-[clamp(4rem,10vh,7rem)] right-[clamp(1.5rem,3vw,4rem)] z-20 hidden w-[min(36vw,30rem)] max-w-[calc(100%-1.5rem)] origin-bottom-right hero-wide-tall:block 2xl:w-[min(40vw,34rem)]"
      >
        <FeaturedCarousel />
      </motion.div>

      <div className="relative z-20 mx-auto mt-[clamp(1.5rem,4vh,2.5rem)] w-full max-w-xl min-w-0 px-[clamp(1rem,4vw,3rem)] pb-4 hero-wide-tall:hidden">
        <FeaturedCarousel />
      </div>
    </section>
  );
};
