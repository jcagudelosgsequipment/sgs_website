import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { fetchEquipment } from "@/services/equipmentService";
import { useQuote } from "@/contexts/QuoteContext";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { EquipmentItem } from "@/types/equipment";
import { Button } from "@/components/ui/button";

function workOrderFromItem(item: EquipmentItem): string {
  if (item.title?.trim()) return item.title.trim();
  const m = item.photoUrl?.match(/\/api\/image\/([^/?#]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

const specLabel = "text-xs font-medium uppercase tracking-wider text-slate-400";
const specValue = "mt-1 text-sm font-semibold text-slate-800";
const premiumCard =
  "rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8";

const TRUST_BULLET_KEYS = [
  "equipment.trust1",
  "equipment.trust2",
  "equipment.trust3",
] as const;

const EquipmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, translateCategory } = useI18n();
  const { addToQuote, removeFromQuote, isInQuote } = useQuote();
  const [allEquipment, setAllEquipment] = useState<EquipmentItem[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setListLoading(true);
      setListError(null);
      try {
        const list = await fetchEquipment();
        if (cancelled) return;
        setAllEquipment(list);
        const found = list.find((e) => String(e.id) === String(id));
        setEquipment(found ?? null);
        if (found?.photoUrl) setMainImageUrl(found.photoUrl);
      } catch (e) {
        if (!cancelled) {
          setListError(e instanceof Error ? e.message : t("equipment.loadError"));
          setEquipment(null);
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const workOrder = useMemo(
    () => (equipment ? workOrderFromItem(equipment) : ""),
    [equipment]
  );

  useEffect(() => {
    if (!workOrder) {
      setGallery([]);
      setGalleryLoading(false);
      return;
    }

    let cancelled = false;
    setGalleryLoading(true);
    fetch(`/api/gallery/${encodeURIComponent(workOrder)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((urls: unknown) => {
        if (cancelled) return;
        const list = Array.isArray(urls) ? urls.filter((u): u is string => typeof u === "string") : [];
        setGallery(list);
        if (list.length > 0) setMainImageUrl(list[0]);
        else if (equipment?.photoUrl) setMainImageUrl(equipment.photoUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setGallery([]);
          if (equipment?.photoUrl) setMainImageUrl(equipment.photoUrl);
        }
      })
      .finally(() => {
        if (!cancelled) setGalleryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [workOrder, equipment?.photoUrl]);

  const thumbnails = useMemo(() => {
    if (gallery.length > 0) return gallery;
    if (equipment?.photoUrl) return [equipment.photoUrl];
    return [];
  }, [gallery, equipment?.photoUrl]);

  const selectThumb = useCallback((url: string) => {
    setMainImageUrl(url);
  }, []);

  const woDisplay = workOrder || String(equipment?.id ?? "—");
  const categoryLabel =
    equipment?.equipmentType?.trim()
      ? translateCategory(equipment.equipmentType)
      : t("equipment.categoryFallback");
  const modelLabel = equipment?.model?.trim() || t("equipment.modelFallback");

  const relatedEquipment = useMemo(() => {
    if (!equipment) return [];
    return allEquipment
      .filter(
        (item) =>
          item.equipmentType === equipment.equipmentType &&
          String(item.id) !== String(equipment.id)
      )
      .slice(0, 3);
  }, [allEquipment, equipment]);

  const overviewText = equipment
    ? t("equipment.overviewTemplate", {
        manufacturer: equipment.manufacturer,
        model: equipment.model,
        type: translateCategory(equipment.equipmentType),
      })
    : "";

  if (listLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50/60 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" aria-hidden />
        <span className="sr-only">{t("equipment.loading")}</span>
      </div>
    );
  }

  if (listError || equipment === null) {
    return (
      <div className="min-h-[60vh] bg-slate-50/60 px-4 py-16 text-center text-slate-600">
        <p className="text-lg font-medium text-slate-900">
          {listError || t("equipment.notFound")}
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-6 border-slate-200 bg-white text-slate-800 shadow-md shadow-slate-200/40 hover:bg-slate-50"
        >
          <Link to="/equipos">{t("equipment.backCatalog")}</Link>
        </Button>
      </div>
    );
  }

  const isAdded = isInQuote(equipment.id);

  return (
    <main
      className="min-h-screen bg-slate-50/60 pb-12 text-slate-900 [background-image:radial-gradient(rgb(148_163_184/0.12)_1px,transparent_1px)] [background-size:20px_20px]"
    >
      <div className="border-b border-slate-200/60 bg-white/70 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <nav
            className="flex flex-wrap items-center gap-1 text-sm text-slate-500"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="transition-colors hover:text-orange-600">
              {t("equipment.home")}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
            <Link to="/equipos" className="transition-colors hover:text-orange-600">
              {categoryLabel}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
            <span className="font-medium text-slate-800">{modelLabel}</span>
          </nav>
        </div>
      </div>

      <section className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10 xl:gap-12">
          {/* Gallery */}
          <div className="flex flex-col gap-4 lg:h-full">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              className="group mb-4 gap-2 pl-0 font-semibold text-slate-500 transition-colors hover:bg-transparent hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t("equipment.backButton")}
            </Button>

            <div className={`overflow-hidden ${premiumCard} shadow-md shadow-slate-200/40`}>
              <div className="relative flex aspect-[4/3] items-center justify-center rounded-xl bg-gradient-to-b from-slate-50 to-white">
                {mainImageUrl ? (
                  <img
                    src={mainImageUrl}
                    alt={equipment.displayName}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-slate-500">{t("equipment.noImage")}</span>
                )}
                {galleryLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-[2px]">
                    <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                  </div>
                ) : null}
              </div>
            </div>

            {thumbnails.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {thumbnails.map((url) => {
                  const active = url === mainImageUrl;
                  return (
                    <button
                      key={url}
                      type="button"
                      onClick={() => selectThumb(url)}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                        active
                          ? "border-orange-500 ring-2 ring-orange-400/35"
                          : "border-slate-100 hover:border-orange-200"
                      }`}
                      aria-current={active ? "true" : undefined}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  );
                })}
              </div>
            ) : null}

            <motion.button
              type="button"
              onClick={() => {
                document.getElementById("equipment-overview")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="group mt-auto hidden cursor-pointer select-none flex-col items-center justify-center pt-12 text-slate-400 transition-colors hover:text-slate-700 lg:flex"
              aria-label={t("equipment.viewMore")}
            >
              <span className="text-xs font-bold uppercase tracking-widest">
                {t("equipment.viewMore")}
              </span>
              <ChevronDown className="mt-1 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
            </motion.button>
          </div>

          {/* Summary + specs */}
          <div className="flex flex-col gap-6 lg:gap-8 lg:pt-12">
            <div className={premiumCard}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                SGS <span className="text-orange-500">Equipment</span>
              </p>
              <h1 className="mt-3 bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl">
                {equipment.manufacturer} {equipment.model}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{equipment.displayName}</p>

              <div className="mt-8">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => {
                    if (isAdded) {
                      removeFromQuote(equipment.id);
                    } else {
                      addToQuote(equipment);
                    }
                  }}
                  className={cn(
                    "h-14 w-full rounded-xl px-8 text-base font-bold uppercase tracking-wide transition sm:w-auto",
                    isAdded
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-accent text-accent-foreground shadow-md hover:bg-accent-hover"
                  )}
                >
                  {isAdded ? t("equipment.removeQuote") : t("equipment.addQuote")}
                </Button>
              </div>
            </div>

            <div className={premiumCard}>
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">
                {t("equipment.specs")}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { label: t("equipment.spec.workOrder"), value: woDisplay },
                  { label: t("equipment.spec.make"), value: equipment.manufacturer || "—" },
                  { label: t("equipment.spec.model"), value: equipment.model || "—" },
                  { label: t("equipment.spec.mfgYear"), value: equipment.mfgYear?.toString().trim() || "—" },
                  { label: t("equipment.spec.capacity"), value: equipment.capacity || "—" },
                  { label: t("equipment.spec.fuelType"), value: equipment.fuelType?.trim() || "—" },
                  {
                    label: t("equipment.spec.category"),
                    value: equipment.equipmentType
                      ? translateCategory(equipment.equipmentType)
                      : "—",
                  },
                ].map((row, index) => (
                  <div
                    key={row.label}
                    className={`rounded-xl border border-slate-100 px-4 py-3 shadow-sm shadow-slate-200/30 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <div className={specLabel}>{row.label}</div>
                    <div className={specValue}>{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <article id="equipment-overview" className={`mt-10 md:mt-12 ${premiumCard}`}>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
            {t("equipment.overview")}
            <span className="mt-1 block text-sm font-normal text-slate-500">
              {t("equipment.overviewSub")}
            </span>
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-600 md:text-base">
            {overviewText}
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TRUST_BULLET_KEYS.map((key) => (
              <li
                key={key}
                className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden />
                {t(key)}
              </li>
            ))}
          </ul>
        </article>

        {relatedEquipment.length > 0 ? (
          <section className="mt-16 md:mt-24" aria-labelledby="related-equipment-heading">
            <h2
              id="related-equipment-heading"
              className="mb-6 text-2xl font-bold tracking-tight text-slate-900"
            >
              {t("equipment.related")}
            </h2>
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
              {relatedEquipment.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
};

export default EquipmentDetail;
