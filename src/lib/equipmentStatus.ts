export type EquipmentStatusTone = "red" | "orange" | "green" | "neutral";

const RED_STATUSES = [
  "rentado",
  "rented",
  "vendido",
  "sold",
  "reservado para venta",
  "reserved for sale",
  "reserved for a sale",
] as const;

const ORANGE_STATUSES = ["in repair", "inspected"] as const;

const GREEN_STATUSES = [
  "disponible para venta",
  "available for sale",
] as const;

function matchesStatus(normalized: string, options: readonly string[]): boolean {
  return options.some(
    (option) => normalized === option || normalized.includes(option)
  );
}

function getSingleStatusTone(status: string): EquipmentStatusTone {
  const normalized = status.trim().toLowerCase();
  if (!normalized) return "neutral";
  if (matchesStatus(normalized, RED_STATUSES)) return "red";
  if (matchesStatus(normalized, ORANGE_STATUSES)) return "orange";
  if (matchesStatus(normalized, GREEN_STATUSES)) return "green";
  return "neutral";
}
/** SharePoint choice/lookup fields may arrive as string, number, object, or array. */
export function parseEquipmentStatuses(status: unknown): string[] {
  if (status == null) return [];

  if (Array.isArray(status)) {
    return status.flatMap((item) => parseEquipmentStatuses(item));
  }

  if (typeof status === "object") {
    const record = status as Record<string, unknown>;
    if (Array.isArray(record.results)) {
      return record.results.flatMap((item) => parseEquipmentStatuses(item));
    }
    for (const key of ["Label", "Value", "lookupValue", "DisplayName"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return [value.trim()];
    }
    return [];
  }

  if (typeof status === "string") {
    const trimmed = status.trim();
    if (!trimmed) return [];
    if (trimmed.includes(",")) {
      return trimmed
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);
    }
    if (trimmed.includes(";")) {
      return trimmed
        .split(";")
        .map((part) => part.trim())
        .filter(Boolean);
    }
    return [trimmed];
  }

  if (typeof status === "number" || typeof status === "boolean") {
    return [String(status).trim()];
  }

  return [];
}

export function formatEquipmentStatus(status: unknown): string {
  return parseEquipmentStatuses(status).join(", ");
}

function tonePriority(tone: EquipmentStatusTone): number {
  if (tone === "red") return 3;
  if (tone === "orange") return 2;
  if (tone === "green") return 1;
  return 0;
}

export function getEquipmentStatusTone(status?: unknown): EquipmentStatusTone {  const statuses = parseEquipmentStatuses(status);
  if (statuses.length === 0) return "neutral";

  return statuses
    .map((item) => getSingleStatusTone(item))
    .sort((a, b) => tonePriority(b) - tonePriority(a))[0];
}

export function getStatusToneForLabel(status: string): EquipmentStatusTone {
  return getSingleStatusTone(status);
}

export const STATUS_TONE_CLASSES: Record<EquipmentStatusTone, string> = {
  red: "border-red-200 bg-red-50 text-red-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  green: "border-green-200 bg-green-50 text-green-700",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
};
