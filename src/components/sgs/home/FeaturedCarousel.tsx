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
    "relative w-full max-w-2xl lg:max-w-3xl min-h-[280px] bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl hover:scale-[1.01] transition-transform duration-300";

  if (status === "loading") {
    return (
      <div className={`${wrapperClasses} p-6 flex items-center gap-6`}>
        <div className="flex w-52 h-52 md:w-64 md:h-64 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10">
          <Cog className="w-10 h-10 animate-spin text-white/50" strokeWidth={1.5} />
        </div>
        <div className="flex-1 text-[11px] tracking-[0.25em] uppercase text-white/55">
          {t("hero.card.loading")}
        </div>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className={`${wrapperClasses} p-6 flex items-center justify-center`}>
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/55">
          {t("hero.card.empty")}
        </span>
      </div>
    );
  }

  const current = items[index];

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 lg:gap-7 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${current.id}-${index}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="relative shrink-0 w-full md:w-52 md:h-52 lg:w-64 lg:h-64 h-60 rounded-xl overflow-hidden bg-gradient-to-br from-secondary to-industrial-navy-deep ring-1 ring-white/10"
          >
            <img
              src={current.photoUrl}
              alt={current.displayName ?? current.model}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.22em] uppercase text-white bg-accent px-2.5 py-1 rounded-full shadow-glow">
              <span className="w-1 h-1 rounded-full bg-white" />
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
            className="flex-1 min-w-0"
          >
            <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-primary-glow">
              <span className="bg-primary-glow/10 border border-primary-glow/20 px-2.5 py-1 rounded-full">
                {t("hero.featured")}
              </span>
            </div>

            <h3 className="mt-3 text-xl md:text-2xl font-bold text-white tracking-tight leading-tight line-clamp-2">
              {current.manufacturer} {current.model}
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3.5">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/55 font-semibold">
                  <Gauge className="w-3.5 h-3.5" /> {t("hero.card.cap")}
                </div>
                <div className="mt-1.5 text-lg lg:text-xl font-bold text-white truncate">
                  {current.capacity || "—"}
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3.5">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/55 font-semibold">
                  <Fuel className="w-3.5 h-3.5" /> {t("hero.card.fuel")}
                </div>
                <div className="mt-1.5 text-lg lg:text-xl font-bold text-white truncate">
                  {current.fuelType || "—"}
                </div>
              </div>
            </div>

            <Button
              asChild
              className="w-full h-14 bg-accent hover:opacity-90 font-bold text-accent-foreground text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-5 border-none"
            >
              <Link to="/contacto">
                {t("hero.card.cta")}
                <ArrowRight className="w-5 h-5" />
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
            className="absolute -left-5 top-1/2 -translate-y-1/2 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 text-white hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label={t("hero.card.next")}
            onClick={goNext}
            className="absolute -right-5 top-1/2 -translate-y-1/2 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 text-white hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex md:hidden items-center justify-between px-5 pb-4">
            <button
              type="button"
              aria-label={t("hero.card.prev")}
              onClick={goPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Equipment ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-accent" : "w-1.5 bg-white/25 hover:bg-white/45"
                    }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label={t("hero.card.next")}
              onClick={goNext}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden md:flex absolute bottom-2 left-1/2 -translate-x-1/2 items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Equipment ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-accent" : "w-1 bg-white/25 hover:bg-white/45"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
