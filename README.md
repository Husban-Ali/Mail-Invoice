# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend (Express + Supabase + Google OAuth)

The backend lives in `Backend/` and provides:

- Auth endpoints: `POST /api/auth/signup`, `POST /api/auth/login`
- Optional Google OAuth: `GET /api/auth/google` (only if Google env vars set)
- Google status endpoint: `GET /api/auth/google/status` returns `{ enabled, missing, ... }`
- Invoices endpoints: `GET /api/invoices`, `GET /api/invoices/:id`, `POST /api/invoices/fetch`
- Health check: `GET /healthz`

### Environment Variables

Create `Backend/.env` (or project root `.env`). Loader checks root first, then `Backend/.env`.

Required:
```
SUPABASE_URL=... (Project URL from Supabase settings)
SUPABASE_ANON_KEY=... (Anon public key)
```
Optional (recommended):
```
SUPABASE_SERVICE_ROLE_KEY=... (Service role for privileged operations)
```
Google OAuth (optional):
```
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
# GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback (defaults if unset)
```

See `Backend/.env.example` for a template.

### Running the Backend

From `Backend/` directory:
```
pnpm install # or npm install / yarn
pnpm run dev  # or npm run dev
```
Navigate to `http://localhost:3000/healthz` to verify.

### Testing Google Configuration

After starting server:
```
node test-google.js
```
Output indicates whether Google OAuth is enabled and which vars are missing.

### Setting up Google OAuth Credentials

1. Go to Google Cloud Console -> Credentials -> Create OAuth Client ID.
2. Application type: Web application.
3. Authorized JavaScript origins: `http://localhost:3000` (and your prod domain later).
4. Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback` (or your custom callback if you override `GOOGLE_CALLBACK_URL`).
5. Copy Client ID and Secret into `.env`.
6. Restart backend, then hit `/api/auth/google/status` to confirm `enabled: true`.

### Troubleshooting

- If `enabled` is false, ensure no stray spaces or quotes in `.env` values.
- Confirm `.env` is in `Backend/` or project root and server restarted after changes.
- Check console startup logs for `[passport] Google strategy enabled`.
- If callback mismatch error: update Google Console redirect URI to match your configured `GOOGLE_CALLBACK_URL`.

### Security Notes

- Never commit real secrets. Use `.env.example` for placeholders.
- Use a strong `SESSION_SECRET` in production (set `SESSION_SECRET` env var; defaults currently hard-coded; replace it!).
- Prefer HTTPS in production; update callback URLs accordingly.

## Frontend ↔ Backend Integration

## Purpose & Outcomes (Version 1 — 01.09.2025)

This project implements an invoice ingestion and automation platform. The intended outcomes are:

- Connect to one or more email accounts (Gmail, Outlook/Microsoft 365, generic IMAP).
- Detect invoices in incoming mail, classify each as an e-invoice (XML formats such as XRechnung/Factur-X/ZUGFeRD) or PDF invoice, extract key data, and store results.
- Provide a Supplier Directory (company name, address, country, VAT ID, contacts, email) built from invoices + emails with de-duplication, validation, and audit.
- Label/folder messages automatically and optionally forward them (e.g., to bookkeeping).
- Offer customizable exports (per-screen data and supplier master data) plus two standard “export everything” presets.
- Full audit trail, role-based access, scheduling, and idempotent operations.

Use this README to find quick setup and integration steps — the UI copy and API are aligned to these goals.


The frontend now communicates with the backend through a small API layer located at `src/lib/api.js`.

### Configure Environment

Copy `Mail-Invoice/.env.example` to `Mail-Invoice/.env` and adjust:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_SUPABASE_URL=... (optional if using Supabase auth)
VITE_SUPABASE_ANON_KEY=...
```

Restart the Vite dev server after changes.

### Available API Helpers (`src/lib/api.js`)
- `signup({ name, email, password })`
- `login({ email, password })`
- `googleStatus()` -> `{ enabled, missing }`
- `startGoogleOAuth()` -> redirects browser
- `fetchInvoices()` -> array of invoices
- `triggerImapFetch()` -> POST to start IMAP ingestion

### Auth Pages
`Login.jsx` and `Signup.jsx` now use the shared API helpers. Google button in Login dynamically disables if backend Google OAuth not configured.

### Invoices
`RecentInvoicesTable.jsx` fetches invoices on mount and shows loading / error / empty states.

### Testing End-to-End
1. Start backend: `cd Backend && npm run dev`
2. Start frontend: `cd Mail-Invoice && npm run dev`
3. Visit `http://localhost:5173` (or Vite's shown port)
4. Sign up then log in; check browser DevTools network calls to `/api/auth/*` hitting backend base.
5. Open dashboard to see recent invoices table request to `/api/invoices`.

### Common Issues
| Symptom | Cause | Fix |
|--------|-------|-----|
| 404 on /api/auth/login | Wrong `VITE_API_BASE_URL` | Ensure it matches backend port (default 3000) |
| CORS error | Backend not allowing origin | Confirm `cors()` is applied (it is) and ports correct |
| Google button disabled | Missing Google env vars | Set `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` then restart backend |
| Invoices empty | No data in Supabase invoices table | Insert sample rows or run IMAP fetch |

### Production Notes
- Set `VITE_API_BASE_URL` to your deployed backend (e.g., https://api.example.com)
- Enable HTTPS and secure cookies if you switch to cookie/session auth.
- Consider adding error boundary UI around networked components.
