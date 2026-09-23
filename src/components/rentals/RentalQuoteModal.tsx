import { FormEvent, useMemo, useRef, useState } from "react";
import { RentalInquiryLink } from "@/components/rentals/RentalInquiryLink";
import ReCAPTCHA from "react-google-recaptcha";
import type { DateRange } from "react-day-picker";
import { Loader2 } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  countInclusiveDays,
  dateToISODate,
  formatReadableDate,
  isoToLocalDate,
  selectionOverlapsDisabled,
} from "@/lib/rentalAvailability";
import {
  exceedsMaxRentalPeriod,
  isIndefiniteRental,
  maxEndDateFromStart,
} from "@/lib/rentalEquipment";
import { cn } from "@/lib/utils";
import type { EquipmentItem, RentalAvailability } from "@/types/equipment";

type ContactForm = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  comments: string;
};

const EMPTY_FORM: ContactForm = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  address: "",
  comments: "",
};

type RentalQuoteModalProps = {
  open: boolean;
  equipment: EquipmentItem | null;
  availability: RentalAvailability;
  onOpenChange: (open: boolean) => void;
};

function RentalQuoteForm({
  equipment,
  availability,
  onOpenChange,
}: {
  equipment: EquipmentItem;
  availability: RentalAvailability;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const datesLocked = isIndefiniteRental(equipment, availability);
  const startISO = range?.from ? dateToISODate(range.from) : "";
  const endISO = range?.to ? dateToISODate(range.to) : "";
  const maxDate = useMemo(
    () => (range?.from ? maxEndDateFromStart(range.from) : undefined),
    [range?.from]
  );
  const maxEndISO = maxDate ? maxDate.toISOString().split("T")[0] : undefined;
  const hasCompleteRange = Boolean(range?.from && range?.to);
  const totalDays = hasCompleteRange ? countInclusiveDays(range!.from!, range!.to!) : 0;
  const exceedsMaxPeriod =
    hasCompleteRange && exceedsMaxRentalPeriod(range!.from!, range!.to!);
  const overlapsBlocked =
    hasCompleteRange && selectionOverlapsDisabled(startISO, endISO, availability.disabledRanges);

  const disabledMatchers = useMemo(
    () => [
      { before: today },
      ...(maxDate ? [{ after: maxDate }] : []),
      ...availability.disabledRanges.map((blocked) => ({
        from: isoToLocalDate(blocked.from),
        to: isoToLocalDate(blocked.to),
      })),
    ],
    [availability.disabledRanges, maxDate, today]
  );

  const canSubmit =
    !datesLocked &&
    hasCompleteRange &&
    !overlapsBlocked &&
    !exceedsMaxPeriod &&
    form.fullName.trim() &&
    form.email.trim() &&
    form.company.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    Boolean(recaptchaToken) &&
    !submitting;

  const handleStartDateChange = (value: string) => {
    if (!value) {
      setRange(undefined);
      return;
    }
    const startDate = isoToLocalDate(value);
    const nextMax = maxEndDateFromStart(startDate);
    const endDate = range?.to && range.to >= startDate && range.to <= nextMax ? range.to : undefined;
    setRange({ from: startDate, to: endDate });
  };

  const handleEndDateChange = (value: string) => {
    if (!range?.from) return;
    if (!value) {
      setRange({ from: range.from, to: undefined });
      return;
    }
    setRange({ from: range.from, to: isoToLocalDate(value) });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (datesLocked || !equipment || !canSubmit || !recaptchaToken) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/rentals/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recaptchaToken,
          b_website_hp: honeypot,
          customer: {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            company: form.company.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            comments: form.comments.trim(),
            startDate: startISO,
            endDate: endISO,
          },
          equipment: {
            id: equipment.id,
            title: equipment.title,
            manufacturer: equipment.manufacturer,
            model: equipment.model,
            equipmentType: equipment.equipmentType,
            displayName: equipment.displayName,
            photoUrl: equipment.photoUrl,
          },
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        orderId?: number | string;
      } | null;

      if (!response.ok) {
        throw new Error(data?.error ?? t("rentals.quote.error"));
      }

      setOrderId(data?.orderId != null && data.orderId !== "" ? String(data.orderId) : null);
      setSuccess(true);
      setForm(EMPTY_FORM);
      setRange(undefined);
      setHoneypot("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("rentals.quote.error"));
    } finally {
      setSubmitting(false);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 py-4 text-center">
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {t("rentals.quote.success")}
        </p>
        {orderId ? (
          <p className="text-3xl font-bold tracking-wide text-white">
            {t("rentals.quote.orderId", { orderId })}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="border-white/20 bg-transparent text-white hover:bg-white/10"
        >
          {t("rentals.quote.close")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5500]">
          {t("rentals.quote.calendar")}
        </p>
        {datesLocked ? (
          <div className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
            <p>{t("rentals.quote.longTermHint")}</p>
            <Button asChild className="bg-[#FF5500] text-white hover:bg-[#e64d00]">
              <RentalInquiryLink equipment={equipment} onClick={() => onOpenChange(false)}>
                {t("rentals.card.inquire")}
              </RentalInquiryLink>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="rental-start-date" className="text-zinc-300">
                  {t("rentals.quote.startDate")} *
                </Label>
                <Input
                  id="rental-start-date"
                  type="date"
                  required
                  min={dateToISODate(today)}
                  value={startISO}
                  onChange={(event) => handleStartDateChange(event.target.value)}
                  className="border-white/15 bg-[#060b19] text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rental-end-date" className="text-zinc-300">
                  {t("rentals.quote.endDate")} *
                </Label>
                <Input
                  id="rental-end-date"
                  type="date"
                  required
                  min={startISO || dateToISODate(today)}
                  max={maxEndISO}
                  disabled={!startISO}
                  value={endISO}
                  onChange={(event) => handleEndDateChange(event.target.value)}
                  className="border-white/15 bg-[#060b19] text-white disabled:opacity-50"
                />
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#060b19] p-2">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
                disabled={disabledMatchers}
                defaultMonth={today}
                className="text-white"
                classNames={{
                  day_selected:
                    "bg-[#FF5500] text-white hover:bg-[#FF5500] hover:text-white focus:bg-[#FF5500] focus:text-white",
                  day_range_middle: "aria-selected:bg-[#FF5500]/25 aria-selected:text-white",
                  day_today: "border border-[#FF5500] text-[#FF5500]",
                  day_disabled: "text-zinc-600 opacity-40 line-through",
                  nav_button: "border-white/15 bg-transparent text-white hover:bg-white/10",
                  caption_label: "text-white",
                  head_cell: "text-zinc-400",
                  day: "h-9 w-9 p-0 font-normal text-zinc-100 hover:bg-white/10 aria-selected:opacity-100",
                }}
              />
            </div>
            {availability.disabledRanges.length > 0 && (
              <p className="text-xs text-zinc-400">{t("rentals.quote.blockedHint")}</p>
            )}
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
              {hasCompleteRange ? (
                <p>{t("rentals.quote.days", { count: String(totalDays) })}</p>
              ) : (
                <p className="text-zinc-400">{t("rentals.quote.selectRange")}</p>
              )}
            </div>
            {exceedsMaxPeriod && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400">
                {t("rentals.quote.maxPeriod")}
              </p>
            )}
            {overlapsBlocked && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400">
                {t("rentals.quote.overlap")}
              </p>
            )}
          </>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FF5500]">
          {t("rentals.quote.contact")}
        </p>
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="rental-name" className="text-zinc-300">
              {t("rentals.quote.name")} *
            </Label>
            <Input
              id="rental-name"
              required
              maxLength={120}
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              className="border-white/15 bg-[#060b19] text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rental-email" className="text-zinc-300">
              {t("rentals.quote.email")} *
            </Label>
            <Input
              id="rental-email"
              type="email"
              required
              maxLength={254}
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="border-white/15 bg-[#060b19] text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rental-company" className="text-zinc-300">
              {t("rentals.quote.company")} *
            </Label>
            <Input
              id="rental-company"
              required
              maxLength={120}
              value={form.company}
              onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
              className="border-white/15 bg-[#060b19] text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rental-phone" className="text-zinc-300">
              {t("rentals.quote.phone")} *
            </Label>
            <Input
              id="rental-phone"
              type="tel"
              required
              maxLength={40}
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="border-white/15 bg-[#060b19] text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rental-address" className="text-zinc-300">
              {t("rentals.quote.address")} *
            </Label>
            <Textarea
              id="rental-address"
              required
              maxLength={300}
              rows={2}
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              className="border-white/15 bg-[#060b19] text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rental-comments" className="text-zinc-300">
              {t("rentals.quote.comments")}
            </Label>
            <Textarea
              id="rental-comments"
              maxLength={2000}
              rows={3}
              value={form.comments}
              onChange={(event) => setForm((prev) => ({ ...prev, comments: event.target.value }))}
              className="border-white/15 bg-[#060b19] text-white"
            />
          </div>
        </div>

        <div className="rounded-lg border border-[#FF5500]/30 bg-[#FF5500]/10 px-3 py-2 text-sm text-zinc-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#FF5500]">
            {t("rentals.quote.summary")}
          </p>
          <p className="mt-1">{equipment?.displayName}</p>
          <p className="text-xs text-zinc-400">WO: {equipment?.title}</p>
          <p className="mt-2">
            {t("rentals.quote.startDate")}:{" "}
            {startISO ? formatReadableDate(startISO, "en") : "—"}
          </p>
          <p>
            {t("rentals.quote.endDate")}:{" "}
            {endISO ? formatReadableDate(endISO, "en") : "—"}
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}
        <input
          type="text"
          name="b_website_hp"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ display: "none", opacity: 0, position: "absolute", left: "-9999px" }}
        />

        {datesLocked ? null : (
          <div className="my-4 flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setRecaptchaToken(token)}
              onExpired={() => setRecaptchaToken(null)}
              theme="dark"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            {t("rentals.quote.close")}
          </Button>
          {datesLocked ? (
            <Button asChild className="flex-1 bg-[#FF5500] text-white hover:bg-[#e64d00]">
              <RentalInquiryLink equipment={equipment} onClick={() => onOpenChange(false)}>
                {t("rentals.card.inquire")}
              </RentalInquiryLink>
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "flex-1 bg-[#FF5500] text-white hover:bg-[#e64d00]",
                (!recaptchaToken || submitting) && "cursor-not-allowed opacity-50"
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("rentals.quote.submitting")}
                </>
              ) : (
                t("rentals.quote.submit")
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

export function RentalQuoteModal({
  open,
  equipment,
  availability,
  onOpenChange,
}: RentalQuoteModalProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-[#FF5500]/30 bg-[#0a1628] text-white sm:rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {t("rentals.quote.title")}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {equipment?.displayName}
          </DialogDescription>
        </DialogHeader>
        {equipment ? (
          <RentalQuoteForm
            key={String(equipment.id)}
            equipment={equipment}
            availability={availability}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
