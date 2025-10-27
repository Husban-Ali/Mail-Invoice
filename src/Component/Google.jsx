import React from 'react'
import { showComingSoon } from '../lib/sweetAlert'

export default function GoogleLoginButton({ children }) {
  const handleGoogle = () => {
    showComingSoon('Login with Google')
  }

  return (
    <button onClick={handleGoogle} className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50 text-black font-semibold">
      {children || 'Continue with Google'}
    </button>
  )
}
