
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DataProvider } from "./contexts/DataContext";
import { AppSidebar } from "./components/AppSidebar";
import Upload from "./pages/Upload";
import GestaoLaudos from "./pages/GestaoLaudos";
import GestaoEstoque from "./pages/GestaoEstoque";
import CheckList from "./pages/CheckList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b px-6 bg-background">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/65ac0d2c-d82d-4a9d-8b11-a5088ebeceec.png" 
                alt="JC Transportes Logo" 
                className="h-8 w-8"
              />
              <h1 className="font-bold text-lg">Indicadores JC Transportes</h1>
            </div>
          </header>
          <main className="flex-1 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/gestao-laudos" element={<DashboardLayout><GestaoLaudos /></DashboardLayout>} />
            <Route path="/gestao-estoque" element={<DashboardLayout><GestaoEstoque /></DashboardLayout>} />
            <Route path="/checklist" element={<DashboardLayout><CheckList /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
