import { describe, expect, it } from "vitest";
import {
  addDaysISO,
  buildAvailabilityMap,
  computeAvailabilityForBookings,
  mergeRanges,
  rangesOverlap,
} from "../../server/lib/rentalAvailability.js";

const TODAY = "2026-09-01";

describe("rentalAvailability", () => {
  it("treats equipment without bookings as available", () => {
    expect(computeAvailabilityForBookings([], TODAY)).toEqual({
      isAvailableNow: true,
      availableFrom: null,
      disabledRanges: [],
    });
  });

  it("marks current rentals as unavailable and sets availableFrom to EndDate + 1", () => {
    const result = computeAvailabilityForBookings(
      [{ startDate: "2026-08-20", endDate: "2026-09-14", bookingStatus: "En Alquiler" }],
      TODAY
    );

    expect(result.isAvailableNow).toBe(false);
    expect(result.availableFrom).toBe("2026-09-15");
    expect(result.disabledRanges).toEqual([{ from: "2026-08-20", to: "2026-09-14" }]);
  });

  it("does not block dates for Pendiente bookings", () => {
    const result = computeAvailabilityForBookings(
      [{ startDate: "2026-09-16", endDate: "2026-09-19", bookingStatus: "Pendiente" }],
      TODAY
    );

    expect(result.isAvailableNow).toBe(true);
    expect(result.availableFrom).toBeNull();
    expect(result.disabledRanges).toEqual([]);
  });

  it("ignores Finalizado, Pendiente, and past ranges", () => {
    const result = computeAvailabilityForBookings(
      [
        { startDate: "2026-08-01", endDate: "2026-09-10", bookingStatus: "Finalizado" },
        { startDate: "2026-07-01", endDate: "2026-08-31", bookingStatus: "Confirmado" },
        { startDate: "2026-10-01", endDate: "2026-10-05", bookingStatus: "Confirmado" },
      ],
      TODAY
    );

    expect(result.isAvailableNow).toBe(true);
    expect(result.availableFrom).toBeNull();
    expect(result.disabledRanges).toEqual([{ from: "2026-10-01", to: "2026-10-05" }]);
  });

  it("merges overlapping and consecutive ranges", () => {
    expect(
      mergeRanges([
        { from: "2026-09-01", to: "2026-09-05" },
        { from: "2026-09-06", to: "2026-09-10" },
        { from: "2026-09-08", to: "2026-09-12" },
      ])
    ).toEqual([{ from: "2026-09-01", to: "2026-09-12" }]);
  });

  it("groups Graph-like bookings by work order", () => {
    const map = buildAvailabilityMap(
      [
        { workOrder: "WO-1052", startDate: "2026-09-01T00:00:00Z", endDate: "2026-09-14", bookingStatus: "En Alquiler" },
        { workOrder: "WO-1052", startDate: "2026-10-01", endDate: "2026-10-03", bookingStatus: "Pendiente" },
        { workOrder: "WO-1052", startDate: "2026-11-01", endDate: "2026-11-03", bookingStatus: "Confirmado" },
        { workOrder: "WO-2001", startDate: "2026-08-01", endDate: "2026-08-10", bookingStatus: "Confirmado" },
      ],
      TODAY
    );

    expect(map["WO-1052"].isAvailableNow).toBe(false);
    expect(map["WO-1052"].availableFrom).toBe("2026-09-15");
    expect(map["WO-1052"].disabledRanges).toEqual([
      { from: "2026-09-01", to: "2026-09-14" },
      { from: "2026-11-01", to: "2026-11-03" },
    ]);
    expect(map["WO-2001"]).toEqual({
      isAvailableNow: true,
      availableFrom: null,
      disabledRanges: [],
    });
  });

  it("detects overlapping quote ranges", () => {
    expect(
      rangesOverlap({ from: "2026-09-10", to: "2026-09-20" }, { from: "2026-09-15", to: "2026-09-16" })
    ).toBe(true);
    expect(
      rangesOverlap({ from: "2026-09-10", to: "2026-09-12" }, { from: "2026-09-13", to: "2026-09-16" })
    ).toBe(false);
  });

  it("adds days in ISO without timezone drift", () => {
    expect(addDaysISO("2026-09-14", 1)).toBe("2026-09-15");
    expect(addDaysISO("2026-12-31", 1)).toBe("2027-01-01");
  });
});
