import { FormEvent, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { ChevronRight, Loader2, MessageSquare, Phone, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useI18n, type DictKey } from "@/lib/i18n";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";
const IS_DEV_TEST_KEY = !RECAPTCHA_SITE_KEY || RECAPTCHA_SITE_KEY === "test";

type ContactReason = "Equipment Purchase" | "Equipment Rental" | "Repair Services" | "Technical Support";

const REASON_OPTIONS: { value: ContactReason; labelKey: DictKey }[] = [
  { value: "Equipment Purchase", labelKey: "contact.reason.purchase" },
  { value: "Equipment Rental", labelKey: "contact.reason.rental" },
  { value: "Repair Services", labelKey: "contact.reason.repair" },
  { value: "Technical Support", labelKey: "contact.reason.support" },
];

type ContactFormState = {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  reason: ContactReason | "";
  message: string;
};

const initialForm: ContactFormState = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  reason: "",
  message: "",
};

const premiumCard =
  "rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/80";

const fieldClass = "h-11 rounded-lg border-slate-200 bg-white";

function ContactInfoBlock({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: typeof Phone;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-5", className)}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-accent shadow-[0_8px_24px_rgba(15,23,42,0.25)]">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <div className="min-w-0 pt-1">
        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900">{title}</h3>
        <div className="mt-3 text-sm leading-relaxed text-slate-600">{children}</div>
      </div>
    </div>
  );
}

function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { t } = useI18n();
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

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
        recaptchaToken = await executeRecaptcha("contact_form");
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          recaptchaToken,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? t("contact.error"));
      }

      setForm(initialForm);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("contact.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/70 pb-16 [background-image:radial-gradient(rgb(148_163_184/0.1)_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="border-b border-slate-200/60 bg-white/70 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <nav
            className="flex flex-wrap items-center gap-1 text-sm text-slate-500"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="transition-colors hover:text-accent">
              {t("contact.breadcrumb.home")}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
            <span className="font-medium text-slate-800">{t("contact.breadcrumb.current")}</span>
          </nav>
        </div>

        <header className="mx-auto max-w-7xl px-6 pb-12 pt-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
            {t("contact.badge")}
          </span>
          <h1 className="mt-6 font-display text-4xl font-black uppercase tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            {t("contact.title")}
          </h1>
        </header>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-16 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className={premiumCard}>
            {success ? (
              <div
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-10 text-center"
                role="status"
              >
                <p className="text-lg font-semibold text-emerald-900">
                  {t("contact.success.title")}
                </p>
                <p className="mt-2 text-sm text-emerald-800/80">
                  {t("contact.success.subtitle")}
                </p>
                <Button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-xl bg-accent px-8 font-bold uppercase tracking-wider text-accent-foreground hover:bg-accent-hover"
                >
                  {t("contact.success.another")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("contact.firstName")}</Label>
                    <Input
                      id="firstName"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      className={fieldClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("contact.lastName")}</Label>
                    <Input
                      id="lastName"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">{t("contact.companyName")}</Label>
                  <Input
                    id="companyName"
                    required
                    value={form.companyName}
                    onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("contact.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={fieldClass}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">{t("contact.reason")}</Label>
                  <select
                    id="reason"
                    required
                    value={form.reason}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, reason: e.target.value as ContactReason }))
                    }
                    className={cn(
                      fieldClass,
                      "flex w-full px-3 text-sm text-slate-900 shadow-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  >
                    <option value="" disabled>
                      {t("contact.reason.placeholder")}
                    </option>
                    {REASON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <Textarea
                    id="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="min-h-[160px] resize-y rounded-lg border-slate-200 bg-white text-sm"
                  />
                </div>

                {error ? (
                  <p className="text-sm font-medium text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full rounded-xl bg-accent px-8 font-bold uppercase tracking-wider text-accent-foreground shadow-glow hover:bg-accent-hover disabled:opacity-50 sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                      {t("contact.submitting")}
                    </>
                  ) : (
                    t("contact.submit")
                  )}
                </Button>
              </form>
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-10 lg:col-span-5">
          <ContactInfoBlock icon={Phone} title={t("contact.phone.title")}>
            <p>{t("contact.phone.line1")}</p>
            <p className="mt-3 space-y-1">
              <span className="block">
                {t("contact.phone.local")}{" "}
                <a
                  href="tel:+13058880189"
                  className="font-bold text-slate-900 transition-colors hover:text-accent"
                >
                  +1.305.888.0189
                </a>
              </span>
              <span className="block">
                {t("contact.phone.tollFree")}{" "}
                <a
                  href="tel:+18774732669"
                  className="font-bold text-slate-900 transition-colors hover:text-accent"
                >
                  1.877.473.2669
                </a>
              </span>
            </p>
          </ContactInfoBlock>

          <a
            href="https://wa.me/13054247480"
            target="_blank"
            rel="noopener noreferrer"
            className="group -m-4 block rounded-2xl border border-transparent p-4 transition-colors hover:border-slate-200/80 hover:bg-white/60"
          >
            <ContactInfoBlock icon={MessageSquare} title={t("contact.whatsapp.title")}>
              <p>
                {t("contact.whatsapp.text")}{" "}
                <span className="font-bold text-slate-900 transition-colors group-hover:text-accent">
                  +1.305.424.7480
                </span>
                .
              </p>
            </ContactInfoBlock>
          </a>

          <ContactInfoBlock icon={Wrench} title={t("contact.service.title")}>
            <p>
              {t("contact.service.text.before")}{" "}
              <Link
                to="/servicios/reparacion"
                className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {t("contact.service.link")}
              </Link>{" "}
              {t("contact.service.text.after")}
            </p>
          </ContactInfoBlock>
        </aside>
      </div>
    </main>
  );
}

export default function Contacto() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ""}
      useEnterprise={true}
    >
      <ContactForm />
    </GoogleReCaptchaProvider>
  );
}
