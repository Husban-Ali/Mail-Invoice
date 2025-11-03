// Centralized API client for backend integration
import supabase from './supabaseClient';
import { waitForAuthReady } from './authSession';
// Reads base URL from Vite env (VITE_API_BASE_URL). If unset, attempt to infer.
const inferApiBase = () => {
  const explicit = import.meta.env.VITE_API_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  try {
    const { protocol, hostname } = window.location;
    // Prefer 8080 (backend), fallback 3000
    return `${protocol}//${hostname}:8080`;
  } catch {
    return 'hus-three.vercel.app';
  }
};

export const API_BASE = inferApiBase();

// Helper to get access token from Supabase session stored in localStorage
async function getAccessToken() {
  try {
    // 0) Preferred: ask Supabase client for the current session
    if (supabase && supabase.auth && supabase.auth.getSession) {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) return token;
    }
    // 1) Primary: our app persists full session at key 'session'
    const sessionStr = localStorage.getItem('session');
    if (sessionStr) {
      const sess = JSON.parse(sessionStr);
      if (sess?.access_token) return sess.access_token;
      if (sess?.currentSession?.access_token) return sess.currentSession.access_token;
      if (sess?.data?.session?.access_token) return sess.data.session.access_token;
    }

    // 2) Fallback: Supabase default key sb-<project-ref>-auth-token
    const keys = Object.keys(localStorage);
    const authKey = keys.find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (authKey) {
      const sessionData = localStorage.getItem(authKey);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (parsed?.access_token) return parsed.access_token;
        if (parsed?.currentSession?.access_token) return parsed.currentSession.access_token;
        if (parsed?.data?.session?.access_token) return parsed.data.session.access_token;
      }
    }

    return null;
  } catch (e) {
    console.warn('[api] Failed to retrieve access token:', e);
    return null;
  }
}

async function request(path, { method = 'GET', headers = {}, body, ...rest } = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };

  // Attach Authorization header with Supabase access token for all requests except auth endpoints
  if (!path.includes('/api/auth/')) {
    // Ensure auth is initialized before the very first call after refresh
    try { await waitForAuthReady(); } catch {}
    let token = await getAccessToken();
    // If session not yet restored (race on refresh), retry briefly once
    if (!token) {
      await new Promise(r => setTimeout(r, 350));
      token = await getAccessToken();
    }
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    ...rest,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore non-JSON responses
  }

  if (!res.ok) {
    const err = new Error((data && data.error) || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

//
// 🧠 AUTH APIs
//
export const signup = (payload) => request('/api/auth/signup', { method: 'POST', body: payload });
export const login = (payload) => request('/api/auth/login', { method: 'POST', body: payload });

export const googleStatus = async () => {
  try {
    return await request('/api/auth/google/status');
  } catch (e) {
    console.warn('[api] googleStatus failed:', e.message);
    throw e;
  }
};

export const startGoogleOAuth = async () => {
  // Use Supabase's built-in Google OAuth instead of custom backend implementation
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) {
      console.error('[oauth] Supabase Google OAuth error:', error);
      // Fallback to backend implementation
      window.open(`${API_BASE}/api/auth/google`, '_self');
    }
  } catch (err) {
    console.error('[oauth] Failed to initiate Google OAuth:', err);
    // Fallback to backend implementation
    window.open(`${API_BASE}/api/auth/google`, '_self');
  }
};

//
// 🧾 INVOICES APIs
//
export const fetchInvoices = () => request('/api/invoices');
export const fetchInvoice = (id) => request(`/api/invoices/${id}`);
export const triggerImapFetch = () => request('/api/invoices/fetch', { method: 'POST' });

// IMAP specific endpoints used by the connection wizard
export const testImapConnection = (payload) =>
  request('/api/invoices/test-connection', { method: 'POST', body: payload });

export const listImapFolders = async (email) => {
  // Some backends require only the email (using saved account meta).
  // If the endpoint isn't available, we fallback gracefully with common defaults.
  try {
    return await request(`/api/invoices/folders?email=${encodeURIComponent(email)}`);
  } catch (e) {
    console.warn('[api] listImapFolders fallback used:', e.message);
    return { folders: ['INBOX', 'Spam', 'Invoices'] };
  }
};

export const fetchImapInvoices = (payload) =>
  request('/api/invoices/fetch', { method: 'POST', body: payload });

//
// � DATA RETRIEVAL APIs
//
export const getRetrievalStatus = () => request('/api/retrieval/status');
export const setRetrievalStatus = (enabled) => request('/api/retrieval/status', { method: 'POST', body: { enabled } });
export const getRetrievalConfig = () => request('/api/retrieval/config');
export const setRetrievalConfig = (payload) => request('/api/retrieval/config', { method: 'POST', body: payload });
export const runRetrievalNow = () => request('/api/retrieval/run', { method: 'POST' });
export const getRetrievalLogs = () => request('/api/retrieval/logs');

//
// 👤 ACCOUNTS APIs
//
export const listAccounts = () => request('/api/accounts');
export const createAccount = (provider, email, meta = {}) =>
  request('/api/accounts', { method: 'POST', body: { provider, email, meta } });
export const deleteAccount = (id) =>
  request(`/api/accounts/${id}`, { method: 'DELETE' });

//
// 📊 SCRAPED DATA APIs
//
export const getScrapedInvoices = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.supplier && params.supplier !== 'All') {
    queryParams.append('supplier', params.supplier);
  }
  if (params.status && params.status !== 'All') {
    queryParams.append('status', params.status);
  }
  if (params.format && params.format !== 'All') {
    queryParams.append('format', params.format);
  }
  if (params.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  if (params.endDate) {
    queryParams.append('endDate', params.endDate);
  }
  if (params.limit) {
    queryParams.append('limit', params.limit);
  }
  if (params.offset) {
    queryParams.append('offset', params.offset);
  }
  
  const queryString = queryParams.toString();
  return request(`/api/scraped-data${queryString ? `?${queryString}` : ''}`);
};

export const getScrapedStats = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  if (params.endDate) {
    queryParams.append('endDate', params.endDate);
  }
  
  const queryString = queryParams.toString();
  return request(`/api/scraped-data/stats${queryString ? `?${queryString}` : ''}`);
};

export const getSuppliersList = () => request('/api/scraped-data/suppliers');

// Rules & Automation APIs
export const listRules = () => request('/api/rules');
export const createRule = (payload) => request('/api/rules', { method: 'POST', body: payload });
export const updateRule = (id, payload) => request(`/api/rules/${id}`, { method: 'PUT', body: payload });
export const deleteRules = (ids) => request('/api/rules/delete', { method: 'POST', body: { ids } });

// Suppliers (Master Data) APIs
export const listSuppliers = () => request('/api/suppliers');
export const getSupplier = (id) => request(`/api/suppliers/${id}`);
export const createSupplier = (payload) => request('/api/suppliers', { method: 'POST', body: payload });
export const updateSupplier = (id, payload) => request(`/api/suppliers/${id}`, { method: 'PUT', body: payload });
export const deleteSuppliers = (ids) => request('/api/suppliers/delete', { method: 'POST', body: { ids } });
export const mergeSuppliers = (ids, primaryId) => request('/api/suppliers/merge', { method: 'POST', body: { ids, primaryId } });
export const blockSuppliers = (ids) => request('/api/suppliers/block', { method: 'POST', body: { ids } });
export const activateSuppliers = (ids) => request('/api/suppliers/activate', { method: 'POST', body: { ids } });
export const deactivateSuppliers = (ids) => request('/api/suppliers/deactivate', { method: 'POST', body: { ids } });
export const getSupplierDuplicates = () => request('/api/suppliers/duplicates');
export const getSupplierReviewQueue = () => request('/api/suppliers/review-queue');
export const autoLinkSupplierInvoices = () => request('/api/suppliers/auto-link', { method: 'POST' });

// Supplier contacts
export const listSupplierContacts = (supplierId) => request(`/api/suppliers/${supplierId}/contacts`);
export const createSupplierContact = (supplierId, payload) => request(`/api/suppliers/${supplierId}/contacts`, { method: 'POST', body: payload });
export const updateSupplierContact = (contactId, payload) => request(`/api/suppliers/contacts/${contactId}`, { method: 'PUT', body: payload });
export const deleteSupplierContact = (contactId) => request(`/api/suppliers/contacts/${contactId}`, { method: 'DELETE' });

export const getScrapedInvoiceById = (id) => request(`/api/scraped-data/${id}`);

export const updateInvoiceStatus = (id, status) =>
  request(`/api/scraped-data/${id}/status`, { method: 'PATCH', body: { status } });

export const deleteScrapedInvoices = (ids) =>
  request('/api/scraped-data', { method: 'DELETE', body: { ids } });

export const exportScrapedInvoicesCSV = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.supplier && params.supplier !== 'All') {
    queryParams.append('supplier', params.supplier);
  }
  if (params.status && params.status !== 'All') {
    queryParams.append('status', params.status);
  }
  if (params.format && params.format !== 'All') {
    queryParams.append('format', params.format);
  }
  if (params.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  if (params.endDate) {
    queryParams.append('endDate', params.endDate);
  }
  
  const queryString = queryParams.toString();
  const url = `${API_BASE}/api/scraped-data/export/csv${queryString ? `?${queryString}` : ''}`;
  
  const headers = {};
  const token = await getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    method: 'GET',
    headers,
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error('Export failed');
  }
  
  return res.blob();
};

export const bulkUpdateScrapedInvoices = (ids, updates) =>
  request('/api/scraped-data/bulk', { method: 'PATCH', body: { ids, updates } });

// File upload helper (multipart form-data). Do NOT set Content-Type header manually.
export async function uploadFile(file, accountId) {
  const url = `${API_BASE}/api/uploads`;
  const fd = new FormData();
  fd.append('file', file);
  if (accountId) fd.append('accountId', accountId);

  const headers = {};
  const token = await getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: fd,
    credentials: 'include'
  });

  if (!res.ok) {
    let err = null;
    try { err = await res.json(); } catch {}
    throw new Error((err && err.error) || res.statusText || 'Upload failed');
  }

  return res.json();
}

// 📦 Exports APIs
export const listExportTemplates = () => request('/api/exports/templates');
export const createExportTemplate = (payload) => request('/api/exports/templates', { method: 'POST', body: payload });
export const updateExportTemplate = (id, payload) => request(`/api/exports/templates/${id}`, { method: 'PUT', body: payload });
export const deleteExportTemplate = (id) => request(`/api/exports/templates/${id}`, { method: 'DELETE' });

export const listExportRuns = () => request('/api/exports/runs');
export const getExportRun = (id) => request(`/api/exports/runs/${id}`);
export const runExportJob = (payload) => request('/api/exports/run', { method: 'POST', body: payload });
export const createExportPresets = () => request('/api/exports/presets', { method: 'POST' });

export const getExportDownloadUrl = (id) => `${API_BASE}/api/exports/runs/${id}/download`;

// Send invoice via email with attachment
export async function sendInvoiceEmail(invoiceData, formData) {
  const url = `${API_BASE}/api/invoices/send-email`;
  const fd = new FormData();
  fd.append('to', formData.to);
  fd.append('subject', formData.subject);
  fd.append('message', formData.message);
  fd.append('invoiceId', invoiceData._rawId || invoiceData.id);
  if (formData.file) {
    fd.append('file', formData.file);
  }

  const headers = {};
  const token = await getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: fd,
    credentials: 'include'
  });

  if (!res.ok) {
    let err = null;
    try { err = await res.json(); } catch {}
    throw new Error((err && err.error) || res.statusText || 'Failed to send email');
  }

  return res.json();
}

// User management API
export async function getUsers() {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/api/accounts/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function updateUserStatus(userId, status) {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/api/accounts/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

// User profile API
export async function getUserProfile() {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/api/accounts/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateUserProfile(profile) {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/api/accounts/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}
