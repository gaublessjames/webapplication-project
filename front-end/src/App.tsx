import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Reservations from "./pages/Reservations";
import Auth from "./pages/Auth";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Policies from "./pages/Policies";
import Dashboard from "./pages/Dashboard";
import MyReservations from "./pages/MyReservations";
import NotFound from "./pages/NotFound";
import CancelReservation from "./pages/CancelReservation";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/cancel-reservation/:id" element={<CancelReservation />} />
          <Route path="/cancel-reservation" element={<CancelReservation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
