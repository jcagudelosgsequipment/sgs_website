import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

const ROTATE_MS = 3800;
const CARD_HEIGHT = "h-[320px]";

const PARTS_IMAGES = [
  "/parts1.jpg",
  "/parts2.webp",
  "/parts3.webp",
  "/parts4.webp",
  "/parts5.webp",
] as const;

export const PartsCarousel = () => {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (PARTS_IMAGES.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % PARTS_IMAGES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  const label = t("biz.div3.eyebrow");

  return (
    <div className={`relative ${CARD_HEIGHT} w-full overflow-hidden`}>
      {PARTS_IMAGES.map((src, i) => {
        const isActive = i === index;
        return (
          <div
            key={src}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={src}
              alt={label}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
              aria-hidden
            />
            <div className="absolute bottom-4 left-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/95">
              {label}
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 right-5 flex items-center gap-1.5">
        {PARTS_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show part ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-accent" : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
