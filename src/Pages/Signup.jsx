import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GoogleLoginButton from "../Component/Google.jsx";
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2 } from "lucide-react";
import { signup as apiSignup } from '../lib/api';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const session = localStorage.getItem('session');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (session || isLoggedIn === 'true') {
        navigate('/dashboard');
      }
    } catch (e) {
      // ignore
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    if (!agreedToTerms) {
      setErrors({ terms: 'You must agree to the terms and privacy policy' });
      return;
    }

    // Client-side validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiSignup(formData);
      if (data) {
        window.location.href = "/login";
      } else {
        setErrors({ server: 'Signup failed' });
      }
    } catch (error) {
      console.error(error);
      setErrors({ server: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 bg-black text-white p-12 flex flex-col justify-between rounded-none">
        <div>
          <div className="mb-12">
            <Mail className="w-12 h-12" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
            Discover a world of <br />
            possibilities tailored just <br />
            for you.
          </h1>

          <div className="space-y-4">
            {[
              "Gain access to powerful tools and resources designed to enhance your experience.",
              "Be the first to know about new features, updates, and special events.",
              "Connect with other users and share insights, tips, and experiences.",
              "We prioritize your security and privacy, with industry-leading protections. Your information is safe with us!",
            ].map((text, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
                <p className="text-gray-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-400 mt-4">
          Have questions? Visit our{" "}
          <span className="text-white font-medium cursor-pointer hover:underline">
            Help Center
          </span>{" "}
          or reach out to our{" "}
          <span className="text-white font-medium cursor-pointer hover:underline">
            Support Team
          </span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-white h-screen flex items-center justify-center p-12 rounded-none lg:rounded-r-2xl">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="text-sm text-gray-600 hover:text-gray-800">&larr; Back</button>
            <div className="text-center flex-1">
              <h2 className="font-bold text-3xl lg:text-4xl mt-8">Mail Invoices</h2>
              <p className="font-semibold text-lg mt-2">Sign up</p>
              <p className="text-base text-gray-600 mt-1">
                Enter your details to sign up
              </p>
            </div>
            <div style={{width:40}} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
              />
              <label htmlFor="terms">
                I agree with{" "}
                <span className="font-medium cursor-pointer hover:underline">
                  Terms
                </span>{" "}
                and{" "}
                <span className="font-medium cursor-pointer hover:underline">
                  Privacy policy
                </span>
                .
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Signing up...' : 'Sign up'}
            </button>
            {errors.server && <p className="text-red-500 text-sm mt-2">{errors.server}</p>}
            {errors.terms && <p className="text-red-500 text-sm mt-2">{errors.terms}</p>}
          </form>

          {/* Or sign up with */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLoginButton className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Google</GoogleLoginButton>
            </div>

            {/* Already have account */}
            <div className="text-center text-sm mt-8">
              <span className="text-gray-600">Already have an account? </span>
              <a href="/login" className="font-medium hover:underline">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
