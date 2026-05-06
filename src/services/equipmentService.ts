import type { EquipmentItem } from "@/types/equipment";

// MOCK TEMPORAL PARA PRUEBAS DE UI
export async function fetchEquipment(): Promise<EquipmentItem[]> {
  // Simulamos un retraso de red de medio segundo
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      manufacturer: 'Tug',
      model: 'GT-35',
      mfgYear: '2018',
      equipmentType: 'Baggage Tractor',
      capacity: '4,000 lbs',
      photoUrl: 'https://via.placeholder.com/400x300?text=Baggage+Tractor',
      displayName: 'Tug-GT-35 Diesel Baggage Tractor - WO-1024',
      isFeatured: true,
      addToWebsite: true
    },
    {
      manufacturer: 'TLD',
      model: 'GPU-4120',
      mfgYear: '2020',
      equipmentType: 'AC GPU',
      capacity: '120 kVA',
      photoUrl: 'https://via.placeholder.com/400x300?text=AC+GPU',
      displayName: 'TLD-GPU-4120 Electric AC GPU - WO-1025',
      isFeatured: true,
      addToWebsite: true
    },
    {
      manufacturer: 'Lektro',
      model: '8750',
      mfgYear: '2021',
      equipmentType: 'Lektro',
      capacity: '80,000 lbs',
      photoUrl: 'https://via.placeholder.com/400x300?text=Lektro',
      displayName: 'Lektro-8750 Electric Lektro - WO-1026',
      isFeatured: false,
      addToWebsite: true
    }
  ] as EquipmentItem[];
}

export async function fetchFeaturedEquipment(): Promise<EquipmentItem[]> {
  const data = await fetchEquipment();
  return data.filter((item) => item.isFeatured).slice(0, 5);
}