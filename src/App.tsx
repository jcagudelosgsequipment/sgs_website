import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SgsLayout } from "@/components/sgs/SgsLayout";
import { QuoteProvider } from "@/contexts/QuoteContext";
import { I18nProvider } from "@/lib/i18n";
import Index from "./pages/Index.tsx";
import Equipos from "./pages/Equipos.tsx";
import EquipmentDetail from "./pages/EquipmentDetail.tsx";
import Categorias from "./pages/Categorias.tsx";
import Servicios from "./pages/Servicios.tsx";
import RepairServices from "./pages/RepairServices.tsx";
import Nosotros from "./pages/Nosotros.tsx";
import Contacto from "./pages/Contacto.tsx";
import QuotePage from "./pages/QuotePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const PARTS_URL = "https://gseparts.us";

const PartsRedirect = () => {
  window.location.replace(PARTS_URL);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <I18nProvider>
          <QuoteProvider>
          <Routes>
            <Route element={<SgsLayout />}>
              <Route index element={<Index />} />
              <Route path="equipos" element={<Equipos />} />
              <Route path="equipos/:id" element={<EquipmentDetail />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="servicios" element={<Servicios />} />
              <Route path="servicios/reparacion" element={<RepairServices />} />
              <Route path="repair-services" element={<Navigate to="/servicios/reparacion" replace />} />
              <Route path="parts" element={<PartsRedirect />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="contacto" element={<Contacto />} />
              <Route path="solicitud-cotizacion" element={<QuotePage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          </QuoteProvider>
        </I18nProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
