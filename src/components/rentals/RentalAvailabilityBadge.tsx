import { useI18n } from "@/lib/i18n";
import { formatReadableDate } from "@/lib/rentalAvailability";
import {
  isIndefiniteRental,
  isRentedStatus,
  resolveReturnDate,
  shouldShowImmediateDelivery,
} from "@/lib/rentalEquipment";
import type { EquipmentItem, RentalAvailability } from "@/types/equipment";

type RentalAvailabilityBadgeProps = {
  equipment: EquipmentItem;
  availability?: RentalAvailability;
};

export function RentalAvailabilityBadge({
  equipment,
  availability,
}: RentalAvailabilityBadgeProps) {
  const { t, lang } = useI18n();

  if (isIndefiniteRental(equipment, availability)) {
    return (
      <span className="inline-flex rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
        {t("rentals.availability.longTerm")}
      </span>
    );
  }

  if (shouldShowImmediateDelivery(equipment, availability)) {
    return (
      <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
        {t("rentals.availability.available")}
      </span>
    );
  }

  const returnDate = resolveReturnDate(equipment, availability);
  const showOnRent =
    Boolean(returnDate) &&
    (isRentedStatus(equipment.status) || Boolean(availability && !availability.isAvailableNow));

  if (!showOnRent || !returnDate) return null;

  return (
    <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
      {t("rentals.availability.rented", { date: formatReadableDate(returnDate, lang) })}
    </span>
  );
}
