import { Navbar } from "@/components/sgs/Navbar";
import { HeroSection } from "@/components/sgs/HeroSection";
import { TrustBar } from "@/components/sgs/TrustBar";
import { I18nProvider, useI18n, type DictKey } from "@/lib/i18n";

const PlaceholderSection = ({ id, titleKey, alt }: { id: string; titleKey: DictKey; alt?: boolean }) => {
  const { t } = useI18n();
  return (
    <section id={id} className={`py-32 ${alt ? "bg-muted/40" : ""}`}>
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-foreground">{t(titleKey)}</h2>
        <p className="text-muted-foreground mt-2">{t("sec.placeholder")}</p>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <I18nProvider>
      <main className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <TrustBar />
        <PlaceholderSection id="equipos" titleKey="sec.equipos" />
        <PlaceholderSection id="categorias" titleKey="sec.categorias" alt />
        <PlaceholderSection id="servicios" titleKey="sec.servicios" />
        <PlaceholderSection id="nosotros" titleKey="sec.nosotros" alt />
        <PlaceholderSection id="contacto" titleKey="sec.contacto" />
      </main>
    </I18nProvider>
  );
};

export default Index;
