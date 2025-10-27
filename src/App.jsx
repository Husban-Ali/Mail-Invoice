import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login.jsx";
import Reset from "./Pages/Reset.jsx";
import SignUpPage from "./Pages/Signup.jsx";
import MailInvoiceDashboard from "./Component/MailInvoiceDashboard.jsx";
import Home from "./Pages/Home.jsx"; 
import About from "./Pages/About.jsx";
import Resources from "./Pages/Resources.jsx";
import Features from "./Pages/Features.jsx";
import Contact from "./Pages/Contact.jsx";
import PublicLayout from "./Component/PublicLayout.jsx";
import "./Language/i18n.js"
import { useAuthReady, hasStoredSupabaseToken, resolveAccessToken, waitForAuthReady } from './lib/authSession';

function App() {
  // Client-side guard: trusts localStorage and also honors Google OAuth callback params
  const RequireAuth = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { ready, session } = useAuthReady();
    const [checking, setChecking] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
      let cancelled = false;
      const run = async () => {
        setChecking(true);
        // 1) Wait for Supabase initialization on hard refresh
        try { await waitForAuthReady(); } catch {}

        // 2) Start with current known session
        let isLoggedIn = !!session;

        // 3) Handle Google OAuth callback (auth=google&ok=1)
        try {
          const params = new URLSearchParams(location.search || '');
          const fromGoogle = params.get('auth') === 'google' && params.get('ok') === '1';
          if (fromGoogle) {
            localStorage.setItem('isLoggedIn', 'true');
            try { window.dispatchEvent(new Event('auth-change')); } catch {}
            if (location.search) navigate(location.pathname, { replace: true });
            isLoggedIn = true;
          }
        } catch {}

        // 4) Check legacy/local flags and Supabase token presence
        try {
          const legacySession = localStorage.getItem('session');
          if (!isLoggedIn) isLoggedIn = !!legacySession || localStorage.getItem('isLoggedIn') === 'true';
          if (!isLoggedIn && hasStoredSupabaseToken()) isLoggedIn = true;
        } catch {}

        // 5) If still not certain, try to resolve an access token now (and retry briefly once)
        if (!isLoggedIn) {
          let token = await resolveAccessToken();
          if (!token) {
            await new Promise(r => setTimeout(r, 350));
            token = await resolveAccessToken();
          }
          if (token) isLoggedIn = true;
        }

        if (!cancelled) {
          setAllowed(!!isLoggedIn);
          setChecking(false);
        }
      };
      run();
      return () => { cancelled = true; };
    }, [ready, session, location.pathname, location.search, navigate]);

    if (checking) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          <div className="animate-pulse">Loading…</div>
        </div>
      );
    }

    if (!allowed) return <Navigate to="/login" replace />;
    return children;
  };
  return (
    <Router>
      <Routes>
        {/* Auth routes WITHOUT navbar/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset" element={<Reset />} />

        {/* Public routes wrapped with Navbar (top) and Footer (bottom) */}
        <Route element={<PublicLayout />}> 
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* App route with its own dashboard layout */}
        <Route path="/dashboard" element={<RequireAuth><MailInvoiceDashboard /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
