import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/sgs/Navbar";

export const SgsLayout = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
