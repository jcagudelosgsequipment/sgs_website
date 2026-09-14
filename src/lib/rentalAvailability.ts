import type { DisabledDateRange, RentalAvailability } from "@/types/equipment";

export const DEFAULT_RENTAL_AVAILABILITY: RentalAvailability = {
  isAvailableNow: true,
  availableFrom: null,
  disabledRanges: [],
};

export function dateToISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isoToLocalDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatReadableDate(iso: string, lang: "es" | "en"): string {
  return isoToLocalDate(iso).toLocaleDateString(lang === "es" ? "es-CO" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function countInclusiveDays(from: Date, to: Date): number {
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  const diff = Math.round((end - start) / 86_400_000);
  return diff + 1;
}

export function selectionOverlapsDisabled(
  fromISO: string,
  toISO: string,
  ranges: DisabledDateRange[]
): boolean {
  return ranges.some((range) => fromISO <= range.to && range.from <= toISO);
}

export function getEquipmentAvailability(
  map: Record<string, RentalAvailability>,
  workOrder?: string
): RentalAvailability {
  if (!workOrder) return DEFAULT_RENTAL_AVAILABILITY;
  return map[workOrder] ?? DEFAULT_RENTAL_AVAILABILITY;
}
