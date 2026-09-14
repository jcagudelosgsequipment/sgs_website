import { describe, expect, it } from "vitest";
import { exceedsMaxRentalPeriod } from "../../server/lib/rentalAvailability.js";
import {
  buildRentalInquiryPath,
  exceedsMaxRentalPeriod as exceedsMaxRentalPeriodClient,
  isAvailableStatus,
  isIndefiniteRental,
  isRentedStatus,
  maxEndDateFromStart,
  shouldShowImmediateDelivery,
} from "@/lib/rentalEquipment";

describe("rental period limit", () => {
  it("accepts ranges up to 183 days and rejects longer ones", () => {
    expect(exceedsMaxRentalPeriod("2026-01-01", "2026-07-03")).toBe(false);
    expect(exceedsMaxRentalPeriod("2026-01-01", "2026-07-04")).toBe(true);
    expect(exceedsMaxRentalPeriodClient("2026-01-01", "2026-07-03")).toBe(false);
    expect(exceedsMaxRentalPeriodClient("2026-01-01", "2026-07-04")).toBe(true);
  });

  it("caps the end date 6 months after the start date", () => {
    const maxDate = maxEndDateFromStart(new Date(2026, 2, 14));
    expect(maxDate.getMonth()).toBe(8);
    expect(maxDate.getDate()).toBe(14);
  });
});

describe("rental status badges", () => {
  it("detects rented statuses case-insensitively", () => {
    expect(isRentedStatus("Rented")).toBe(true);
    expect(isRentedStatus("alquilado")).toBe(true);
    expect(isRentedStatus("Available")).toBe(false);
  });

  it("hides immediate delivery unless status is explicitly available", () => {
    expect(shouldShowImmediateDelivery({ status: "Rented" })).toBe(false);
    expect(shouldShowImmediateDelivery({ status: "In Repair" })).toBe(false);
    expect(shouldShowImmediateDelivery({ status: "Available" })).toBe(true);
    expect(shouldShowImmediateDelivery({ status: "Disponible" })).toBe(true);
    expect(
      shouldShowImmediateDelivery(
        { status: "Available" },
        { isAvailableNow: false, availableFrom: "2026-10-01", disabledRanges: [] }
      )
    ).toBe(false);
  });

  it("flags rented equipment without a return date as indefinite", () => {
    expect(isIndefiniteRental({ status: "Rented", returnDate: null })).toBe(true);
    expect(isIndefiniteRental({ status: "Rented", returnDate: "2026-10-01" })).toBe(false);
    expect(
      isIndefiniteRental(
        { status: "Rented", returnDate: "" },
        { isAvailableNow: false, availableFrom: "2026-10-02", disabledRanges: [] }
      )
    ).toBe(false);
    expect(isAvailableStatus("disponible")).toBe(true);
  });

  it("builds a contact inquiry path with id and model", () => {
    expect(
      buildRentalInquiryPath({ id: "1052", model: "TLD-400", displayName: "TLD TLD-400" })
    ).toBe("/contacto?equipmentId=1052&model=TLD-400");
  });
});
