import { useEffect, useMemo, useState } from "react";

import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { EquipmentCategoryFilter } from "@/components/equipment/EquipmentCategoryFilter";
import { fetchEquipment } from "@/services/equipmentService";
import {
  EQUIPMENT_CATEGORIES,
  type EquipmentCategory,
  type EquipmentItem,
} from "@/types/equipment";

type SelectedCategory = "All" | EquipmentCategory;

const Equipos = () => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>("All");
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
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Error loading equipment.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadEquipment();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEquipment = useMemo(() => {
    if (selectedCategory === "All") return equipment;
    return equipment.filter((item) => item.equipmentType === selectedCategory);
  }, [equipment, selectedCategory]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">Equipment Catalog</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Browse our available ground support equipment by category.
          </p>
        </header>

        <EquipmentCategoryFilter
          categories={EQUIPMENT_CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {isLoading ? (
          <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Cargando...
          </p>
        ) : error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
            Error: {error}
          </p>
        ) : filteredEquipment.length === 0 ? (
          <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            No equipment found for this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEquipment.map((item) => (
              <EquipmentCard key={item.displayName} equipment={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Equipos;
