import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import outloo from "../assets/outloo.png";
import { Link, useNavigate } from "react-router-dom";  // ✅ yeh import zaroori hai
import { login as apiLogin, googleStatus, startGoogleOAuth } from '../lib/api';
import Swal from 'sweetalert2';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    
    try {
      const session = localStorage.getItem('session');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (session || isLoggedIn === 'true') {
        navigate('/dashboard');
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // basic client-side validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email');
      return;
    }
    if (!password) {
      setError('Enter your password');
      return;
    }

    setLoading(true);
    try {
      const data = await apiLogin({ email, password });
      if (data) {
        // store session (if provided) and mark logged in
        if (data.session) {
          try { localStorage.setItem('session', JSON.stringify(data.session)); } catch {}
        }
        localStorage.setItem('isLoggedIn', 'true');
        // notify other components (e.g., navbar)
        try { window.dispatchEvent(new Event('auth-change')); } catch {}
        navigate('/dashboard');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      console.error(err);
      if (err?.status === 401) {
        setError('Invalid email or password');
      } else if (err?.status === 403 && err?.data?.code === 'email_not_confirmed') {
        setError('Please verify your email before logging in. Check your inbox.');
      } else {
        setError(err?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth support (check status once)
  const [googleEnabled, setGoogleEnabled] = useState(true);
  const [googleStatusData, setGoogleStatusData] = useState(null);
  useEffect(()=>{
    (async ()=>{
      try { const status = await googleStatus(); setGoogleStatusData(status); setGoogleEnabled(status.enabled); } catch { setGoogleEnabled(false); }
    })();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Title */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-sm text-gray-600 hover:text-gray-800">&larr; Back</button>
          <h2 className="font-inter font-bold text-[38px] text-center flex-1">
            Mail Invoices
          </h2>
          <div style={{width:40}} />
        </div>

        <p className="font-inter font-semibold text-[24px] text-center mb-6">
          Sign in
        </p>
        <p className="font-inter text-[20px] text-center mb-4">
          Enter your login details to sign in
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="flex justify-between items-center text-sm mt-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <a href="/reset" className="text-black hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>

        {/* Sign up */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account yet?{" "}
          <Link to="/signup" className="text-black font-medium hover:underline">
            Sign up
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t"></div>
          <span className="px-2 text-sm text-gray-400">Or continue with</span>
          <div className="flex-grow border-t"></div>
        </div>

        {/* Social Login */}
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => Swal.fire({
              title: 'Coming Soon!',
              text: 'Google login will be available soon.',
              icon: 'info',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            })} 
            className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50 text-black font-semibold text-[18px]"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
            Google
          </button>
          <button 
            onClick={() => Swal.fire({
              title: 'Coming Soon!',
              text: 'Outlook login will be available soon.',
              icon: 'info',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            })}
            className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50 text-black font-semibold  text-[18px] "
          >
            <img src={outloo} alt="Outlook" className="w-5 h-5" />
            Outlook
          </button>
          <button 
            onClick={() => Swal.fire({
              title: 'Coming Soon!',
              text: 'IMAP login will be available soon.',
              icon: 'info',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            })}
            className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50 text-black font-semibold  text-[18px]"
          >
            IMAP
          </button>
        </div>
      </div>
    </div>
  );
}