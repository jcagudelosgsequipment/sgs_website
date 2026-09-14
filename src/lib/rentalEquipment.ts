import { parseEquipmentStatuses } from "@/lib/equipmentStatus";
import type { EquipmentItem, RentalAvailability } from "@/types/equipment";

export const MAX_RENTAL_DURATION_MS = 183 * 24 * 60 * 60 * 1000;

const RENTED_LABELS = ["rented", "alquilado", "rentado", "en renta", "en alquiler", "on rent"] as const;
const AVAILABLE_LABELS = ["available", "disponible"] as const;

function normalizeStatusLabel(status: string): string {
  return status.trim().toLowerCase();
}

export function exceedsMaxRentalPeriod(start: Date | string, end: Date | string): boolean {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return true;
  return endMs - startMs > MAX_RENTAL_DURATION_MS;
}

export function maxEndDateFromStart(startDate: Date): Date {
  const maxDate = new Date(startDate);
  maxDate.setMonth(maxDate.getMonth() + 6);
  return maxDate;
}

export function isRentedStatus(status?: unknown): boolean {
  return parseEquipmentStatuses(status).some((label) => {
    const normalized = normalizeStatusLabel(label);
    if (normalized === "rented") return true;
    return RENTED_LABELS.some((option) => normalized === option || normalized.includes(option));
  });
}

export function isAvailableStatus(status?: unknown): boolean {
  return parseEquipmentStatuses(status).some((label) => {
    const normalized = normalizeStatusLabel(label);
    return AVAILABLE_LABELS.some((option) => normalized === option || normalized.startsWith(option));
  });
}

export function resolveReturnDate(
  equipment: Pick<EquipmentItem, "returnDate">,
  availability?: RentalAvailability
): string | null {
  const fromEquipment = equipment.returnDate?.trim() ?? "";
  if (fromEquipment) return fromEquipment;
  const fromAvailability = availability?.availableFrom?.trim() ?? "";
  return fromAvailability || null;
}

export function isIndefiniteRental(
  equipment: Pick<EquipmentItem, "status" | "returnDate">,
  availability?: RentalAvailability
): boolean {
  if (!isRentedStatus(equipment.status)) return false;
  return !resolveReturnDate(equipment, availability);
}

export function shouldShowImmediateDelivery(
  equipment: Pick<EquipmentItem, "status">,
  availability?: RentalAvailability
): boolean {
  if (isRentedStatus(equipment.status)) return false;
  if (!isAvailableStatus(equipment.status)) return false;
  if (availability && !availability.isAvailableNow) return false;
  return true;
}

export function buildRentalInquiryPath(
  equipment: Pick<EquipmentItem, "id" | "model" | "displayName">
): string {
  const params = new URLSearchParams({
    equipmentId: String(equipment.id).slice(0, 80),
    model: String(equipment.model || equipment.displayName || "").slice(0, 120),
  });
  return `/contacto?${params.toString()}`;
}
