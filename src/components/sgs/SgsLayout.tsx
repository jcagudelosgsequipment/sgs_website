import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "@/components/sgs/Footer";
import { Navbar } from "@/components/sgs/Navbar";
import { HomeWatermarkProvider } from "@/contexts/HomeWatermarkContext";

export const SgsLayout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <HomeWatermarkProvider>
      <div className="min-h-screen max-w-full overflow-x-clip">
        <Navbar />
        <div className={isHome ? undefined : "pt-24 lg:pt-28"}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </HomeWatermarkProvider>
  );
};
