import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabaseClient';

export default function ResetUpdate() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!password || !confirm) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setUpdating(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setMessage('Password updated successfully. Redirecting to login...');
      // Optional: sign out recovery session
      try { await supabase.auth.signOut(); } catch {}
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err?.message || 'Failed to update password. Try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10">
        <h2 className="font-inter font-bold text-2xl mb-2 text-center">Set a new password</h2>
        <p className="text-gray-600 text-center mb-6">Enter your new password below.</p>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>
          <button
            type="submit"
            disabled={updating}
            className={`w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition ${updating ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {updating ? 'Updating…' : 'Update Password'}
          </button>
          {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
