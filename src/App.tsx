import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import KioskDetail from './pages/KioskDetail';
import Dashboard from './pages/Dashboard';
import CreateKiosk from './pages/CreateKiosk';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'tenant' | 'owner' }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (role && profile && profile.role !== role) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/kiosk/:id" element={<KioskDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Private Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/bookings" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/favorites" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* Owner Only */}
              <Route path="/owner/create" element={<ProtectedRoute role="owner"><CreateKiosk /></ProtectedRoute>} />
              
              {/* Fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
