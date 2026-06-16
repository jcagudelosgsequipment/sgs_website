import { Link } from "react-router-dom";

import type { EquipmentItem } from "@/types/equipment";

import { useI18n } from "@/lib/i18n";



type EquipmentCardProps = {

  equipment: EquipmentItem;

};



export function EquipmentCard({ equipment }: EquipmentCardProps) {

  const { t, translateCategory } = useI18n();



  return (

    <Link to={`/equipos/${equipment.id}`} className="block transition hover:opacity-[0.98]">

      <article className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">

        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">

          {equipment.photoUrl ? (

            <img

              src={equipment.photoUrl}

              alt={equipment.displayName}

              className="h-full w-full object-cover"

              loading="lazy"

            />

          ) : (

            <div className="flex h-full min-h-[12rem] items-center justify-center text-sm text-muted-foreground">

              {t("equipos.card.noImage")}

            </div>

          )}

        </div>

        <div className="space-y-3 p-4">

          <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">

            {translateCategory(equipment.equipmentType)}

          </span>

          <h3 className="line-clamp-2 text-sm font-semibold md:text-base">{equipment.displayName}</h3>

          <p className="text-sm text-muted-foreground">

            {t("equipos.card.capacity")}: {equipment.capacity || "N/A"}

          </p>

        </div>

      </article>

    </Link>

  );

}

