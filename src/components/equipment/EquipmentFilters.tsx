export type EquipmentFilterValues = {
  search: string;
  fuelType: string;
  capacity: string;
  manufacturer: string;
  yearMin: string;
  yearMax: string;
};

type EquipmentFiltersProps = {
  values: EquipmentFilterValues;
  fuelOptions: readonly string[];
  capacityOptions: readonly string[];
  manufacturerOptions: readonly string[];
  yearOptions: readonly number[];
  onChange: (next: Partial<EquipmentFilterValues>) => void;
  onClear: () => void;
  labels: {
    title: string;
    search: string;
    searchPlaceholder: string;
    fuelType: string;
    capacity: string;
    manufacturer: string;
    year: string;
    yearFrom: string;
    yearTo: string;
    all: string;
    clear: string;
  };
};

const selectClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200";

export function EquipmentFilters({
  values,
  fuelOptions,
  capacityOptions,
  manufacturerOptions,
  yearOptions,
  onChange,
  onClear,
  labels,
}: EquipmentFiltersProps) {
  const hasActiveFilters =
    values.search.trim() !== "" ||
    values.fuelType !== "" ||
    values.capacity !== "" ||
    values.manufacturer !== "" ||
    values.yearMin !== "" ||
    values.yearMax !== "";

  return (
    <div className="space-y-4" aria-label={labels.title}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {labels.title}
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-accent hover:underline"
          >
            {labels.clear}
          </button>
        )}
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-500">{labels.search}</span>
        <input
          type="search"
          value={values.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder={labels.searchPlaceholder}
          className={selectClassName}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-500">{labels.fuelType}</span>
        <select
          value={values.fuelType}
          onChange={(e) => onChange({ fuelType: e.target.value })}
          className={selectClassName}
        >
          <option value="">{labels.all}</option>
          {fuelOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-500">{labels.capacity}</span>
        <select
          value={values.capacity}
          onChange={(e) => onChange({ capacity: e.target.value })}
          className={selectClassName}
        >
          <option value="">{labels.all}</option>
          {capacityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold text-slate-500">{labels.manufacturer}</span>
        <select
          value={values.manufacturer}
          onChange={(e) => onChange({ manufacturer: e.target.value })}
          className={selectClassName}
        >
          <option value="">{labels.all}</option>
          {manufacturerOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="space-y-1.5">
        <legend className="text-xs font-semibold text-slate-500">{labels.year}</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="block space-y-1">
            <span className="sr-only">{labels.yearFrom}</span>
            <select
              value={values.yearMin}
              onChange={(e) => onChange({ yearMin: e.target.value })}
              className={selectClassName}
              aria-label={labels.yearFrom}
            >
              <option value="">{labels.yearFrom}</option>
              {yearOptions.map((year) => (
                <option key={`min-${year}`} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="sr-only">{labels.yearTo}</span>
            <select
              value={values.yearMax}
              onChange={(e) => onChange({ yearMax: e.target.value })}
              className={selectClassName}
              aria-label={labels.yearTo}
            >
              <option value="">{labels.yearTo}</option>
              {yearOptions.map((year) => (
                <option key={`max-${year}`} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>
    </div>
  );
}

export const EMPTY_EQUIPMENT_FILTERS: EquipmentFilterValues = {
  search: "",
  fuelType: "",
  capacity: "",
  manufacturer: "",
  yearMin: "",
  yearMax: "",
};
