import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Cog, Fuel, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchEquipment } from "@/services/equipmentService";
import type { EquipmentItem } from "@/types/equipment";
import { useI18n } from "@/lib/i18n";

const ROTATE_MS = 5500;
const MAX_ITEMS = 6;

export const FeaturedCarousel = () => {
  const { t } = useI18n();
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchEquipment()
      .then((data) => {
        if (cancelled) return;
        const featured = data
          .filter((it) => it.isFeatured === true)
          .filter((it) => typeof it.photoUrl === "string" && it.photoUrl.length > 0)
          .slice(0, MAX_ITEMS);
        setItems(featured);
        setStatus(featured.length > 0 ? "ready" : "empty");
      })
      .catch(() => {
        if (!cancelled) setStatus("empty");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (items.length < 2 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [items.length, paused]);

  const goPrev = () =>
    setIndex((i) => (items.length === 0 ? 0 : (i - 1 + items.length) % items.length));
  const goNext = () =>
    setIndex((i) => (items.length === 0 ? 0 : (i + 1) % items.length));

  const wrapperClasses =
    "relative w-full max-w-full min-w-0 overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl";

  if (status === "loading") {
    return (
      <div className={`${wrapperClasses} flex flex-col items-center gap-4 p-5 sm:flex-row sm:gap-6 sm:p-6`}>
        <div className="flex aspect-[4/3] w-full max-w-[13rem] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] sm:aspect-square sm:h-40 sm:w-40 lg:h-52 lg:w-52">
          <Cog className="h-10 w-10 animate-spin text-white/50" strokeWidth={1.5} />
        </div>
        <div className="text-center text-[11px] uppercase tracking-[0.25em] text-white/55 sm:text-left">
          {t("hero.card.loading")}
        </div>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className={`${wrapperClasses} flex items-center justify-center p-6`}>
        <span className="text-center text-[11px] uppercase tracking-[0.25em] text-white/55">
          {t("hero.card.empty")}
        </span>
      </div>
    );
  }

  const current = items[index];
  const title = [current.manufacturer, current.model].filter(Boolean).join(" ");

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-5 lg:flex-row lg:items-center lg:gap-6 lg:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${current.id}-${index}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-secondary to-industrial-navy-deep ring-1 ring-white/10 sm:aspect-[16/10] lg:aspect-square lg:h-44 lg:w-44 xl:h-52 xl:w-52"
          >
            <img
              src={current.photoUrl}
              alt={current.displayName ?? current.model}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-glow">
              <span className="h-1 w-1 rounded-full bg-white" />
              {t("hero.featured")}
            </span>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`txt-${current.id}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="min-w-0 flex-1"
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-glow">
              <span className="inline-block rounded-full border border-primary-glow/20 bg-primary-glow/10 px-2.5 py-1">
                {t("hero.featured")}
              </span>
            </div>

            <h3 className="mt-3 break-words text-lg font-bold leading-snug tracking-tight text-white sm:text-xl lg:text-2xl">
              {title}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">
              <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2.5 sm:px-3.5 sm:py-3">
                <div className="flex items-start gap-1.5 text-[10px] font-semibold uppercase leading-tight tracking-wide text-white/55 sm:text-[11px]">
                  <Gauge className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="break-words">{t("hero.card.cap")}</span>
                </div>
                <div className="mt-1.5 break-words text-sm font-bold leading-snug text-white sm:text-base lg:text-lg">
                  {current.capacity || "—"}
                </div>
              </div>
              <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2.5 sm:px-3.5 sm:py-3">
                <div className="flex items-start gap-1.5 text-[10px] font-semibold uppercase leading-tight tracking-wide text-white/55 sm:text-[11px]">
                  <Fuel className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="break-words">{t("hero.card.fuel")}</span>
                </div>
                <div className="mt-1.5 break-words text-sm font-bold leading-snug text-white sm:text-base lg:text-lg">
                  {current.fuelType || "—"}
                </div>
              </div>
            </div>

            <Button
              asChild
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border-none bg-accent text-base font-bold text-accent-foreground shadow-lg transition-all hover:opacity-90 sm:mt-5 sm:h-14"
            >
              <Link to="/contacto">
                {t("hero.card.cta")}
                <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label={t("hero.card.prev")}
            onClick={goPrev}
            className="absolute left-2 top-[30%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/85 text-white shadow-xl backdrop-blur-md transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground lg:flex xl:left-3 xl:h-11 xl:w-11"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={t("hero.card.next")}
            onClick={goNext}
            className="absolute right-2 top-[30%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/85 text-white shadow-xl backdrop-blur-md transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground lg:flex xl:right-3 xl:h-11 xl:w-11"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex items-center justify-between px-4 pb-4 lg:hidden">
            <button
              type="button"
              aria-label={t("hero.card.prev")}
              onClick={goPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Equipment ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-accent" : "w-1.5 bg-white/25 hover:bg-white/45"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label={t("hero.card.next")}
              onClick={goNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute bottom-2 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 lg:flex">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Equipment ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-accent" : "w-1 bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
