import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

let currentSession = null;
let ready = false;
let resolveReady;
const readyPromise = new Promise((resolve) => { resolveReady = resolve; });

async function initAuth() {
  try {
    if (!supabase || !supabase.auth || !supabase.auth.getSession) {
      // No supabase configured; treat as ready with no session
      ready = true; if (resolveReady) resolveReady();
      return;
    }
    const { data } = await supabase.auth.getSession();
    currentSession = data?.session || null;
    // Important: Do NOT clear existing session on initial null (race on refresh).
    // Instead, fall back to whatever we have in storage.
    if (!currentSession) {
      try {
        // 1) Our app's persisted session
        const sessionStr = localStorage.getItem('session');
        if (sessionStr) {
          currentSession = JSON.parse(sessionStr);
        } else {
          // 2) Supabase default key
          const keys = Object.keys(localStorage || {});
          const authKey = keys.find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
          if (authKey) {
            const raw = localStorage.getItem(authKey);
            if (raw) {
              const parsed = JSON.parse(raw);
              // normalize to a session-ish shape
              const token = parsed?.access_token || parsed?.currentSession?.access_token || parsed?.data?.session?.access_token;
              if (token) currentSession = parsed.currentSession || parsed.data?.session || { access_token: token };
            }
          }
        }
        // Do not remove any keys here; defer removal to explicit SIGNED_OUT events.
      } catch {}
    } else {
      // We have a concrete session; persist it
      try {
        localStorage.setItem('session', JSON.stringify(currentSession));
        localStorage.setItem('isLoggedIn', 'true');
      } catch {}
    }
  } catch {}
  finally {
    ready = true; if (resolveReady) resolveReady();
    try { window.dispatchEvent(new Event('auth-ready')); } catch {}
  }
}

// kick off initialization immediately
initAuth();

// Keep session in sync on changes
if (supabase && supabase.auth && supabase.auth.onAuthStateChange) {
  try {
    supabase.auth.onAuthStateChange((event, session) => {
      // Only clear storage on explicit SIGNED_OUT. INITIAL_SESSION with null should not wipe our fallback.
      currentSession = session || currentSession || null;
      try {
        if (session) {
          localStorage.setItem('session', JSON.stringify(session));
          localStorage.setItem('isLoggedIn', 'true');
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('session');
          localStorage.removeItem('isLoggedIn');
        }
      } catch {}
      try { window.dispatchEvent(new Event('auth-change')); } catch {}
      if (!ready) { ready = true; if (resolveReady) resolveReady(); }
    });
  } catch {}
}

export function waitForAuthReady() {
  return ready ? Promise.resolve() : readyPromise;
}

export function getCurrentSession() {
  return currentSession;
}

export function isAuthReady() {
  return ready;
}

export function useAuthReady() {
  const [state, setState] = useState({ ready, session: currentSession });
  useEffect(() => {
    let mounted = true;
    const update = () => { if (mounted) setState({ ready, session: currentSession }); };
    const onReady = () => update();
    const onChange = () => update();
    waitForAuthReady().then(onReady);
    window.addEventListener('auth-ready', onReady);
    window.addEventListener('auth-change', onChange);
    return () => { mounted = false; window.removeEventListener('auth-ready', onReady); window.removeEventListener('auth-change', onChange); };
  }, []);
  return state;
}

export function hasStoredSupabaseToken() {
  try {
    const keys = Object.keys(localStorage || {});
    const authKey = keys.find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (!authKey) return false;
    const raw = localStorage.getItem(authKey);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!(
      parsed?.access_token ||
      parsed?.currentSession?.access_token ||
      parsed?.data?.session?.access_token
    );
  } catch {
    return false;
  }
}

export async function resolveAccessToken() {
  // Mirrors api.js logic but safe to call from the router guard
  try {
    // Ask Supabase first
    if (supabase && supabase.auth && supabase.auth.getSession) {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) return token;
    }
    // App's persisted session
    const sessionStr = localStorage.getItem('session');
    if (sessionStr) {
      const sess = JSON.parse(sessionStr);
      if (sess?.access_token) return sess.access_token;
      if (sess?.currentSession?.access_token) return sess.currentSession.access_token;
      if (sess?.data?.session?.access_token) return sess.data.session.access_token;
    }
    // Supabase default key
    const keys = Object.keys(localStorage || {});
    const authKey = keys.find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (authKey) {
      const raw = localStorage.getItem(authKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.access_token) return parsed.access_token;
        if (parsed?.currentSession?.access_token) return parsed.currentSession.access_token;
        if (parsed?.data?.session?.access_token) return parsed.data.session.access_token;
      }
    }
  } catch {}
  return null;
}

export default { waitForAuthReady, getCurrentSession, isAuthReady, useAuthReady };
