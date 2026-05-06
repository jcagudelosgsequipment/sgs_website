import type { EquipmentCategory } from "@/types/equipment";

type CategoryOption = "All" | EquipmentCategory;

type EquipmentCategoryFilterProps = {
  categories: readonly EquipmentCategory[];
  selectedCategory: CategoryOption;
  onCategoryChange: (category: CategoryOption) => void;
};

export function EquipmentCategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: EquipmentCategoryFilterProps) {
  const options: readonly CategoryOption[] = ["All", ...categories];

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Categories
      </h2>
      <div className="flex flex-wrap gap-2">
        {options.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
}
