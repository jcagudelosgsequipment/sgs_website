import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
  "hero.h1.l1": { es: "Soluciones que", en: "Solutions that" },
  "hero.h1.l2a": { es: "mueven grandes", en: "move big" },
  "hero.h1.l2b": { es: "operaciones", en: "operations" },
  "hero.sub": {
    es: "Más de 500 equipos disponibles para renta y venta. Cotización personalizada en menos de 24 horas.",
    en: "Over 500 units available for rent and sale. Personalized quote in less than 24 hours.",
  },
  "hero.cta1": { es: "Explorar Catálogo", en: "Explore Catalog" },
  "hero.cta2": { es: "Ver Video", en: "Watch Video" },
  "hero.trust1": { es: "Envío a toda LATAM", en: "Shipping across LATAM" },
  "hero.trust2": { es: "Garantía certificada", en: "Certified warranty" },
  "hero.trust3": { es: "Soporte 24/7", en: "24/7 support" },
  "hero.trust4": { es: "Equipos de calidad", en: "Quality equipment" },
  "hero.featured": { es: "Destacado", en: "Featured" },
  "hero.card.cat": { es: "Grúas", en: "Cranes" },
  "hero.card.title": { es: "Grúa Telescópica GT-500", en: "Telescopic Crane GT-500" },
  "hero.card.cap": { es: "Capacidad", en: "Capacity" },
  "hero.card.reach": { es: "Alcance", en: "Reach" },
  "hero.card.fuel": { es: "Tipo de Combustible", en: "Fuel Type" },
  "hero.card.cta": { es: "Cotizar Ahora", en: "Get a Quote" },
  "hero.card.loading": { es: "Cargando equipos…", en: "Loading equipment…" },
  "hero.card.empty": { es: "Sin equipos destacados disponibles", en: "No featured equipment available" },
  "hero.card.prev": { es: "Equipo anterior", en: "Previous equipment" },
  "hero.card.next": { es: "Siguiente equipo", en: "Next equipment" },
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

  // Equipment detail
  "equipment.related": { es: "Equipos Relacionados", en: "Related Equipment" },
  "equipment.viewMore": { es: "Ver más", en: "Scroll to view more" },

  // Quote page
  "quote.title": { es: "Solicitud de Cotización", en: "Quote Request" },
  "quote.subtitle": {
    es: "Revisa tu selección y completa el formulario para recibir una propuesta.",
    en: "Review your selection and complete the form to receive a proposal.",
  },
  "quote.summary": { es: "Resumen de máquinas", en: "Equipment summary" },
  "quote.empty": { es: "No has seleccionado ningún equipo", en: "You have not selected any equipment" },
  "quote.backCatalog": { es: "Volver al catálogo", en: "Back to catalog" },
  "quote.formTitle": { es: "Datos de contacto", en: "Contact details" },
  "quote.fullName": { es: "Nombre completo", en: "Full name" },
  "quote.email": { es: "Correo electrónico", en: "Email" },
  "quote.phone": { es: "Número de contacto", en: "Phone number" },
  "quote.interest": { es: "Tipo de interés", en: "Interest type" },
  "quote.rent": { es: "Rentar / Rent", en: "Rentar / Rent" },
  "quote.buy": { es: "Comprar / Buy", en: "Comprar / Buy" },
  "quote.requestedDate": { es: "Fecha requerida", en: "Requested date" },
  "quote.submit": { es: "Enviar Cotización", en: "Submit Quote" },
  "quote.submitting": { es: "Enviando…", en: "Sending…" },
  "quote.success": {
    es: "¡Cotización enviada con éxito! Nos pondremos en contacto pronto.",
    en: "Quote sent successfully! We will contact you soon.",
  },
  "quote.error": {
    es: "No se pudo enviar la cotización. Intenta de nuevo.",
    en: "Could not submit the quote. Please try again.",
  },
  "quote.removeItem": { es: "Eliminar equipo", en: "Remove equipment" },

  // Lang toggle
  "lang.switch": { es: "English", en: "Español" },
  "lang.aria": { es: "Cambiar idioma", en: "Switch language" },

  // Repair Services
  "repair.badge": { es: "SGS MAINTENANCE DIVISION", en: "SGS MAINTENANCE DIVISION" },
  "repair.hero.title": {
    es: "Servicios de Reparación y Mantenimiento Especializado",
    en: "Specialized Repair & Maintenance Services",
  },
  "repair.hero.subtitle": {
    es: "Maximizamos el tiempo de actividad de sus equipos de soporte en tierra (GSE) con soporte técnico certificado, repuestos originales y tiempos de respuesta récord en la industria.",
    en: "We maximize uptime for your ground support equipment (GSE) with certified technical support, genuine parts, and industry-leading response times.",
  },
  "repair.hero.img1.alt": {
    es: "Técnico realizando reparación electrónica de equipo GSE",
    en: "Technician performing electronic repair on GSE equipment",
  },
  "repair.hero.img2.alt": {
    es: "Taller de servicio TUG con equipo de soporte en tierra",
    en: "TUG service shop with ground support equipment",
  },
  "repair.capabilities.eyebrow": { es: "Capacidades", en: "Capabilities" },
  "repair.capabilities.title": { es: "Nuestras Capacidades Técnicas", en: "Our Technical Capabilities" },
  "repair.capabilities.subtitle": {
    es: "Soluciones integrales de mantenimiento para mantener su flota GSE operativa, segura y certificada.",
    en: "Comprehensive maintenance solutions to keep your GSE fleet operational, safe, and certified.",
  },
  "repair.svc1.title": { es: "Mantenimiento Preventivo", en: "Preventive Maintenance" },
  "repair.svc1.desc": {
    es: "Inspecciones programadas, cambios de fluidos y chequeos de sistemas críticos para evitar fallas catastróficas y prolongar la vida útil de sus equipos.",
    en: "Scheduled inspections, fluid changes, and critical system checks to prevent catastrophic failures and extend equipment lifespan.",
  },
  "repair.svc2.title": { es: "Reparaciones Correctivas (24/7)", en: "Corrective Repairs (24/7)" },
  "repair.svc2.desc": {
    es: "Asistencia técnica de emergencia en rampa y pista para resolver averías mecánicas, hidráulicas o eléctricas de inmediato, sin interrumpir sus operaciones.",
    en: "Emergency on-ramp and airfield technical assistance to resolve mechanical, hydraulic, or electrical failures immediately without disrupting operations.",
  },
  "repair.svc3.title": { es: "Reacondicionamiento Completo (Overhaul)", en: "Full Reconditioning (Overhaul)" },
  "repair.svc3.desc": {
    es: "Reconstrucción estructural y mecánica de equipos usados para devolverlos a condiciones óptimas de fábrica, listos para certificación operacional.",
    en: "Structural and mechanical rebuild of used equipment to restore factory-optimal condition, ready for operational certification.",
  },
  "repair.svc4.title": { es: "Diagnóstico por Computador y Certificación", en: "Computer Diagnostics & Certification" },
  "repair.svc4.desc": {
    es: "Pruebas de carga de GPUs, análisis de sistemas y emisión de certificaciones operacionales internacionales conforme a normativas aeroportuarias.",
    en: "GPU load testing, system analysis, and issuance of international operational certifications per airport regulations.",
  },
  "repair.trust.eyebrow": { es: "Rendimiento Comprobado", en: "Proven Performance" },
  "repair.metric1.value": { es: "< 2 horas", en: "< 2 hours" },
  "repair.metric1.label": { es: "Tiempos de respuesta en emergencias", en: "Emergency response times" },
  "repair.metric2.value": { es: "100%", en: "100%" },
  "repair.metric2.label": { es: "Técnicos certificados", en: "Certified technicians" },
  "repair.metric3.value": { es: "Garantía", en: "Warranty" },
  "repair.metric3.label": { es: "En mano de obra especializada", en: "On specialized labor" },
  "repair.trust.title": { es: "¿Por qué elegir a SGS?", en: "Why Choose SGS?" },
  "repair.trust.subtitle": {
    es: "Más de dos décadas respaldando operaciones aeroportuarias con infraestructura propia, inventario estratégico y cumplimiento normativo riguroso.",
    en: "Over two decades supporting airport operations with in-house infrastructure, strategic inventory, and rigorous regulatory compliance.",
  },
  "repair.benefit1": {
    es: "Taller propio completamente equipado con herramientas de diagnóstico de última generación y áreas de prueba certificadas.",
    en: "Fully equipped in-house shop with state-of-the-art diagnostic tools and certified test areas.",
  },
  "repair.benefit2": {
    es: "Stock de repuestos críticos de marcas líderes como Textron, TUG y otros fabricantes OEM para reducir tiempos de inactividad.",
    en: "Critical spare parts inventory from leading brands like Textron, TUG, and other OEM manufacturers to minimize downtime.",
  },
  "repair.benefit3": {
    es: "Cumplimiento estricto de normativas de seguridad aeroportuaria y estándares internacionales de mantenimiento GSE.",
    en: "Strict compliance with airport safety regulations and international GSE maintenance standards.",
  },
  "repair.cta.title": { es: "¿Su equipo requiere asistencia inmediata?", en: "Does your equipment need immediate assistance?" },
  "repair.cta.subtitle": {
    es: "Solicite un técnico de servicio o agende un mantenimiento preventivo hoy. Nuestro equipo está disponible 24/7 para emergencias en rampa.",
    en: "Request a field technician or schedule preventive maintenance today. Our team is available 24/7 for on-ramp emergencies.",
  },
  "repair.cta.button": { es: "Agendar Servicio Técnico", en: "Schedule Technical Service" },

  // About Us
  "about.badge": { es: "Conozca SGS Equipment", en: "Discover SGS Equipment" },
  "about.hero.title": {
    es: "Trayectoria, Confianza y Respaldo Operacional en GSE",
    en: "Track Record, Trust and Operational Support in GSE",
  },
  "about.hero.subtitle": {
    es: "Somos una compañía operada y de propiedad familiar con más de 40 años de experiencia combinada en soporte en tierra, comprometidos con el éxito de las aerolíneas y operadores de rampa globales.",
    en: "We are a family-owned and operated company with over 40 years of combined ground support experience, committed to the success of airlines and ramp operators worldwide.",
  },
  "about.core.eyebrow": { es: "Quiénes Somos", en: "Who We Are" },
  "about.core.title": {
    es: "Más de 40 años elevando los estándares de soporte en tierra",
    en: "Over 40 years raising ground support standards",
  },
  "about.core.p1": {
    es: "Nuestra misión principal es proveer a operadores de rampa, aerolíneas y manejadores de carga equipos reacondicionados de alta confiabilidad y repuestos certificados de calidad óptima.",
    en: "Our primary mission is to provide ramp operators, airlines and cargo handlers with highly reliable reconditioned equipment and certified parts of optimal quality.",
  },
  "about.core.p2": {
    es: "Nos enorgullece contar con un equipo excepcional de mecánicos y electricistas altamente calificados que garantizan soporte técnico inmediato y diagnósticos precisos.",
    en: "We are proud to have an exceptional team of highly qualified mechanics and electricians who guarantee immediate technical support and accurate diagnostics.",
  },
  "about.core.highlight1": { es: "Equipos reacondicionados de alta confiabilidad", en: "Highly reliable reconditioned equipment" },
  "about.core.highlight2": { es: "Repuestos certificados de calidad óptima", en: "Certified parts of optimal quality" },
  "about.core.highlight3": { es: "Soporte técnico inmediato y diagnósticos precisos", en: "Immediate technical support and accurate diagnostics" },
  "about.core.videoTitle": { es: "Video Corporativo Servicore GS", en: "Servicore GS Corporate Video" },
  "about.pillars.eyebrow": { es: "Pilares Fundacionales", en: "Foundational Pillars" },
  "about.pillars.title": { es: "Lo que nos define", en: "What defines us" },
  "about.pillar.mission.title": { es: "Misión", en: "Mission" },
  "about.pillar.mission.desc": {
    es: "Proveer soluciones integrales de equipamiento GSE (Venta, Renta y Repuestos) respaldadas por un soporte profesional fenomenal, mitigando los tiempos de inactividad en pista.",
    en: "Provide comprehensive GSE equipment solutions (Sales, Rental and Parts) backed by phenomenal professional support, mitigating downtime on the ramp.",
  },
  "about.pillar.vision.title": { es: "Visión", en: "Vision" },
  "about.pillar.vision.desc": {
    es: "Consolidarnos como el socio estratégico B2B líder a nivel internacional para el suministro, renovación y mantenimiento técnico avanzado de maquinaria de soporte aeroportuario.",
    en: "Establish ourselves as the leading international B2B strategic partner for supply, refurbishment and advanced technical maintenance of airport support machinery.",
  },
  "about.pillar.values.title": { es: "Valores", en: "Values" },
  "about.pillar.values.desc": {
    es: "Integridad, excelencia técnica, seguridad operacional estricta y el compromiso inquebrantable de tratar a cada cliente con la cercanía y el respeto de un ambiente familiar.",
    en: "Integrity, technical excellence, strict operational safety and an unwavering commitment to treating every customer with the warmth and respect of a family environment.",
  },
  "about.metric1.value": { es: "+40", en: "+40" },
  "about.metric1.label": { es: "Años de Experiencia Combinada", en: "Years of Combined Experience" },
  "about.metric2.value": { es: "100%", en: "100%" },
  "about.metric2.label": {
    es: "Soporte Técnico Especializado (Mecánicos & Electricistas)",
    en: "Specialized Technical Support (Mechanics & Electricians)",
  },
  "about.metric3.value": { es: "Certificados", en: "Certified" },
  "about.metric3.label": {
    es: "Repuestos Originales y Equipos Refabricados Certificados",
    en: "Genuine Parts and Certified Refurbished Equipment",
  },

  // Footer
  "footer.tagline": {
    es: "Su proveedor GSE de confianza — equipos nuevos y reacondicionados de soporte en tierra para cualquier tipo de aeronave.",
    en: "Your trusted GSE provider — new and reconditioned ground support equipment for any aircraft type.",
  },
  "footer.contact.address": { es: "Dirección", en: "Address" },
  "footer.contact.phone": { es: "Teléfono", en: "Phone" },
  "footer.contact.whatsapp": { es: "WhatsApp", en: "WhatsApp" },
  "footer.contact.email": { es: "Correo", en: "Email" },
  "footer.followUs": { es: "Síguenos", en: "Follow Us" },
  "footer.search": { es: "Buscar", en: "Search" },
  "footer.searchPlaceholder": { es: "Buscar productos...", en: "Search products..." },
  "footer.searchButton": { es: "Buscar", en: "Search" },
  "footer.itwBadge": { es: "Proveedor de Servicio ITW GSE", en: "ITW GSE Service Provider" },
  "footer.navigation": { es: "Navegación", en: "Navigation" },
  "footer.nav.home": { es: "Inicio", en: "Home" },
  "footer.nav.shop": { es: "Catálogo de Equipos", en: "Shop Equipment" },
  "footer.nav.parts": { es: "Repuestos", en: "Parts" },
  "footer.nav.repair": { es: "Servicios de Reparación", en: "Repair Services" },
  "footer.nav.training": { es: "Capacitación GSE", en: "GSE Training" },
  "footer.nav.about": { es: "Nosotros", en: "About Us" },
  "footer.nav.contact": { es: "Contacto", en: "Contact" },
  "footer.copyright": { es: "Servicore GS Corp. Todos los derechos reservados.", en: "Servicore GS Corp. All rights reserved." },
  "footer.privacy": { es: "Privacidad", en: "Privacy" },
  "footer.terms": { es: "Términos", en: "Terms" },
  "footer.brand": { es: "Marca", en: "Brand" },

  // Why Choose SGS
  "why.eyebrow": { es: "Por Qué Elegirnos", en: "Why Choose Us" },
  "why.title": { es: "La Ventaja SGS", en: "The SGS Advantage" },
  "why.subtitle": {
    es: "Seis razones por las que nuestros clientes confían en SGS Equipment para mantener sus rampas operativas.",
    en: "Six reasons our customers trust SGS Equipment to keep their ramps running.",
  },
  "why.f1.title": { es: "Ubicaciones Estratégicas", en: "Great Locations" },
  "why.f1.desc": {
    es: "Taller principal en MIA (Miami) y taller remoto dentro de FLL (Ft Lauderdale).",
    en: "Main shop in MIA (Miami) and a remote shop inside FLL (Ft Lauderdale).",
  },
  "why.f2.title": { es: "Soporte Técnico", en: "Tech Support" },
  "why.f2.desc": {
    es: "Soporte por correo, en línea o por teléfono cuando lo necesite.",
    en: "Support via email, online, or by phone whenever you need us.",
  },
  "why.f3.title": { es: "Servicios de Reparación", en: "Repair Services" },
  "why.f3.desc": {
    es: "Reparaciones en sitio o fuera de sitio para equipos de soporte en tierra.",
    en: "On-site or off-site repair services for ground support equipment.",
  },
  "why.f4.title": { es: "Servicio en Sitio", en: "On-Site Service" },
  "why.f4.desc": {
    es: "Ofrecemos servicio en sitio para clientes locales en el sur de Florida.",
    en: "We offer on-site service for our local customers across South Florida.",
  },
  "why.f5.title": { es: "Soporte en Tierra", en: "Ground Support" },
  "why.f5.desc": {
    es: "Para cualquier tipo de aeronave. Gran inventario de equipos listos para desplegar.",
    en: "For any aircraft type. Large stock of equipment ready to deploy.",
  },
  "why.f6.title": { es: "Satisfacción del Cliente", en: "Customer Satisfaction" },
  "why.f6.desc": {
    es: "La satisfacción del cliente es nuestra máxima prioridad en cada operación.",
    en: "Customer satisfaction is our top priority on every deal we make.",
  },

  // Business Divisions
  "biz.eyebrow": { es: "Nuestro Negocio", en: "Our Business" },
  "biz.title": { es: "Tres divisiones, un socio de confianza", en: "Three divisions, one trusted partner" },
  "biz.subtitle": {
    es: "Desde la rampa hasta el mostrador de repuestos, SGS cubre cada paso de su operación de soporte en tierra.",
    en: "From the ramp to the parts counter, SGS covers every step of your ground support operation.",
  },
  "biz.div1.eyebrow": { es: "Nuevo y Reacondicionado", en: "New & Reconditioned" },
  "biz.div1.title": { es: "Equipos Reacondicionados", en: "Reconditioned Equipment" },
  "biz.div1.desc": {
    es: "Venta y renta de tractores, tugs de equipaje, cargadores de banda, escaleras de pasajeros, ACUs, GPUs, ASUs y toda la gama GSE — completamente reacondicionados y listos para operar.",
    en: "Sale and rental of tractors, baggage tugs, belt loaders, passenger stairs, ACUs, GPUs, ASUs and the full range of GSE — fully reconditioned and ready to work.",
  },
  "biz.div1.h1": { es: "Tractores y Cargadores de Banda", en: "Tractors & Belt Loaders" },
  "biz.div1.h2": { es: "Escaleras de Pasajeros", en: "Passenger Stairs" },
  "biz.div1.h3": { es: "ACU · GPU · ASU", en: "ACU · GPU · ASU" },
  "biz.div1.cta": { es: "Ver Catálogo", en: "Shop Equipment" },
  "biz.div2.eyebrow": { es: "GSE en Renta", en: "GSE For Rent" },
  "biz.div2.title": { es: "Rentas", en: "Rentals" },
  "biz.div2.p1": {
    es: "Todas las rentas son gestionadas por nuestra empresa hermana SGS Rentals, Inc. Creamos SGS Rentals para servir mejor a nuestros clientes de renta; nuestra flota sigue creciendo con más de 50 unidades ya en servicio.",
    en: "All rentals are handled by our sister company SGS Rentals, Inc. We created SGS Rentals to better serve our rentals customers; our rental fleet keeps growing with over 50 units already in service.",
  },
  "biz.div2.p2.before": {
    es: "Ofrecemos rentas a corto y largo plazo en cualquier tipo de equipo. Visite",
    en: "We offer short and long term rentals on any type of equipment. Visit",
  },
  "biz.div2.p2.after": {
    es: "para consultar disponibilidad en línea de todas las unidades.",
    en: "to check availability online on all units.",
  },
  "biz.div2.p3": {
    es: "Si busca comprar, consulte nuestra página de catálogo para ver equipos disponibles.",
    en: "If you are looking to buy, check our shop page to see available equipment.",
  },
  "biz.div2.cta": { es: "Solicitar Renta", en: "Request a Rental" },
  "biz.div2.imgAlt": { es: "Flota de equipos SGS Rentals", en: "SGS Rentals equipment fleet" },
  "biz.div3.eyebrow": { es: "Repuestos de Reemplazo", en: "Replacement Parts" },
  "biz.div3.title": { es: "Compre Repuestos GSE en Línea", en: "Buy GSE Replacement Parts Online" },
  "biz.div3.desc": {
    es: "Obtenga repuestos GSE genuinos a través de GS Express, nuestra plataforma en línea — envío rápido, calidad de fábrica y asesoría experta.",
    en: "Source genuine GSE replacement parts through GS Express, our online parts platform — fast shipping, factory-grade quality and expert guidance.",
  },
  "biz.div3.h1": { es: "Plataforma GS Express", en: "GS Express Platform" },
  "biz.div3.h2": { es: "Repuestos OEM Genuinos", en: "Genuine OEM Parts" },
  "biz.div3.h3": { es: "Envío Mundial", en: "Worldwide Shipping" },
  "biz.div3.cta": { es: "Explorar Repuestos", en: "Explore Parts" },

  // Video Showcase
  "video.eyebrow": { es: "Video", en: "Video" },
  "video.title": { es: "Vea Nuestros Equipos en Acción", en: "See Our Equipment in Action" },
  "video.subtitle": {
    es: "Recorridos, demostraciones y operaciones de campo del equipamiento que SGS construye, mantiene y renta cada día.",
    en: "Walkarounds, demos and field operations of the equipment SGS builds, services and rents every day.",
  },
  "video.v1.title": { es: "Unidad de Aire Acondicionado", en: "Air Conditioning Unit" },
  "video.v1.caption": { es: "ACE TLD 804-940", en: "ACE TLD 804-940" },
  "video.v2.title": { es: "Grove MB2 pushback", en: "Grove MB2 pushback" },
  "video.v2.caption": { es: "Tractor PushBack", en: "PushBack Tractor" },
  "video.v3.title": { es: "TUG TMAC 250 ASU", en: "TUG TMAC 250 ASU" },
  "video.v3.caption": { es: "Unidad de Arranque de Aire", en: "Air Start Unit" },

  // Equipment catalog
  "equipos.title": { es: "Catálogo de Equipos", en: "Equipment Catalog" },
  "equipos.loading": { es: "Cargando...", en: "Loading..." },
  "equipos.error": { es: "Error al cargar equipos.", en: "Error loading equipment." },
  "equipos.empty": { es: "No se encontraron equipos para esta categoría.", en: "No equipment found for this category." },
  "equipos.categories": { es: "Categorías", en: "Categories" },
  "equipos.all": { es: "Todos", en: "All" },
  "equipos.card.noImage": { es: "Imagen no disponible", en: "No image available" },
  "equipos.card.capacity": { es: "Capacidad", en: "Capacity" },
  "equipos.carousel.loading": { es: "Cargando equipos…", en: "Loading equipment…" },
  "equipos.carousel.unavailable": { es: "Equipos no disponibles", en: "Equipment unavailable" },
  "equipos.carousel.featured": { es: "Destacado", en: "Featured" },

  // GSE Training
  "training.badge": { es: "DIVISIÓN EDUCATIVA SGS", en: "SGS EDUCATIONAL DIVISION" },
  "training.title": { es: "GS Training: Capacitación Técnica Especializada", en: "GS Training: Specialized Technical Training" },
  "training.notice": {
    es: "Plataforma en fase final de desarrollo. Lanzamiento próximo para operadores y mecánicos SGS.",
    en: "Platform in final development phase. Launch coming soon for SGS operators and mechanics.",
  },
  "training.navAria": { es: "Vistas de la plataforma eLearning", en: "eLearning platform views" },
  "training.tab1.title": { es: "01. Catálogo General", en: "01. General Catalog" },
  "training.tab1.sub": { es: "Exploración de cursos disponibles", en: "Browse available courses" },
  "training.tab1.alt": { es: "Catálogo general de cursos SGS eLearning Academy", en: "SGS eLearning Academy general course catalog" },
  "training.tab2.title": { es: "02. Panel del Estudiante", en: "02. Student Dashboard" },
  "training.tab2.sub": { es: "Seguimiento de progreso y métricas", en: "Progress tracking and metrics" },
  "training.tab2.alt": { es: "Panel del estudiante con progreso y métricas", en: "Student dashboard with progress and metrics" },
  "training.tab3.title": { es: "03. Aula Virtual e Hidráulica", en: "03. Virtual & Hydraulic Classroom" },
  "training.tab3.sub": { es: "Reproductor interactivo y recursos técnicos", en: "Interactive player and technical resources" },
  "training.tab3.alt": { es: "Aula virtual con reproductor interactivo y recursos técnicos", en: "Virtual classroom with interactive player and technical resources" },
  "training.benefit1": { es: "Video Lecciones Fluidas", en: "Smooth Video Lessons" },
  "training.benefit2": { es: "Descarga de Manuales Técnicos (PDF, Schematics)", en: "Technical Manual Downloads (PDF, Schematics)" },
  "training.benefit3": { es: "Certificaciones Homologadas", en: "Accredited Certifications" },

  // Equipment detail
  "equipment.loading": { es: "Cargando", en: "Loading" },
  "equipment.notFound": { es: "Equipo no encontrado.", en: "Equipment not found." },
  "equipment.backCatalog": { es: "Volver al catálogo", en: "Back to catalog" },
  "equipment.home": { es: "Inicio", en: "Home" },
  "equipment.backButton": { es: "Volver al Catálogo", en: "Back to Catalog" },
  "equipment.noImage": { es: "Sin imagen", en: "No image" },
  "equipment.addQuote": { es: "AGREGAR A COTIZACIÓN", en: "ADD TO QUOTE" },
  "equipment.removeQuote": { es: "Quitar de Cotización", en: "Remove from Quote" },
  "equipment.specs": { es: "Especificaciones", en: "Specifications" },
  "equipment.spec.workOrder": { es: "Orden de trabajo", en: "Work order" },
  "equipment.spec.make": { es: "Fabricante", en: "Make" },
  "equipment.spec.model": { es: "Modelo", en: "Model" },
  "equipment.spec.mfgYear": { es: "Año de fabricación", en: "Mfr year" },
  "equipment.spec.status": { es: "Estado", en: "Status" },
  "equipment.spec.capacity": { es: "Capacidad", en: "Capacity" },
  "equipment.spec.fuelType": { es: "Tipo de combustible", en: "Fuel type" },
  "equipment.spec.category": { es: "Categoría", en: "Category" },
  "equipment.overview": { es: "Descripción General", en: "Overview" },
  "equipment.overviewSub": { es: "Descripción del Equipo", en: "Equipment Description" },
  "equipment.overviewTemplate": {
    es: "Este equipo de soporte en tierra (GSE) — {manufacturer} {model} ({type}) — está optimizado para operaciones de alta eficiencia en aeropuertos comerciales, ideal para la gestión de aeronaves de fuselaje estrecho y ancho. Inspeccionado bajo estándares SGS.",
    en: "This ground support equipment (GSE) — {manufacturer} {model} ({type}) — is optimized for high-efficiency operations at commercial airports, ideal for narrow- and wide-body aircraft handling. Inspected to SGS standards.",
  },
  "equipment.trust1": { es: "Certificación Operacional Completa", en: "Full Operational Certification" },
  "equipment.trust2": { es: "Listo para Entrega Inmediata", en: "Ready for Immediate Delivery" },
  "equipment.trust3": { es: "Soporte Técnico Disponible", en: "Technical Support Available" },
  "equipment.modelFallback": { es: "Modelo", en: "Model" },
  "equipment.categoryFallback": { es: "Equipo", en: "Equipment" },
  "equipment.loadError": { es: "No se pudo cargar el equipo.", en: "Could not load equipment." },

  // Not found
  "notfound.title": { es: "Página no encontrada", en: "Page not found" },
  "notfound.message": { es: "¡Ups! La página que busca no existe.", en: "Oops! Page not found" },
  "notfound.home": { es: "Volver al Inicio", en: "Return to Home" },
} satisfies Dict;

export type DictKey = keyof typeof dict;

const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  "Belt Loader": { es: "Cargador de Banda", en: "Belt Loader" },
  "AC GPU": { es: "GPU AC", en: "AC GPU" },
  "DC GPU": { es: "GPU DC", en: "DC GPU" },
  "AC/DC GPU": { es: "GPU AC/DC", en: "AC/DC GPU" },
  "Baggage Tractor": { es: "Tractor de Equipaje", en: "Baggage Tractor" },
  "Passenger Stair": { es: "Escalera de Pasajeros", en: "Passenger Stair" },
  "Cargo Loader": { es: "Cargador de Carga", en: "Cargo Loader" },
  "Air Conditioner (ACU)": { es: "Aire Acondicionado (ACU)", en: "Air Conditioner (ACU)" },
  "Air Start (ASU)": { es: "Arranque de Aire (ASU)", en: "Air Start (ASU)" },
  "Push Back Tractor": { es: "Tractor Push Back", en: "Push Back Tractor" },
  Towbar: { es: "Barra de Remolque", en: "Towbar" },
  "Aerial Equipment": { es: "Equipo Aéreo", en: "Aerial Equipment" },
  Lavatory: { es: "Servicio Sanitario", en: "Lavatory" },
  "Water Service": { es: "Servicio de Agua", en: "Water Service" },
  Dollies: { es: "Carritos (Dollies)", en: "Dollies" },
  "Baggage Carts": { es: "Carritos de Equipaje", en: "Baggage Carts" },
  Lektro: { es: "Lektro", en: "Lektro" },
  "Scissor Lift": { es: "Elevador Tijera", en: "Scissor Lift" },
};

export const translateCategory = (category: string, lang: Lang): string =>
  CATEGORY_LABELS[category]?.[lang] ?? category;

const interpolate = (template: string, vars?: Record<string, string>) => {
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, "g"), value),
    template,
  );
};

const STORAGE_KEY = "sgs-lang";

const readStoredLang = (): Lang => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  return "es";
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: DictKey, vars?: Record<string, string>) => string;
  translateCategory: (category: string) => string;
};
const I18nContext = createContext<Ctx | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l;
  };

  const t = (k: DictKey, vars?: Record<string, string>) =>
    interpolate(dict[k][lang], vars);

  const categoryLabel = (category: string) => translateCategory(category, lang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, translateCategory: categoryLabel }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
