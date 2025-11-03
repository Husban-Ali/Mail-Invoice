import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

export default function Reset() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setSending(true);
    try {
      const redirectTo = `${window.location.origin}/reset-update`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) throw resetError;
      setMessage('Reset link sent. Please check your email.');
    } catch (err) {
      setError(err?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleBackToSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-16">
        {/* Heading */}
        <div className="text-center mb-6">
          {/* Mail Invoices */}
          <h2 className="font-inter font-bold text-[30px] leading-[38px] tracking-normal mb-8">
            Mail Invoices
          </h2>

          {/* Forgot Password */}
          <p className="font-inter font-semibold text-[24px] leading-[32px] tracking-normal text-center mb-4">
            Forgot password?
          </p>

          {/* Description */}
          <p className="font-inter font-normal text-[20px] leading-[24px] tracking-normal text-center text-gray-600 max-w-xl mx-auto">
            Enter your email address and we'll send a link to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-3">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className={`w-full bg-black text-white py-3 rounded-xl font-semibold text-xl hover:bg-gray-800 transition-colors ${sending ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {sending ? 'Sending…' : 'Send Reset Link'}
          </button>

          {message && <p className="text-green-600 mt-2">{message}</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        {/* Footer Buttons */}
        <div className="mt-10 text-center">
          <button
            onClick={handleBackToSignIn}
            className="text-gray-600 hover:text-gray-900 font-medium text-base transition-colors"
          >
            Go to Sign in
          </button>
          <div className="mt-2 text-sm">
            Or <Link to="/login" className="text-black hover:underline">back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
