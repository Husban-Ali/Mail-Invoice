import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { listAccounts } from '../lib/api';
import { fetchImapInvoices } from '../lib/api';
import { showLoading, closeLoading, showSuccess, showError } from '../lib/sweetAlert';
import ConnectNewAccount from './ConnectNewAccount';

function Connect() {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [showWizard, setShowWizard] = useState(false);

  const onConnectMailbox = async () => {
    setMsg(''); setBusy(true);
    // show non-blocking loading toast
    showLoading('Fetching invoices...');
    try {
      // 1) Load saved accounts
      const accounts = await listAccounts();
      if (!Array.isArray(accounts) || accounts.length === 0) {
        // No accounts: open the wizard inline so the user can connect immediately
        setShowWizard(true);
        closeLoading();
        return;
      }
      // Prefer an account that has stored IMAP meta (host/port/password)
      const account = accounts.find(a => a?.meta?.host && a?.meta?.port && a?.meta?.password) || accounts[0];
      if (!account?.meta?.password) {
        setMsg('Saved account missing IMAP password. Please reconnect using the wizard.');
        setShowWizard(true);
        closeLoading();
        return;
      }
      // 2) Trigger fetch by accountId with safe defaults
      await fetchImapInvoices({
        accountId: account.id,
        folder: 'INBOX',
        unseenOnly: true,
        sinceDays: 7,
      });
      closeLoading();
      setMsg('Fetch complete. Refreshing invoices...');
      showSuccess('Fetch complete. Refreshing invoices...');
      // 3) Ask listening components to refresh
      try { window.dispatchEvent(new CustomEvent('invoices:refresh')); } catch {}
    } catch (e) {
      closeLoading();
      setMsg(e?.message || 'Failed to start fetch');
      showError(e?.message || 'Failed to start fetch');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 lowercase shadow-sm border border-gray-200 flex items-center justify-between mb-2 relative">
      {/* Left Button */}
      <button onClick={onConnectMailbox} disabled={busy} className={`px-4 py-2 text-sm  lowercase text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition ${busy ? 'opacity-60 cursor-not-allowed' : ''}`}>
        {t("connect.connectMailbox")}
      </button>

      {/* Right Button */}
      <button className="px-4 py-2 text-sm bg-black lowercase  text-white rounded-lg hover:bg-gray-800 transition">
        {t("connect.addRule")}
      </button>
      {msg && <div className="text-xs text-gray-600 mt-2">{msg}</div>}

      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold">Connect New Account</h4>
              <button onClick={() => setShowWizard(false)} className="text-sm text-gray-600 hover:text-gray-800">Close</button>
            </div>
            <ConnectNewAccount onCompleted={() => {
              // After wizard finishes, close and refresh invoices
              setShowWizard(false);
              try { window.dispatchEvent(new CustomEvent('invoices:refresh')); } catch {}
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Connect;
