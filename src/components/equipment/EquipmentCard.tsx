import { Link } from "react-router-dom";

import { RentalAvailabilityBadge } from "@/components/rentals/RentalAvailabilityBadge";
import type { EquipmentItem, RentalAvailability } from "@/types/equipment";
import { useI18n } from "@/lib/i18n";
import { buildRentalInquiryPath, isIndefiniteRental } from "@/lib/rentalEquipment";

type EquipmentCardProps = {
  equipment: EquipmentItem;
  detailPath?: string;
  availability?: RentalAvailability;
  onQuoteClick?: (equipment: EquipmentItem) => void;
};

export function EquipmentCard({
  equipment,
  detailPath,
  availability,
  onQuoteClick,
}: EquipmentCardProps) {
  const { t, translateCategory } = useI18n();
  const path = detailPath ?? `/equipos/${equipment.id}`;
  const isRentalCard = Boolean(onQuoteClick);
  const showAvailability = Boolean(availability) || equipment.isRental;
  const longTerm = isIndefiniteRental(equipment, availability);

  const body = (
    <>
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

      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="inline-flex w-fit rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          {translateCategory(equipment.equipmentType)}
        </span>

        <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold md:min-h-[3rem] md:text-base">
          {equipment.displayName}
        </h3>

        <p className="text-sm text-muted-foreground">
          {t("equipos.card.capacity")}: {equipment.capacity || "N/A"}
        </p>

        {isRentalCard || showAvailability ? (
          <div className="mt-auto flex min-h-[2.5rem] items-center">
            {showAvailability ? (
              <RentalAvailabilityBadge equipment={equipment} availability={availability} />
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );

  if (!isRentalCard) {
    return (
      <Link to={path} className="flex h-full transition hover:opacity-[0.98]">
        <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          {body}
        </article>
      </Link>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition hover:opacity-[0.98]">
      <Link to={path} className="flex flex-1 flex-col">
        {body}
      </Link>
      <div className="mt-auto px-4 pb-4">
        {longTerm ? (
          <Link
            to={buildRentalInquiryPath(equipment)}
            className="inline-flex h-10 w-full items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10 px-4 text-sm font-bold text-amber-800 transition hover:bg-amber-500/20"
          >
            {t("rentals.card.inquire")}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onQuoteClick?.(equipment)}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#FF5500] px-4 text-sm font-bold text-white transition hover:bg-[#e64d00]"
          >
            {t("rentals.card.cta")}
          </button>
        )}
      </div>
    </article>
  );
}
