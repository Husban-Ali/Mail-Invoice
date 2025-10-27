import { createClient } from '@supabase/supabase-js'

// Frontend expects Vite env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (!supabaseUrl || !supabaseAnonKey) {
	// don't throw here so the app can render; provide a stub that surfaces
	// a clearer message when used.
	console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Supabase features will be disabled until these are configured.');

	supabase = {
		auth: {
			signInWithOAuth: async () => {
				throw new Error('Supabase is not configured (missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY). See .env.example for required values.');
			}
		}
	}
} else {
	supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }
export default supabase

// If supabase is configured, listen for auth state changes and persist session
if (supabase && supabase.auth && supabase.auth.onAuthStateChange) {
	supabase.auth.onAuthStateChange((event, session) => {
		try {
			if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
				localStorage.setItem('session', JSON.stringify(session))
				localStorage.setItem('isLoggedIn', 'true')
			} else if (event === 'SIGNED_OUT') {
				localStorage.removeItem('session')
				localStorage.removeItem('isLoggedIn')
			}
			// notify other parts of the app (Navbar)
			window.dispatchEvent(new Event('auth-change'))
		} catch (e) {
			// ignore storage errors
		}
	})
}
