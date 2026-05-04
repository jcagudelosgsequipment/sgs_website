import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "es" | "en";

type Dict = Record<string, { es: string; en: string }>;

export const dict = {
  // Navbar
  "nav.equipos": { es: "Equipos", en: "Equipment" },
  "nav.categorias": { es: "Categorías", en: "Categories" },
  "nav.servicios": { es: "Servicios", en: "Services" },
  "nav.nosotros": { es: "Nosotros", en: "About" },
  "nav.contacto": { es: "Contacto", en: "Contact" },
  "nav.cta": { es: "Solicitar Cotización", en: "Request a Quote" },
  "nav.menu_open": { es: "Abrir menú", en: "Open menu" },
  "nav.menu_close": { es: "Cerrar menú", en: "Close menu" },

  // Mega - Equipos
  "eq.gruas": { es: "Grúas", en: "Cranes" },
  "eq.gruas.d": { es: "Telescópicas, torre y móviles", en: "Telescopic, tower and mobile" },
  "eq.exc": { es: "Excavadoras", en: "Excavators" },
  "eq.exc.d": { es: "Hidráulicas y compactas", en: "Hydraulic and compact" },
  "eq.mont": { es: "Montacargas", en: "Forklifts" },
  "eq.mont.d": { es: "Eléctricos y diésel hasta 25t", en: "Electric and diesel up to 25t" },
  "eq.comp": { es: "Compresores", en: "Compressors" },
  "eq.comp.d": { es: "Estacionarios y portátiles", en: "Stationary and portable" },
  "eq.gen": { es: "Generadores", en: "Generators" },
  "eq.gen.d": { es: "Industriales 10kVA – 2MVA", en: "Industrial 10kVA – 2MVA" },
  "eq.bombas": { es: "Bombas Industriales", en: "Industrial Pumps" },
  "eq.bombas.d": { es: "Centrífugas y sumergibles", en: "Centrifugal and submersible" },

  // Mega - Categorías
  "cat.constr": { es: "Construcción", en: "Construction" },
  "cat.constr.d": { es: "Maquinaria pesada para obra", en: "Heavy machinery for jobsites" },
  "cat.min": { es: "Minería", en: "Mining" },
  "cat.min.d": { es: "Equipos de alto rendimiento", en: "High-performance equipment" },
  "cat.log": { es: "Logística", en: "Logistics" },
  "cat.log.d": { es: "Manejo de carga y materiales", en: "Cargo and materials handling" },
  "cat.energy": { es: "Energía", en: "Energy" },
  "cat.energy.d": { es: "Generación y respaldo eléctrico", en: "Power generation and backup" },

  // Hero
  "hero.badge": { es: "Líderes en Maquinaria Industrial", en: "Industrial Machinery Leaders" },
  "hero.h1.l1": { es: "Soluciones en", en: "Solutions in" },
  "hero.h1.l2a": { es: "Equipos", en: "Industrial" },
  "hero.h1.l2b": { es: "Industriales", en: "Equipment" },
  "hero.sub": {
    es: "Más de 500 equipos disponibles para renta y venta. Cotización personalizada en menos de 24 horas.",
    en: "Over 500 units available for rent and sale. Personalized quote in less than 24 hours.",
  },
  "hero.cta1": { es: "Explorar Catálogo", en: "Explore Catalog" },
  "hero.cta2": { es: "Ver Video", en: "Watch Video" },
  "hero.trust1": { es: "Envío a toda LATAM", en: "Shipping across LATAM" },
  "hero.trust2": { es: "Garantía certificada", en: "Certified warranty" },
  "hero.trust3": { es: "Soporte 24/7", en: "24/7 support" },
  "hero.featured": { es: "Destacado", en: "Featured" },
  "hero.card.cat": { es: "Grúas", en: "Cranes" },
  "hero.card.title": { es: "Grúa Telescópica GT-500", en: "Telescopic Crane GT-500" },
  "hero.card.cap": { es: "Capacidad", en: "Capacity" },
  "hero.card.reach": { es: "Alcance", en: "Reach" },
  "hero.card.cta": { es: "Cotizar Ahora", en: "Get a Quote" },
  "hero.scroll": { es: "Descubre más", en: "Discover more" },

  // Trust bar
  "trust.s1": { es: "Equipos en catálogo", en: "Units in catalog" },
  "trust.s2.suffix": { es: " años", en: " years" },
  "trust.s2": { es: "En el mercado", en: "In the market" },
  "trust.s3": { es: "Clientes satisfechos", en: "Satisfied clients" },
  "trust.s4": { es: "Tiempo de cotización", en: "Quote turnaround" },

  // Sections
  "sec.equipos": { es: "Equipos", en: "Equipment" },
  "sec.placeholder": { es: "Sección en construcción.", en: "Section under construction." },
  "sec.categorias": { es: "Categorías", en: "Categories" },
  "sec.servicios": { es: "Servicios", en: "Services" },
  "sec.nosotros": { es: "Nosotros", en: "About" },
  "sec.contacto": { es: "Contacto", en: "Contact" },

  // Lang toggle
  "lang.switch": { es: "English", en: "Español" },
  "lang.aria": { es: "Cambiar idioma", en: "Switch language" },
} satisfies Dict;

export type DictKey = keyof typeof dict;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string };
const I18nContext = createContext<Ctx | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("es");
  const t = (k: DictKey) => dict[k][lang];
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
