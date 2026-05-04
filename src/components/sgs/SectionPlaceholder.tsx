import { useI18n, type DictKey } from "@/lib/i18n";

type SectionPlaceholderProps = { titleKey: DictKey };

export const SectionPlaceholder = ({ titleKey }: SectionPlaceholderProps) => {
  const { t } = useI18n();
  return (
    <main className="min-h-screen bg-background pt-[72px]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t(titleKey)}</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">{t("sec.placeholder")}</p>
      </div>
    </main>
  );
};
