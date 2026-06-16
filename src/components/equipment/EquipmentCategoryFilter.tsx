import type { EquipmentCategory } from "@/types/equipment";

import { useI18n } from "@/lib/i18n";



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

  const { t, translateCategory } = useI18n();

  const options: readonly CategoryOption[] = ["All", ...categories];



  return (

    <nav aria-label={t("equipos.categories")}>

      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">

        {t("equipos.categories")}

      </h2>

      <ul className="space-y-2">

        {options.map((category) => {

          const active = selectedCategory === category;

          const label = category === "All" ? t("equipos.all") : translateCategory(category);

          return (

            <li key={category}>

              <button

                type="button"

                onClick={() => onCategoryChange(category)}

                className={`flex w-full items-center justify-start rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${

                  active

                    ? "border-transparent bg-accent font-bold text-accent-foreground shadow-sm"

                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"

                }`}

              >

                {label}

              </button>

            </li>

          );

        })}

      </ul>

    </nav>

  );

}

