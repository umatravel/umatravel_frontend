import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Layout } from './components/layout/Layout.jsx';

import { Home } from './pages/Home.jsx';
import { Packages } from './pages/Packages.jsx';
import { PackageDetail } from './pages/PackageDetail.jsx';
import { PackageBook } from './pages/PackageBook.jsx';
import { Stories } from './pages/Stories.jsx';
import { StoryDetail } from './pages/StoryDetail.jsx';
import { About } from './pages/About.jsx';
import { Contact } from './pages/Contact.jsx';
import { AdminLogin } from './pages/AdminLogin.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { AdminLayout } from './pages/admin/AdminLayout.jsx';
import { Dashboard } from './pages/admin/Dashboard.jsx';
import { Bookings } from './pages/admin/Bookings.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="packages" element={<Packages />} />
            <Route path="packages/:slug" element={<PackageDetail />} />
            <Route path="packages/:slug/book" element={<PackageBook />} />
            <Route path="stories" element={<Stories />} />
            <Route path="stories/:slug" element={<StoryDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin/login" element={<AdminLogin />} />
          </Route>

          {/* Dedicated Admin Portal Layout & Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="packages" element={<AdminDashboard defaultTab="packages" />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="stories" element={<AdminDashboard defaultTab="stories" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
