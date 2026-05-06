import type { EquipmentItem } from "@/types/equipment";

export async function fetchFeaturedEquipment(): Promise<EquipmentItem[]> {
  const response = await fetch("/api/equipment", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch equipment: ${response.status}`);
  }

  const data = (await response.json()) as EquipmentItem[];
  return data.filter((item) => item.isFeatured).slice(0, 5);
}
