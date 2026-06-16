import { Link } from "react-router-dom";

import {

  Facebook,

  Instagram,

  Linkedin,

  Mail,

  MapPin,

  MessageCircle,

  Phone,

  Search,

  Twitter,

  Youtube,

  type LucideIcon,

} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { useI18n, type DictKey } from "@/lib/i18n";



const PARTS_URL = "https://gseparts.us";



type ContactRow = {

  icon: LucideIcon;

  labelKey: DictKey;

  value: string;

  href: string;

};



const contactRows: ContactRow[] = [

  {

    icon: MapPin,

    labelKey: "footer.contact.address",

    value: "3630 E 10th Ct, Hialeah, FL 33013, USA",

    href: "https://maps.google.com/?q=3630+E+10th+Ct+Hialeah+FL+33013",

  },

  {

    icon: Phone,

    labelKey: "footer.contact.phone",

    value: "+1 877 473 2669",

    href: "tel:+18774732669",

  },

  {

    icon: MessageCircle,

    labelKey: "footer.contact.whatsapp",

    value: "+1 305 424 7480",

    href: "https://wa.me/13054247480",

  },

  {

    icon: Mail,

    labelKey: "footer.contact.email",

    value: "info@sgsequipment.com",

    href: "mailto:info@sgsequipment.com",

  },

];



type SocialLink = { icon: LucideIcon; label: string; href: string };



const socialLinks: SocialLink[] = [

  { icon: Twitter, label: "X", href: "https://x.com" },

  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },

  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },

  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },

  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },

];



type NavLink = {

  labelKey: DictKey;

  to: string;

  external?: boolean;

};



const navLinks: NavLink[] = [

  { labelKey: "footer.nav.home", to: "/" },

  { labelKey: "footer.nav.shop", to: "/equipos" },

  { labelKey: "footer.nav.parts", to: PARTS_URL, external: true },

  { labelKey: "footer.nav.repair", to: "/servicios/reparacion" },

  { labelKey: "footer.nav.training", to: "/servicios" },

  { labelKey: "footer.nav.about", to: "/nosotros" },

  { labelKey: "footer.nav.contact", to: "/contacto" },

];



export const Footer = () => {

  const { t } = useI18n();



  return (

    <footer className="bg-slate-950 text-slate-300">

      <div className="container mx-auto px-4 py-16 lg:py-20">

        <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">

          <div>

            <Link to="/" aria-label="SGS Equipment" className="inline-flex items-center">

              <img

                src="/SGS_LOGO.webp"

                alt="SGS Equipment"

                className="h-12 w-auto drop-shadow-[0_2px_18px_rgba(255,255,255,0.12)]"

              />

            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">

              {t("footer.tagline")}

            </p>



            <ul className="mt-6 space-y-4">

              {contactRows.map((row) => {

                const isExternal = row.href.startsWith("http");

                return (

                  <li key={row.labelKey}>

                    <a

                      href={row.href}

                      target={isExternal ? "_blank" : undefined}

                      rel={isExternal ? "noopener noreferrer" : undefined}

                      className="group flex items-start gap-3 text-sm transition-colors hover:text-white"

                    >

                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">

                        <row.icon className="h-4 w-4" />

                      </span>

                      <span className="flex flex-col">

                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">

                          {t(row.labelKey)}

                        </span>

                        <span className="text-slate-300">{row.value}</span>

                      </span>

                    </a>

                  </li>

                );

              })}

            </ul>

          </div>



          <div>

            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">

              {t("footer.followUs")}

            </h4>

            <div className="mt-4 flex flex-wrap gap-2.5">

              {socialLinks.map((s) => (

                <a

                  key={s.label}

                  href={s.href}

                  target="_blank"

                  rel="noopener noreferrer"

                  aria-label={s.label}

                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-300 transition-colors hover:bg-accent hover:text-accent-foreground"

                >

                  <s.icon className="h-4 w-4" />

                </a>

              ))}

            </div>



            <h4 className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-white">

              {t("footer.search")}

            </h4>

            <form

              onSubmit={(e) => e.preventDefault()}

              className="mt-4 flex w-full overflow-hidden rounded-full border border-slate-800 bg-slate-900 transition-colors focus-within:border-primary-glow"

            >

              <div className="flex flex-1 items-center gap-2 px-4">

                <Search className="h-4 w-4 text-slate-500" />

                <Input

                  type="search"

                  placeholder={t("footer.searchPlaceholder")}

                  aria-label={t("footer.searchPlaceholder")}

                  className="h-11 flex-1 border-0 bg-transparent px-0 text-sm text-slate-200 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"

                />

              </div>

              <Button

                type="submit"

                className="h-11 rounded-none rounded-r-full bg-primary px-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"

              >

                {t("footer.searchButton")}

              </Button>

            </form>



            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold tracking-wide text-slate-300">

              <span className="h-1.5 w-1.5 rounded-full bg-accent" />

              {t("footer.itwBadge")}

            </div>

          </div>



          <div>

            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">

              {t("footer.navigation")}

            </h4>

            <ul className="mt-4 grid gap-2.5">

              {navLinks.map((link) => (

                <li key={link.labelKey}>

                  {link.external ? (

                    <a

                      href={link.to}

                      target="_blank"

                      rel="noopener noreferrer"

                      className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"

                    >

                      <span className="h-px w-4 bg-slate-700 transition-all duration-300 group-hover:w-6 group-hover:bg-accent" />

                      {t(link.labelKey)}

                    </a>

                  ) : (

                    <Link

                      to={link.to}

                      className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"

                    >

                      <span className="h-px w-4 bg-slate-700 transition-all duration-300 group-hover:w-6 group-hover:bg-accent" />

                      {t(link.labelKey)}

                    </Link>

                  )}

                </li>

              ))}

            </ul>

          </div>

        </div>



        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">

          <p>

            © {new Date().getFullYear()} {t("footer.copyright")}

          </p>

          <p className="flex items-center gap-3">

            <Link to="/" className="transition-colors hover:text-slate-300">

              {t("footer.privacy")}

            </Link>

            <span className="h-3 w-px bg-slate-800" />

            <Link to="/" className="transition-colors hover:text-slate-300">

              {t("footer.terms")}

            </Link>

          </p>

        </div>

      </div>

    </footer>

  );

};


