import { useEffect, useState } from "react";
import { fetchEquipment } from "@/services/equipmentService";
import { useI18n } from "@/lib/i18n";
import type { EquipmentItem } from "@/types/equipment";

const ROTATE_MS = 3800;
const MAX_ITEMS = 4;
const CARD_HEIGHT = "h-[320px]";

export const ReconditionedCarousel = () => {
  const { t } = useI18n();
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchEquipment()
      .then((data) => {
        if (cancelled) return;
        const withPhotos = data.filter(
          (it) => typeof it.photoUrl === "string" && it.photoUrl.length > 0,
        );
        withPhotos.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
        setItems(withPhotos.slice(0, MAX_ITEMS));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (error || items.length === 0) {
    return (
      <div
        className={`flex ${CARD_HEIGHT} w-full items-center justify-center text-[11px] uppercase tracking-[0.25em] text-white/40`}
      >
        {error ? t("equipos.carousel.unavailable") : t("equipos.carousel.loading")}
      </div>
    );
  }

  return (
    <div className={`relative ${CARD_HEIGHT} w-full overflow-hidden`}>
      {items.map((item, i) => {
        const isActive = i === index;
        return (
          <div
            key={`${item.id}-${i}`}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={item.photoUrl}
              alt={item.displayName ?? item.model}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
              aria-hidden
            />
            <div className="absolute bottom-4 left-5 max-w-[65%]">
              <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-accent/90">
                {item.manufacturer || "SGS Equipment"}
              </div>
              <div className="mt-1 line-clamp-1 font-display text-xs font-medium tracking-tight text-white/95">
                {item.model || item.displayName}
              </div>
            </div>
          </div>
        );
      })}

      {items.length > 1 && (
        <div className="absolute bottom-4 right-5 flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show equipment ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-accent" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
