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

export interface EquipmentItem {
  manufacturer: string;
  model: string;
  mfgYear: string;
  equipmentType: EquipmentCategory;
  capacity: string;
  photoUrl: string;
  displayName: string;
  isFeatured: boolean;
  addToWebsite: boolean;
}
