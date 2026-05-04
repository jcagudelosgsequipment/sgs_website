import { Navbar } from "@/components/sgs/Navbar";
import { HeroSection } from "@/components/sgs/HeroSection";
import { TrustBar } from "@/components/sgs/TrustBar";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustBar />
      {/* Anchor placeholders so nav links resolve */}
      <section id="equipos" className="py-32 container mx-auto">
        <h2 className="text-3xl font-bold text-foreground">Equipos</h2>
        <p className="text-muted-foreground mt-2">Sección en construcción.</p>
      </section>
      <section id="categorias" className="py-32 container mx-auto bg-muted/40">
        <h2 className="text-3xl font-bold text-foreground">Categorías</h2>
      </section>
      <section id="servicios" className="py-32 container mx-auto">
        <h2 className="text-3xl font-bold text-foreground">Servicios</h2>
      </section>
      <section id="nosotros" className="py-32 container mx-auto bg-muted/40">
        <h2 className="text-3xl font-bold text-foreground">Nosotros</h2>
      </section>
      <section id="contacto" className="py-32 container mx-auto">
        <h2 className="text-3xl font-bold text-foreground">Contacto</h2>
      </section>
    </main>
  );
};

export default Index;
