import React from 'react'
import { showComingSoon } from '../lib/sweetAlert'

export default function OutlookLoginButton({ children }) {
  const handleOutlook = () => {
    showComingSoon('Login with Outlook')
  }

  return (
    <button onClick={handleOutlook} className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50 text-black font-semibold">
      {children || 'Continue with Outlook'}
    </button>
  )
}
