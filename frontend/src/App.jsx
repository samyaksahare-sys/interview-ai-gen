import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';
import './index.css';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <BrowserRouter>
        {/* Background decorations */}
        <div className="bg-grid" />
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute><HomePage /></ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute><ReportPage /></ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute><HistoryPage /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1117',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />
      </BrowserRouter>
    </ClerkProvider>
  );
}
