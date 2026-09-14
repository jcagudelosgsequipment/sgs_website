import { useCallback, useEffect, useRef, useState } from "react";

import { fetchRentalAvailability } from "@/services/equipmentService";
import type { RentalAvailabilityMap } from "@/types/equipment";

const PAGE_POLL_MS = 10_000;
const ACTIVE_POLL_MS = 5_000;

type UseRentalAvailabilityOptions = {
  enabled?: boolean;
  active?: boolean;
};

export function useRentalAvailability({
  enabled = true,
  active = false,
}: UseRentalAvailabilityOptions = {}) {
  const [availabilityMap, setAvailabilityMap] = useState<RentalAvailabilityMap>({});
  const [availabilityError, setAvailabilityError] = useState(false);
  const inFlightRef = useRef(false);

  const refreshAvailability = useCallback(async () => {
    if (!enabled || inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const next = await fetchRentalAvailability();
      setAvailabilityMap(next);
      setAvailabilityError(false);
    } catch {
      setAvailabilityError(true);
    } finally {
      inFlightRef.current = false;
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    void refreshAvailability();
  }, [enabled, refreshAvailability]);

  useEffect(() => {
    if (!enabled) return;
    const intervalMs = active ? ACTIVE_POLL_MS : PAGE_POLL_MS;
    const timer = window.setInterval(() => {
      void refreshAvailability();
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [active, enabled, refreshAvailability]);

  useEffect(() => {
    if (!enabled) return;

    const onVisible = () => {
      if (document.visibilityState === "visible") void refreshAvailability();
    };

    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, refreshAvailability]);

  return { availabilityMap, availabilityError, refreshAvailability };
}
