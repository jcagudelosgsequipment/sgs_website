import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { EquipmentCategoryFilter } from "@/components/equipment/EquipmentCategoryFilter";
import { fetchEquipment } from "@/services/equipmentService";
import { useI18n } from "@/lib/i18n";
import {
  EQUIPMENT_CATEGORIES,
  type EquipmentCategory,
  type EquipmentItem,
} from "@/types/equipment";

type SelectedCategory = "All" | EquipmentCategory;

const parseCategoryParam = (value: string | null): SelectedCategory => {
  if (!value) return "All";
  return EQUIPMENT_CATEGORIES.includes(value as EquipmentCategory)
    ? (value as EquipmentCategory)
    : "All";
};

const Equipos = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>(() =>
    parseCategoryParam(searchParams.get("category"))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEquipment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchEquipment();
        if (!isMounted) return;
        setEquipment(data);
      } catch {
        if (!isMounted) return;
        setError(t("equipos.error"));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadEquipment();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const categoryFromUrl = parseCategoryParam(searchParams.get("category"));
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  const handleCategoryChange = (category: SelectedCategory) => {
    setSelectedCategory(category);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filteredEquipment = useMemo(() => {
    if (selectedCategory === "All") return equipment;
    return equipment.filter((item) => item.equipmentType === selectedCategory);
  }, [equipment, selectedCategory]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">{t("equipos.title")}</h1>
        </header>

        <div className="flex w-full flex-col items-start gap-8 lg:flex-row">
          <aside className="z-30 w-full shrink-0 space-y-4 lg:sticky lg:top-28 lg:w-64">
            <EquipmentCategoryFilter
              categories={EQUIPMENT_CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </aside>

          <div className="w-full flex-1">
            {isLoading ? (
              <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                {t("equipos.loading")}
              </p>
            ) : error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
                {error}
              </p>
            ) : filteredEquipment.length === 0 ? (
              <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                {t("equipos.empty")}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredEquipment.map((item) => (
                  <EquipmentCard key={String(item.id)} equipment={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Equipos;
