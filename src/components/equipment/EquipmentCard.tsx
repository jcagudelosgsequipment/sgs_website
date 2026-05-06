import type { EquipmentItem } from "@/types/equipment";

type EquipmentCardProps = {
  equipment: EquipmentItem;
};

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      <div className="aspect-[16/10] w-full bg-muted">
        {equipment.photoUrl ? (
          <img
            src={equipment.photoUrl}
            alt={equipment.displayName}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          {equipment.equipmentType}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold md:text-base">{equipment.displayName}</h3>
        <p className="text-sm text-muted-foreground">Capacity: {equipment.capacity || "N/A"}</p>
      </div>
    </article>
  );
}
