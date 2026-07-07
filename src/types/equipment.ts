export type EquipmentCategory =
  | "Belt Loader"
  | "AC GPU"
  | "DC GPU"
  | "AC/DC GPU"
  | "Baggage Tractor"
  | "Passenger Stair"
  | "Cargo Loader"
  | "Air Conditioner (ACU)"
  | "Air Start (ASU)"
  | "Push Back Tractor"
  | "Towbar"
  | "Aerial Equipment"
  | "Lavatory"
  | "Water Service"
  | "Dollies"
  | "Baggage Carts"
  | "Lektro"
  | "Scissor Lift";

export const EQUIPMENT_CATEGORIES: readonly EquipmentCategory[] = [
  "Belt Loader",
  "AC GPU",
  "DC GPU",
  "AC/DC GPU",
  "Baggage Tractor",
  "Passenger Stair",
  "Cargo Loader",
  "Air Conditioner (ACU)",
  "Air Start (ASU)",
  "Push Back Tractor",
  "Towbar",
  "Aerial Equipment",
  "Lavatory",
  "Water Service",
  "Dollies",
  "Baggage Carts",
  "Lektro",
  "Scissor Lift",
];

export interface EquipmentItem {
  id: string | number;
  /** Work order (SharePoint Title); used for gallery folder key */
  title?: string;
  manufacturer: string;
  model: string;
  mfgYear?: string;
  status?: string;
  equipmentType: string;
  capacity: string;
  fuelType?: string;
  photoUrl: string;
  displayName: string;
  isFeatured: boolean;
  description?: string;
  addToWebsite?: boolean;
}
