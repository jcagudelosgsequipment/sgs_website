import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ConstructionIcon,
  Truck,
  Forklift,
  Wind,
  Zap,
  Droplets,
  Layers,
  Wrench,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const equiposItems = [
  { icon: ConstructionIcon, name: "Grúas", desc: "Telescópicas, torre y móviles", href: "#equipos" },
  { icon: Truck, name: "Excavadoras", desc: "Hidráulicas y compactas", href: "#equipos" },
  { icon: Forklift, name: "Montacargas", desc: "Eléctricos y diésel hasta 25t", href: "#equipos" },
  { icon: Wind, name: "Compresores", desc: "Estacionarios y portátiles", href: "#equipos" },
  { icon: Zap, name: "Generadores", desc: "Industriales 10kVA – 2MVA", href: "#equipos" },
  { icon: Droplets, name: "Bombas Industriales", desc: "Centrífugas y sumergibles", href: "#equipos" },
];

const categoriasItems = [
  { icon: Layers, name: "Construcción", desc: "Maquinaria pesada para obra", href: "#categorias" },
  { icon: Wrench, name: "Minería", desc: "Equipos de alto rendimiento", href: "#categorias" },
  { icon: Truck, name: "Logística", desc: "Manejo de carga y materiales", href: "#categorias" },
  { icon: Zap, name: "Energía", desc: "Generación y respaldo eléctrico", href: "#categorias" },
];

type NavItem = { label: string; href: string; mega?: typeof equiposItems };

const navItems: NavItem[] = [
  { label: "Equipos", href: "#equipos", mega: equiposItems },
  { label: "Categorías", href: "#categorias", mega: categoriasItems },
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["top", "equipos", "categorias", "servicios", "nosotros", "contacto"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/85 backdrop-blur-xl shadow-nav border-b border-border/60"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto h-[72px] flex items-center justify-between gap-6">
        <Logo light={!scrolled} />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.mega && setOpenMega(item.label)}
              onMouseLeave={() => setOpenMega(null)}
            >
              <a
                href={item.href}
                data-active={activeSection === item.href.slice(1)}
                className={cn(
                  "nav-underline flex items-center gap-1 text-sm font-medium tracking-tight transition-colors py-2",
                  scrolled ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"
                )}
              >
                {item.label}
                {item.mega && (
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-300",
                      openMega === item.label && "rotate-180"
                    )}
                  />
                )}
              </a>

              <AnimatePresence>
                {item.mega && openMega === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] as const }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[640px]"
                  >
                    <div className="bg-background border border-border rounded-2xl shadow-card p-6 grid grid-cols-2 gap-2">
                      {item.mega.map((m) => (
                        <a
                          key={m.name}
                          href={m.href}
                          className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                        >
                          <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                            <m.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-foreground">{m.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{m.desc}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:+18001234567"
            className={cn(
              "flex items-center gap-2 text-xs font-medium transition-colors",
              scrolled ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-white"
            )}
          >
            <Phone className="w-3.5 h-3.5" />
            +1 (800) 123-4567
          </a>
          <Button
            asChild
            className="rounded-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold px-5 h-10 shadow-glow hover:scale-[1.03] transition-transform"
          >
            <a href="#contacto">
              Solicitar Cotización
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className={cn("lg:hidden p-2 -mr-2", scrolled ? "text-foreground" : "text-white")}
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-industrial-navy-deep/70 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background z-50 lg:hidden flex flex-col"
            >
              <div className="h-[72px] flex items-center justify-between px-6 border-b border-border">
                <Logo />
                <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
                  <X className="w-6 h-6 text-foreground" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-2 text-lg font-semibold text-foreground hover:text-primary border-b border-border/50"
                  >
                    {item.label}
                  </a>
                ))}
                <a href="tel:+18001234567" className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" /> +1 (800) 123-4567
                </a>
              </nav>
              <div className="p-6 border-t border-border">
                <Button
                  asChild
                  className="w-full rounded-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold h-12"
                >
                  <a href="#contacto" onClick={() => setMobileOpen(false)}>
                    Solicitar Cotización <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
