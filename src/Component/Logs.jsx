import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRetrievalLogs } from "../lib/api";

const Logs = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await getRetrievalLogs();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load logs');
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{t("logs.title")}</h3>
        <button className="text-sm text-gray-700 border px-3 py-1 rounded" onClick={load} disabled={loading}>{loading ? t('loading','Loading…') : t('refresh','Refresh')}</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-3">{t("logs.timings")}</th>
              <th className="py-2 px-3">{t("logs.provider")}</th>
              <th className="py-2 px-3">{t("logs.status")}</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr><td colSpan={3} className="py-3 px-3 text-red-600">{error}</td></tr>
            )}
            {!error && rows.length === 0 && !loading && (
              <tr><td colSpan={3} className="py-3 px-3 text-gray-600">{t('noData','No data')}</td></tr>
            )}
            {!error && rows.map((log, idx) => {
              const time = log.created_at ? new Date(log.created_at).toLocaleString() : '-';
              const provider = log.provider || 'IMAP';
              const status = log.status === 'ok' ? t('logs.success', { count: log.fetched || 0 }) : (log.error || t('logs.error'));
              return (
                <tr key={idx} className="border-t border-gray-200">
                  <td className="py-2 px-3">{time}</td>
                  <td className="py-2 px-3">{provider}</td>
                  <td className="py-2 px-3 text-gray-700">{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;
