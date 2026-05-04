import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SgsLayout } from "@/components/sgs/SgsLayout";
import { I18nProvider } from "@/lib/i18n";
import Index from "./pages/Index.tsx";
import Equipos from "./pages/Equipos.tsx";
import Categorias from "./pages/Categorias.tsx";
import Servicios from "./pages/Servicios.tsx";
import Nosotros from "./pages/Nosotros.tsx";
import Contacto from "./pages/Contacto.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <I18nProvider>
          <Routes>
            <Route element={<SgsLayout />}>
              <Route index element={<Index />} />
              <Route path="equipos" element={<Equipos />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="servicios" element={<Servicios />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="contacto" element={<Contacto />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </I18nProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
