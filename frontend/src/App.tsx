import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthCallback } from "./pages/AuthCallback";
import { AuthProvider } from "@/contexts/AuthContext";
import { SignInModalProvider } from "@/contexts/SignInModalContext";
import { MealPlannerModalProvider } from "@/contexts/MealPlannerModalContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SignInModalProvider>
          <MealPlannerModalProvider>
            <FavoritesProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </FavoritesProvider>
          </MealPlannerModalProvider>
        </SignInModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
