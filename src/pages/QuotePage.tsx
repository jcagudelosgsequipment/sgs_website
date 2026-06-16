import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuote } from "@/contexts/QuoteContext";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { EquipmentItem } from "@/types/equipment";

type InterestType = "rent" | "buy";

type QuoteFormState = {
  fullName: string;
  email: string;
  phone: string;
  interestType: InterestType;
  requestedDate: string;
};

const initialForm: QuoteFormState = {
  fullName: "",
  email: "",
  phone: "",
  interestType: "rent",
  requestedDate: "",
};

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";
const IS_DEV_TEST_KEY = !RECAPTCHA_SITE_KEY || RECAPTCHA_SITE_KEY === "test";

function QuoteSummaryItem({
  item,
  onRemove,
  removeLabel,
  categoryLabel,
}: {
  item: EquipmentItem;
  onRemove: (id: string | number) => void;
  removeLabel: string;
  categoryLabel: string;
}) {
  return (
    <li className="flex gap-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        {item.photoUrl ? (
          <img
            src={item.photoUrl}
            alt={item.displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">—</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {categoryLabel}
        </p>
        <p className="mt-0.5 truncate font-semibold text-slate-900">
          {item.manufacturer} {item.model}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.displayName}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        className="shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
        aria-label={removeLabel}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}

const QuoteForm = () => {
  const { t, translateCategory } = useI18n();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { quoteItems, removeFromQuote, clearQuote } = useQuote();
  const [form, setForm] = useState<QuoteFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const hasItems = quoteItems.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hasItems || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      let recaptchaToken: string;

      if (IS_DEV_TEST_KEY) {
        recaptchaToken = "test";
      } else {
        if (!executeRecaptcha) {
          console.error("ReCAPTCHA not yet available");
          setSubmitting(false);
          return;
        }
        recaptchaToken = await executeRecaptcha("quote_form");
      }

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          equipment: quoteItems,
          recaptchaToken,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? t("quote.error"));
      }

      clearQuote();
      setForm(initialForm);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("quote.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-12 [background-image:radial-gradient(rgb(148_163_184/0.1)_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="container mx-auto max-w-6xl px-4">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {t("quote.title")}
          </h1>
          <p className="mt-2 text-slate-600">{t("quote.subtitle")}</p>
        </header>

        {success ? (
          <div
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center shadow-sm"
            role="status"
          >
            <p className="text-lg font-semibold text-emerald-900">{t("quote.success")}</p>
            <Button asChild className="mt-6 rounded-full bg-orange-500 hover:bg-orange-600">
              <Link to="/equipos">{t("quote.backCatalog")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            {/* Left: equipment summary */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {t("quote.summary")}
              </h2>

              {!hasItems ? (
                <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
                  <ShoppingBag className="h-10 w-10 text-slate-300" aria-hidden />
                  <p className="mt-4 text-base font-medium text-slate-700">{t("quote.empty")}</p>
                  <Button asChild variant="outline" className="mt-6">
                    <Link to="/equipos">{t("quote.backCatalog")}</Link>
                  </Button>
                </div>
              ) : (
                <ul className="mt-6 space-y-3">
                  {quoteItems.map((item) => (
                    <QuoteSummaryItem
                      key={item.id}
                      item={item}
                      onRemove={removeFromQuote}
                      removeLabel={t("quote.removeItem")}
                      categoryLabel={translateCategory(item.equipmentType)}
                    />
                  ))}
                </ul>
              )}
            </section>

            {/* Right: premium form */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {t("quote.formTitle")}
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("quote.fullName")} *</Label>
                  <Input
                    id="fullName"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="h-11 rounded-lg border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("quote.email")} *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="h-11 rounded-lg border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("quote.phone")} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="h-11 rounded-lg border-slate-200"
                  />
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium">{t("quote.interest")} *</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { value: "rent" as const, label: t("quote.rent") },
                        { value: "buy" as const, label: t("quote.buy") },
                      ] as const
                    ).map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
                          form.interestType === opt.value
                            ? "border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                        )}
                      >
                        <input
                          type="radio"
                          name="interestType"
                          value={opt.value}
                          checked={form.interestType === opt.value}
                          onChange={() => setForm((f) => ({ ...f, interestType: opt.value }))}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="space-y-2">
                  <Label htmlFor="requestedDate">{t("quote.requestedDate")} *</Label>
                  <Input
                    id="requestedDate"
                    type="date"
                    required
                    min={today}
                    value={form.requestedDate}
                    onChange={(e) => setForm((f) => ({ ...f, requestedDate: e.target.value }))}
                    className="h-11 rounded-lg border-slate-200"
                  />
                </div>

                {error ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={!hasItems || submitting}
                  className="h-12 w-full rounded-xl bg-orange-500 text-base font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("quote.submitting")}
                    </>
                  ) : (
                    t("quote.submit")
                  )}
                </Button>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default function QuotePage() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ""}
      useEnterprise={true}
    >
      <QuoteForm />
    </GoogleReCaptchaProvider>
  );
}
