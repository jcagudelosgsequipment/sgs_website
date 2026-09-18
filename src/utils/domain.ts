const RENTALS_SIM_KEY = "sgs-domain";

export const MAIN_DOMAIN_URL = "https://sgsequipment.com";
export const RENTALS_DOMAIN_URL = "https://sgs.rentals";

export const isRentalsHost = (): boolean => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  // Detecta el dominio de producción o simulación local con ?domain=rentals
  const params = new URLSearchParams(window.location.search);
  const domainParam = params.get("domain");

  if (domainParam === "rentals") {
    persistRentalsSim(true);
    return true;
  }

  if (domainParam === "main") {
    persistRentalsSim(false);
    return false;
  }

  return (
    host === "sgs.rentals" ||
    host.endsWith(".sgs.rentals") ||
    readRentalsSim()
  );
};

export const withMainDomain = (path: string): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return isRentalsHost() ? `${MAIN_DOMAIN_URL}${normalized}` : normalized;
};

export const catalogPath = (): string => (isRentalsHost() ? "/" : "/equipos");

function persistRentalsSim(enabled: boolean): void {
  try {
    if (enabled) sessionStorage.setItem(RENTALS_SIM_KEY, "rentals");
    else sessionStorage.removeItem(RENTALS_SIM_KEY);
  } catch {
    // sessionStorage puede fallar en modo privado
  }
}

function readRentalsSim(): boolean {
  try {
    return sessionStorage.getItem(RENTALS_SIM_KEY) === "rentals";
  } catch {
    return false;
  }
}
