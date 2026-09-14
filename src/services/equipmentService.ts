import type { EquipmentItem, RentalAvailabilityMap } from "@/types/equipment";

export async function fetchEquipment(): Promise<EquipmentItem[]> {
  const response = await fetch("/api/equipment", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch equipment: ${response.status}`);
  }
  return (await response.json()) as EquipmentItem[];
}

export async function fetchFeaturedEquipment(): Promise<EquipmentItem[]> {
  const data = await fetchEquipment();
  return data.filter((item) => item.isFeatured).slice(0, 5);
}

export async function fetchRentalAvailability(): Promise<RentalAvailabilityMap> {
  const response = await fetch("/api/rentals/availability", {
    method: "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch rental availability: ${response.status}`);
  }

  return (await response.json()) as RentalAvailabilityMap;
}

