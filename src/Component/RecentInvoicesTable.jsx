import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchInvoices } from '../lib/api';

// Extract first email address from a string like "Name <user@domain>" or raw email
function extractEmail(str) {
  if (!str) return null;
  const m = String(str).match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return m ? m[0] : null;
}

function domainFromEmail(email) {
  if (!email) return null;
  const parts = String(email).split('@');
  return parts[1] || null;
}

// Normalize backend invoice (which currently stores from_addr, subject, filename, file_path, account_id)
function normalize(inv) {
  // try multiple shapes for email
  const email = inv.email || extractEmail(inv.from_addr) || inv.from_addr || '-';
  const company = inv.vendor || inv.company || inv.supplier || inv.merchant || domainFromEmail(email) || '-';
  // amount is not parsed from PDF yet; support several fields if backend adds later
  const rawAmount = inv.total ?? inv.amount ?? (typeof inv.amount_cents === 'number' ? inv.amount_cents / 100 : null);
  const amount = rawAmount !== null && rawAmount !== undefined ? Number(rawAmount).toFixed(2) : '-';
  // prefer explicit invoice id, else filename, else message id
  const id = inv.invoiceNumber || inv.invoice || inv.id || inv.filename || inv.message_id || '-';
  return { company, amount, id, email };
}

function RecentInvoicesTable() {
  const { t } = useTranslation();

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchInvoices();
        if (!cancelled) {
          const list = Array.isArray(data) ? data.slice(0,5) : [];
          setRecentInvoices(list.map(normalize));
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load invoices');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const handler = () => load();
    window.addEventListener('invoices:refresh', handler);
    return ()=>{ cancelled = true; window.removeEventListener('invoices:refresh', handler); };
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t("invoicesTable.title")}</h3>
        <button
          onClick={()=>window.dispatchEvent(new CustomEvent('invoices:refresh'))}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
        >
          {t('refresh','Refresh')}
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t("invoicesTable.company")}</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t("invoicesTable.amount")}</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t("invoicesTable.invoice")}</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">{t("invoicesTable.email")}</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan={4} className="py-4 px-4 text-center text-gray-500">{t('loading','Loading...')}</td></tr>
          )}
          {error && !loading && (
            <tr><td colSpan={4} className="py-4 px-4 text-center text-red-500">{error}</td></tr>
          )}
          {!loading && !error && recentInvoices.length === 0 && (
            <tr><td colSpan={4} className="py-4 px-4 text-center text-gray-500">{t('invoicesTable.noResults','No data found')}</td></tr>
          )}
          {!loading && !error && recentInvoices.map((invoice, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm text-gray-800">{invoice.company}</td>
              <td className="py-3 px-4 text-sm text-gray-800">{invoice.amount}</td>
              <td className="py-3 px-4 text-sm text-gray-800">{invoice.id}</td>
              <td className="py-3 px-4 text-sm text-gray-800">{invoice.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentInvoicesTable;
