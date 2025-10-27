import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { listAccounts, deleteAccount } from "../lib/api";

export default function ConnectedAccounts({ onConnectNew }) {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [error, setError] = useState(null);

  //  Load accounts from backend
  useEffect(() => {
    async function loadAccounts() {
      try {
        setLoading(true);
        const data = await listAccounts();
        // Expecting backend to return array like [{ provider, email, status, lastSync }]
        setAccounts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load accounts:", err);
        setError("Failed to load connected accounts.");
      } finally {
        setLoading(false);
      }
    }
    loadAccounts();
  }, []);

  // 🗑 Remove account (calls backend)
  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this account?")) return;
    try {
      await deleteAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Error removing account. Try again.");
    }
  };

  //  Status Color Helper
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "connected":
        return "text-green-600 font-semibold";
      case "error":
        return "text-red-600 font-semibold";
      case "pending":
        return "text-yellow-500 font-semibold";
      case "reconnect":
        return "text-blue-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600">
        {t("connectedAccounts.loading", "Loading accounts...")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        {t("connectedAccounts.error", "Failed to load accounts.")}
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl lowercase font-bold text-gray-800">
          {t("connectedAccounts.title", "Connected Accounts")}
        </h2>
        <button
          onClick={() => {
            setIsCompact(true);
            if (onConnectNew) onConnectNew();
          }}
          className="bg-black text-white lowercase px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {t("connectedAccounts.connectNew", "Connect New")}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg lowercase border border-gray-200 overflow-hidden">
        <div
          className={`overflow-x-auto lowercase ${
            isCompact ? "max-h-64 overflow-y-auto" : ""
          }`}
        >
          <table className="w-full">
            <thead className="bg-gray-50 lowercase border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-800 text-center">
                  {t("connectedAccounts.provider", "Provider")}
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-800 text-center">
                  {t("connectedAccounts.email", "Email")}
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-800 text-center">
                  {t("connectedAccounts.status", "Status")}
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-800 text-center">
                  {t("connectedAccounts.lastSync", "Last Sync")}
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-800 text-center">
                  {t("connectedAccounts.actions", "Actions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {accounts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-500 italic"
                  >
                    {t("connectedAccounts.noAccounts", "No accounts connected yet.")}
                  </td>
                </tr>
              ) : (
                accounts.map((account, index) => (
                  <tr key={account.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm lowercase text-gray-700 text-center">
                      {account.provider}
                    </td>
                    <td className="px-6 py-4 text-sm lowercase text-gray-700 text-center">
                      {account.email}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm lowercase text-center ${getStatusColor(
                        account.status
                      )}`}
                    >
                      {t(
                        `connectedAccounts.statuses.${account.status?.toLowerCase()}`,
                        account.status
                      )}
                    </td>
                    <td className="px-6 py-4 lowercase text-sm text-gray-500 text-center">
                      {account.lastSync || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center lowercase gap-4 justify-center">
                        <button
                          className="bg-black text-white lowercase px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-800"
                          onClick={() => alert("Reconnect logic coming soon")}
                        >
                          {t("connectedAccounts.reconnect", "Reconnect")}
                        </button>
                        <button
                          className="border border-gray-300 lowercase text-gray-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
                          onClick={() => handleRemove(account.id)}
                        >
                          {t("connectedAccounts.remove", "Remove")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
