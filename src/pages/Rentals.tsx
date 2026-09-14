import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { EquipmentCategoryFilter } from "@/components/equipment/EquipmentCategoryFilter";
import {
  EMPTY_EQUIPMENT_FILTERS,
  EquipmentFilters,
  type EquipmentFilterValues,
} from "@/components/equipment/EquipmentFilters";
import { RentalQuoteModal } from "@/components/rentals/RentalQuoteModal";
import { fetchEquipment } from "@/services/equipmentService";
import { useRentalAvailability } from "@/hooks/useRentalAvailability";
import { useI18n } from "@/lib/i18n";
import { DEFAULT_RENTAL_AVAILABILITY, getEquipmentAvailability } from "@/lib/rentalAvailability";
import type { EquipmentCategory, EquipmentItem } from "@/types/equipment";

type SelectedCategory = "All" | EquipmentCategory;

const isRentalItem = (item: EquipmentItem) => item.isRental === true;

const parseCategoryParam = (
  value: string | null,
  validCategories: readonly string[]
): SelectedCategory => {
  if (!value) return "All";
  return validCategories.includes(value) ? (value as EquipmentCategory) : "All";
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

const Rentals = () => {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [quoteEquipment, setQuoteEquipment] = useState<EquipmentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { availabilityMap, availabilityError, refreshAvailability } = useRentalAvailability({
    active: quoteEquipment !== null,
  });
  const availabilityWarning = availabilityError ? t("rentals.availability.error") : null;

  const rentalCategories = useMemo(
    () => uniqueSorted(equipment.map((item) => item.equipmentType ?? "")) as EquipmentCategory[],
    [equipment]
  );

  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>(() =>
    parseCategoryParam(searchParams.get("category"), rentalCategories)
  );
  const [filters, setFilters] = useState<EquipmentFilterValues>(() =>
    filtersFromSearchParams(searchParams)
  );

  useEffect(() => {
    let isMounted = true;

    const loadEquipment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const equipmentResult = await fetchEquipment();
        if (!isMounted) return;
        setEquipment(equipmentResult.filter(isRentalItem));
      } catch {
        if (!isMounted) return;
        setError(t("rentals.error"));
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
    setSelectedCategory(parseCategoryParam(searchParams.get("category"), rentalCategories));
    setFilters(filtersFromSearchParams(searchParams));
  }, [searchParams, rentalCategories]);

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
          <h1 className="text-2xl font-bold md:text-3xl">{t("rentals.title")}</h1>
          <p className="text-sm text-muted-foreground md:text-base">{t("rentals.subtitle")}</p>
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
              categories={rentalCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </aside>

          <div className="w-full flex-1">
            {availabilityWarning && !isLoading ? (
              <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700">
                {availabilityWarning}
              </p>
            ) : null}
            {isLoading ? (
              <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                {t("rentals.loading")}
              </p>
            ) : error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
                {error}
              </p>
            ) : filteredEquipment.length === 0 ? (
              <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                {t("rentals.empty")}
              </p>
            ) : (
              <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredEquipment.map((item) => (
                  <EquipmentCard
                    key={String(item.id)}
                    equipment={item}
                    availability={getEquipmentAvailability(availabilityMap, item.title)}
                    onQuoteClick={(item) => {
                      setQuoteEquipment(item);
                      void refreshAvailability();
                    }}
                  />
                ))}
              </div>
            )}
            <RentalQuoteModal
              open={quoteEquipment !== null}
              equipment={quoteEquipment}
              availability={
                quoteEquipment
                  ? getEquipmentAvailability(availabilityMap, quoteEquipment.title)
                  : DEFAULT_RENTAL_AVAILABILITY
              }
              onOpenChange={(open) => {
                if (!open) setQuoteEquipment(null);
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default function RentalsPage() {
  return <Rentals />;
}
