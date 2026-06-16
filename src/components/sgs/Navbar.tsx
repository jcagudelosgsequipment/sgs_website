import { useEffect, useId, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Plane,
  Languages,
  ShoppingCart,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHomeWatermark } from "@/contexts/HomeWatermarkContext";
import { useQuote } from "@/contexts/QuoteContext";
import { useI18n, type DictKey } from "@/lib/i18n";
import { EQUIPMENT_CATEGORIES } from "@/types/equipment";

type NavDropdown = "equipos" | "servicios";

type NavItem = { key: NavDropdown | string; labelKey: DictKey; href: string; dropdown?: NavDropdown };

const navItems: NavItem[] = [
  { key: "equipos", labelKey: "nav.equipos", href: "/equipos", dropdown: "equipos" },
  { key: "servicios", labelKey: "nav.servicios", href: "/servicios", dropdown: "servicios" },
  { key: "nosotros", labelKey: "nav.nosotros", href: "/nosotros" },
  { key: "contacto", labelKey: "nav.contacto", href: "/contacto" },
];

const PARTS_URL = "https://gseparts.us";

const serviceDropdownItems = [
  { label: "GS Training", href: "/servicios" },
  { label: "Parts", href: PARTS_URL, external: true },
  { label: "Repair Services", href: "/servicios/reparacion" },
];

const QuoteCartLink = ({ solidNav }: { solidNav: boolean }) => {
  const { quoteItems } = useQuote();
  const count = quoteItems.length;
  const hasItems = count > 0;

  return (
    <Link
      to="/solicitud-cotizacion"
      aria-label={hasItems ? `Cotización: ${count} equipos` : "Carrito de cotización vacío"}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors",
        hasItems ? "opacity-100" : "opacity-40",
        solidNav
          ? "text-foreground hover:bg-muted hover:text-primary"
          : "text-white/90 hover:bg-white/10 hover:text-white"
      )}
    >
      <ShoppingCart className="h-5 w-5" aria-hidden />
      {hasItems ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
};

const LangToggle = ({ scrolled }: { scrolled: boolean }) => {
  const { lang, setLang, t } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "es" ? "en" : "es")}
      aria-label={t("lang.aria")}
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold tracking-wide rounded-full px-3 h-8 border transition-colors",
        scrolled
          ? "border-border text-foreground hover:bg-muted"
          : "border-white/20 text-white/90 hover:bg-white/10"
      )}
    >
      <Languages className="w-3.5 h-3.5" />
      <span className="uppercase">{lang === "es" ? "EN" : "ES"}</span>
    </button>
  );
};

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<NavDropdown | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();
  const { pathname } = useLocation();
  const servicesDropdownId = useId();
  const { watermarkVisible } = useHomeWatermark();
  const isHome = pathname === "/";
  const solidNav = scrolled || !isHome;
  const showNavbarLogo = !isHome || !watermarkVisible;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        solidNav
          ? "bg-background/85 backdrop-blur-xl shadow-nav border-b border-border/60"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto h-[88px] flex items-center justify-between gap-6">
        <div
          className={cn(
            "transition-opacity duration-300",
            showNavbarLogo ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Logo light={!solidNav} />
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const isDropdownOpen = item.dropdown != null && openDropdown === item.dropdown;

            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.dropdown)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.dropdown ? (
                  <NavLink
                    to={item.href}
                    aria-haspopup="menu"
                    aria-expanded={isDropdownOpen}
                    aria-controls={item.dropdown === "servicios" ? servicesDropdownId : undefined}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setOpenDropdown(null);
                    }}
                    className={cn(
                      "nav-underline flex items-center gap-1 text-sm font-medium tracking-tight transition-colors py-2",
                      solidNav ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"
                    )}
                  >
                    {t(item.labelKey)}
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-300",
                        isDropdownOpen && "rotate-180"
                      )}
                    />
                  </NavLink>
                ) : (
                  <NavLink
                    to={item.href}
                    className={cn(
                      "nav-underline flex items-center gap-1 text-sm font-medium tracking-tight transition-colors py-2",
                      solidNav ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"
                    )}
                  >
                    {t(item.labelKey)}
                  </NavLink>
                )}

                <AnimatePresence>
                  {item.dropdown === "servicios" && isDropdownOpen && (
                    <motion.div
                      id={servicesDropdownId}
                      role="menu"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-0 top-full pt-3 min-w-[220px] z-50"
                    >
                      <div className="bg-background border border-border rounded-xl shadow-card p-2">
                        {serviceDropdownItems.map((dropdownItem) =>
                          dropdownItem.external ? (
                            <a
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              role="menuitem"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenDropdown(null)}
                              className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              {dropdownItem.label}
                            </a>
                          ) : (
                            <Link
                              key={dropdownItem.label}
                              to={dropdownItem.href}
                              role="menuitem"
                              onClick={() => setOpenDropdown(null)}
                              className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              {dropdownItem.label}
                            </Link>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}

                  {item.dropdown === "equipos" && isDropdownOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] as const }}
                      className="absolute left-0 top-full pt-3 w-[720px] z-50"
                    >
                      <div className="bg-background border border-border rounded-2xl shadow-card p-4 max-h-[min(70vh,420px)] overflow-y-auto">
                        <div className="grid grid-cols-3 gap-1">
                          {EQUIPMENT_CATEGORIES.map((category) => (
                            <Link
                              key={category}
                              to={`/equipos?category=${encodeURIComponent(category)}`}
                              role="menuitem"
                              onClick={() => setOpenDropdown(null)}
                              className="group flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-muted transition-colors"
                            >
                              <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                <Plane className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-sm text-foreground leading-tight">
                                {category}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+18001234567"
            className={cn(
              "flex items-center gap-2 text-xs font-medium transition-colors",
              solidNav ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-white"
            )}
          >
            <Phone className="w-3.5 h-3.5" />
            +1 (800) 123-4567
          </a>
          <LangToggle scrolled={solidNav} />
          <QuoteCartLink solidNav={solidNav} />
          <Button
            asChild
            className="rounded-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold px-5 h-10 shadow-glow hover:scale-[1.03] transition-transform"
          >
            <Link to="/contacto">
              {t("nav.cta")}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <QuoteCartLink solidNav={solidNav} />
          <LangToggle scrolled={solidNav} />
          <button
            onClick={() => setMobileOpen(true)}
            className={cn("p-2 -mr-2", solidNav ? "text-foreground" : "text-white")}
            aria-label={t("nav.menu_open")}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

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
              <div className="h-[88px] flex items-center justify-between px-6 border-b border-border">
                <Logo />
                <button onClick={() => setMobileOpen(false)} aria-label={t("nav.menu_close")}>
                  <X className="w-6 h-6 text-foreground" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-1">
                {navItems.map((item) =>
                  item.dropdown === "servicios" ? (
                    <div key={item.key} className="border-b border-border/50 py-3 px-2">
                      <div className="text-lg font-semibold text-foreground">{t(item.labelKey)}</div>
                      <div className="mt-2 flex flex-col">
                        {serviceDropdownItems.map((dropdownItem) =>
                          dropdownItem.external ? (
                            <a
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setMobileOpen(false)}
                              className="py-2 text-sm text-muted-foreground hover:text-primary"
                            >
                              {dropdownItem.label}
                            </a>
                          ) : (
                            <NavLink
                              key={dropdownItem.label}
                              to={dropdownItem.href}
                              onClick={() => setMobileOpen(false)}
                              className="py-2 text-sm text-muted-foreground hover:text-primary"
                            >
                              {dropdownItem.label}
                            </NavLink>
                          )
                        )}
                      </div>
                    </div>
                  ) : item.dropdown === "equipos" ? (
                    <div key={item.key} className="border-b border-border/50 py-3 px-2">
                      <NavLink
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-lg font-semibold text-foreground hover:text-primary"
                      >
                        {t(item.labelKey)}
                      </NavLink>
                      <div className="mt-2 flex flex-col">
                        {EQUIPMENT_CATEGORIES.map((category) => (
                          <NavLink
                            key={category}
                            to={`/equipos?category=${encodeURIComponent(category)}`}
                            onClick={() => setMobileOpen(false)}
                            className="py-2 text-sm text-muted-foreground hover:text-primary"
                          >
                            {category}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <NavLink
                      key={item.key}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="py-3 px-2 text-lg font-semibold text-foreground hover:text-primary border-b border-border/50"
                    >
                      {t(item.labelKey)}
                    </NavLink>
                  )
                )}
                <a href="tel:+18001234567" className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" /> +1 (800) 123-4567
                </a>
              </nav>
              <div className="p-6 border-t border-border">
                <Button
                  asChild
                  className="w-full rounded-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold h-12"
                >
                  <Link to="/contacto" onClick={() => setMobileOpen(false)}>
                    {t("nav.cta")} <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
