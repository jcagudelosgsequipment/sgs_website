import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

const NotFound = () => {
  const location = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-muted px-4 py-20">
      <div className="text-center">
        <h1 className="mb-4 font-display text-4xl font-bold">404</h1>
        <p className="mb-2 text-xl font-semibold text-foreground">{t("notfound.title")}</p>
        <p className="mb-6 text-muted-foreground">{t("notfound.message")}</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          {t("notfound.home")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
