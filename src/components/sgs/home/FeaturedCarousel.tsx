import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Cog, Fuel, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchEquipment } from "@/services/equipmentService";
import type { EquipmentItem } from "@/types/equipment";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ROTATE_MS = 7000;
const MAX_ITEMS = 6;

function resolveDescription(item: EquipmentItem, fallback: string): string {
  const raw = item.description?.trim() ?? "";
  if (!raw || /^no description/i.test(raw)) return fallback;
  return raw;
}

export const FeaturedCarousel = () => {
  const { t, translateCategory } = useI18n();
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
    "relative w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#060b19] shadow-2xl";

  if (status === "loading") {
    return (
      <div className={`${wrapperClasses} flex flex-col items-center gap-4 p-6 sm:flex-row sm:gap-6 lg:p-8`}>
        <div className="flex aspect-[16/10] w-full max-w-md shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0a1628]">
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
      <div className={`${wrapperClasses} flex items-center justify-center p-8`}>
        <span className="text-center text-[11px] uppercase tracking-[0.25em] text-white/55">
          {t("hero.card.empty")}
        </span>
      </div>
    );
  }

  const current = items[index];
  const title = [current.manufacturer, current.model].filter(Boolean).join(" ");
  const description = resolveDescription(current, t("featured.descFallback"));
  const detailHref = `/equipos/${encodeURIComponent(String(current.id))}`;

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${current.id}-${index}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#060b19] ring-1 ring-white/10"
          >
            <img
              src={current.photoUrl}
              alt={current.displayName ?? current.model}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,#060b19_78%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_48px_18px_#060b19]"
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
            className="min-w-0"
          >
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-glow">
              <span className="inline-block rounded-full border border-primary-glow/20 bg-primary-glow/10 px-2.5 py-1">
                {translateCategory(current.equipmentType)}
              </span>
            </div>

            <h3 className="mt-3 break-words text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl lg:text-[28px]">
              {title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base lg:line-clamp-5">
              {description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
              <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="flex items-start gap-1.5 text-[10px] font-semibold uppercase leading-tight tracking-wide text-white/55 sm:text-[11px]">
                  <Gauge className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="break-words">{t("hero.card.cap")}</span>
                </div>
                <div className="mt-1.5 break-words text-sm font-bold leading-snug text-white sm:text-base">
                  {current.capacity || "—"}
                </div>
              </div>
              <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="flex items-start gap-1.5 text-[10px] font-semibold uppercase leading-tight tracking-wide text-white/55 sm:text-[11px]">
                  <Fuel className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="break-words">{t("hero.card.fuel")}</span>
                </div>
                <div className="mt-1.5 break-words text-sm font-bold leading-snug text-white sm:text-base">
                  {current.fuelType || "—"}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-12 rounded-xl border-none bg-accent px-6 font-bold text-accent-foreground shadow-lg hover:opacity-90"
              >
                <Link to={detailHref}>
                  {t("featured.view")}
                  <ArrowRight className="ml-1 h-4 w-4 shrink-0" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl border-white/25 bg-transparent px-6 font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/solicitud-cotizacion">{t("hero.card.cta")}</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {items.length > 1 ? (
        <div className="flex items-center justify-between gap-3 px-5 pb-5 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label={t("hero.card.prev")}
            onClick={goPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Equipment ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-white/25 hover:bg-white/45",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label={t("hero.card.next")}
            onClick={goNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
