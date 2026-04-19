import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import KioskDetail from './pages/KioskDetail';
import Dashboard from './pages/Dashboard';
import CreateKiosk from './pages/CreateKiosk';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/kiosk/:id" element={<KioskDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/bookings" element={<Dashboard />} />
            <Route path="/dashboard/favorites" element={<Dashboard />} />
            <Route path="/owner/create" element={<CreateKiosk />} />
            
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}
