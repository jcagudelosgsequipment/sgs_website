import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { EquipmentCategoryFilter } from "@/components/equipment/EquipmentCategoryFilter";
import {
  EMPTY_EQUIPMENT_FILTERS,
  EquipmentFilters,
  type EquipmentFilterValues,
} from "@/components/equipment/EquipmentFilters";
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

const parseYear = (value?: string): number | null => {
  if (!value) return null;
  const match = value.match(/\d{4}/);
  if (!match) return null;
  const year = Number.parseInt(match[0], 10);
  return Number.isFinite(year) ? year : null;
};

const uniqueSorted = (values: Iterable<string>): string[] =>
  Array.from(new Set(values))
    .filter((value) => value.trim() && value.trim().toUpperCase() !== "N/A")
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

const filtersFromSearchParams = (params: URLSearchParams): EquipmentFilterValues => ({
  search: params.get("q") ?? "",
  fuelType: params.get("fuel") ?? "",
  capacity: params.get("capacity") ?? "",
  manufacturer: params.get("manufacturer") ?? "",
  yearMin: params.get("yearMin") ?? "",
  yearMax: params.get("yearMax") ?? "",
});

const Equipos = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>(() =>
    parseCategoryParam(searchParams.get("category"))
  );
  const [filters, setFilters] = useState<EquipmentFilterValues>(() =>
    filtersFromSearchParams(searchParams)
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
  }, [t]);

  useEffect(() => {
    setSelectedCategory(parseCategoryParam(searchParams.get("category")));
    setFilters(filtersFromSearchParams(searchParams));
  }, [searchParams]);

  const syncParams = (category: SelectedCategory, nextFilters: EquipmentFilterValues) => {
    const params = new URLSearchParams(searchParams);

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    const entries: Array<[string, string]> = [
      ["q", nextFilters.search.trim()],
      ["fuel", nextFilters.fuelType],
      ["capacity", nextFilters.capacity],
      ["manufacturer", nextFilters.manufacturer],
      ["yearMin", nextFilters.yearMin],
      ["yearMax", nextFilters.yearMax],
    ];

    for (const [key, value] of entries) {
      if (value) params.set(key, value);
      else params.delete(key);
    }

    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (category: SelectedCategory) => {
    setSelectedCategory(category);
    syncParams(category, filters);
  };

  const handleFiltersChange = (partial: Partial<EquipmentFilterValues>) => {
    const next = { ...filters, ...partial };
    setFilters(next);
    syncParams(selectedCategory, next);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_EQUIPMENT_FILTERS);
    syncParams(selectedCategory, EMPTY_EQUIPMENT_FILTERS);
  };

  const fuelOptions = useMemo(
    () => uniqueSorted(equipment.map((item) => item.fuelType ?? "")),
    [equipment]
  );

  const capacityOptions = useMemo(
    () => uniqueSorted(equipment.map((item) => item.capacity ?? "")),
    [equipment]
  );

  const manufacturerOptions = useMemo(
    () => uniqueSorted(equipment.map((item) => item.manufacturer ?? "")),
    [equipment]
  );

  const yearOptions = useMemo(() => {
    const years = equipment
      .map((item) => parseYear(item.mfgYear))
      .filter((year): year is number => year !== null);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [equipment]);

  const filteredEquipment = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    const yearMin = filters.yearMin ? Number.parseInt(filters.yearMin, 10) : null;
    const yearMax = filters.yearMax ? Number.parseInt(filters.yearMax, 10) : null;

    return equipment.filter((item) => {
      if (selectedCategory !== "All" && item.equipmentType !== selectedCategory) {
        return false;
      }

      if (filters.fuelType && (item.fuelType ?? "") !== filters.fuelType) {
        return false;
      }

      if (filters.capacity && (item.capacity ?? "") !== filters.capacity) {
        return false;
      }

      if (filters.manufacturer && item.manufacturer !== filters.manufacturer) {
        return false;
      }

      const itemYear = parseYear(item.mfgYear);
      if (yearMin !== null) {
        if (itemYear === null || itemYear < yearMin) return false;
      }
      if (yearMax !== null) {
        if (itemYear === null || itemYear > yearMax) return false;
      }

      if (query) {
        const haystack = [
          item.displayName,
          item.manufacturer,
          item.model,
          item.title,
          item.equipmentType,
          item.fuelType,
          item.capacity,
          item.mfgYear,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [equipment, selectedCategory, filters]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">{t("equipos.title")}</h1>
        </header>

        <div className="flex w-full flex-col items-start gap-8 lg:flex-row">
          <aside className="z-30 w-full shrink-0 space-y-6 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:w-64 lg:overflow-y-auto lg:pr-1">
            <EquipmentFilters
              values={filters}
              fuelOptions={fuelOptions}
              capacityOptions={capacityOptions}
              manufacturerOptions={manufacturerOptions}
              yearOptions={yearOptions}
              onChange={handleFiltersChange}
              onClear={handleClearFilters}
              labels={{
                title: t("equipos.filters"),
                search: t("equipos.filter.search"),
                searchPlaceholder: t("equipos.filter.searchPlaceholder"),
                fuelType: t("equipos.filter.fuelType"),
                capacity: t("equipos.filter.capacity"),
                manufacturer: t("equipos.filter.manufacturer"),
                year: t("equipos.filter.year"),
                yearFrom: t("equipos.filter.yearFrom"),
                yearTo: t("equipos.filter.yearTo"),
                all: t("equipos.all"),
                clear: t("equipos.filter.clear"),
              }}
            />
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
