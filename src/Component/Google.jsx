import React from 'react'
import { startGoogleOAuth } from '../lib/api'

export default function GoogleLoginButton({ children, className }) {
  const handleGoogle = () => {
    try {
      startGoogleOAuth();
    } catch (e) {
      // fallback: open the route directly
      window.open('/api/auth/google', '_self');
    }
  }

  return (
    <button onClick={handleGoogle} className={`${className || 'flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50 text-black font-semibold'}`}>
      {children || 'Continue with Google'}
    </button>
  )
}
