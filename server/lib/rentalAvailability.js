const BLOCKING_STATUSES = new Set(["confirmado", "confirmed", "enalquiler", "inrental"]);

function normalizeStatus(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function isBlockingStatus(value) {
  return BLOCKING_STATUSES.has(normalizeStatus(value));
}

export const DEFAULT_RENTAL_AVAILABILITY = {
  isAvailableNow: true,
  availableFrom: null,
  disabledRanges: [],
};

export const MAX_RENTAL_DURATION_MS = 183 * 24 * 60 * 60 * 1000;

export function exceedsMaxRentalPeriod(startDate, endDate) {
  return new Date(endDate) - new Date(startDate) > MAX_RENTAL_DURATION_MS;
}

export function todayISODate(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toISODate(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const match = String(value).trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

export function addDaysISO(iso, days) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function rangesOverlap(a, b) {
  return a.from <= b.to && b.from <= a.to;
}

export function mergeRanges(ranges) {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort(
    (a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to)
  );
  const merged = [{ from: sorted[0].from, to: sorted[0].to }];

  for (let i = 1; i < sorted.length; i += 1) {
    const last = merged[merged.length - 1];
    const current = sorted[i];
    if (current.from <= addDaysISO(last.to, 1)) {
      if (current.to > last.to) last.to = current.to;
    } else {
      merged.push({ from: current.from, to: current.to });
    }
  }

  return merged;
}

export function computeAvailabilityForBookings(bookings, today = todayISODate()) {
  const activeRanges = [];

  for (const booking of bookings) {
    if (!isBlockingStatus(booking.bookingStatus)) continue;

    const from = toISODate(booking.startDate);
    const to = toISODate(booking.endDate);
    if (!from || !to || to < from || to < today) continue;

    activeRanges.push({ from, to });
  }

  const disabledRanges = mergeRanges(activeRanges);
  const currentBlock = disabledRanges.find((range) => range.from <= today && today <= range.to);

  return {
    isAvailableNow: !currentBlock,
    availableFrom: currentBlock ? addDaysISO(currentBlock.to, 1) : null,
    disabledRanges,
  };
}

export function buildAvailabilityMap(bookings, today = todayISODate()) {
  const grouped = new Map();

  for (const booking of bookings) {
    const workOrder = String(booking.workOrder ?? "").trim();
    if (!workOrder) continue;
    const list = grouped.get(workOrder);
    if (list) list.push(booking);
    else grouped.set(workOrder, [booking]);
  }

  /** @type {Record<string, ReturnType<typeof computeAvailabilityForBookings>>} */
  const map = {};
  for (const [workOrder, list] of grouped.entries()) {
    map[workOrder] = computeAvailabilityForBookings(list, today);
  }
  return map;
}
