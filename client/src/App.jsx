import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { SiteSearchModal } from './components/SiteSearchModal';
import { BackToTop } from './components/BackToTop';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { FloatingContact } from './components/FloatingContact';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Ambulances } from './pages/Ambulances';
import { AmbulanceDetails } from './pages/AmbulanceDetails';
import { BookingForm } from './pages/BookingForm';
import { MyBookings } from './pages/MyBookings';
import { DriverDashboard } from './pages/DriverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { HowItWorks } from './pages/HowItWorks';
import { Safety } from './pages/Safety';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { NotFound } from './pages/NotFound';

export const App = () => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Expose global open helper for Ctrl+K
  window.openSiteSearch = () => setSearchModalOpen(true);

  return (
    <>
      {/* Skip to Content Accessible Link (Enhancement #12) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Scroll Progress Bar (Enhancement #8) */}
      <ScrollProgressBar />

      {/* Main Navigation Header */}
      <Navbar onOpenSearch={() => setSearchModalOpen(true)} />

      {/* Semantic Main Content Landmark */}
      <main id="main-content" className="main-content">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/ambulances" element={<Ambulances />} />
          <Route path="/ambulances/:id" element={<AmbulanceDetails />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Patient Routes */}
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected Driver Routes */}
          <Route
            path="/driver-dashboard"
            element={
              <ProtectedRoute allowedRoles={['DRIVER', 'ADMIN']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Emergency Helplines Widget (Enhancement #20) */}
      <FloatingContact />

      {/* Back to Top Smooth Scroll (Enhancement #4) */}
      <BackToTop />

      {/* Cookie Consent Notice (Enhancement #2) */}
      <CookieBanner />

      {/* Site-wide Search Dialog (Enhancement #3) */}
      <SiteSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
};
