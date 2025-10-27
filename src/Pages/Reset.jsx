import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Reset() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reset password email:', email);
  };

  const handleBackToSignIn = () => {
    console.log('Navigate to sign in');
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
            className="w-full bg-black text-white py-3 rounded-xl font-semibold text-xl hover:bg-gray-800 transition-colors"
          >
            Send Reset Link
          </button>
        </form>

        {/* Footer Buttons */}
        <div className="mt-10 text-center">
          <button
            onClick={handleBackToSignIn}
            className="text-gray-600 hover:text-gray-900 font-medium text-base transition-colors"
            href="/"          >
            Go to Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
