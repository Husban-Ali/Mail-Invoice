import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRetrievalLogs } from "../lib/api";
import { RefreshCw, CheckCircle, XCircle, Clock, Mail } from "lucide-react";

const Logs = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [filter, setFilter] = useState('all'); // all, success, error

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRetrievalLogs();
      const logs = Array.isArray(data) ? data : [];
      setRows(logs);
    } catch (e) {
      setError(e.message || 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusBadge = (log) => {
    if (log.status === 'ok') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
          <CheckCircle size={14} />
          Success ({log.fetched || 0} items)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
        <XCircle size={14} />
        Error
      </span>
    );
  };

  const filteredRows = rows.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'success') return log.status === 'ok';
    if (filter === 'error') return log.status === 'error';
    return true;
  });

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg lowercase">{t("logs.title", "Retrieval Logs")}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {filteredRows.length} {filteredRows.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filter Buttons */}
          <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded cursor-pointer transition ${
                filter === 'all' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-3 py-1 text-xs rounded cursor-pointer transition ${
                filter === 'success' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Success
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-3 py-1 text-xs rounded cursor-pointer transition ${
                filter === 'error' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Errors
            </button>
          </div>

          {/* Auto-refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 text-xs rounded border cursor-pointer transition ${
              autoRefresh
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
            title="Auto-refresh every 30s"
          >
            <Clock size={14} className={autoRefresh ? 'animate-pulse' : ''} />
          </button>

          {/* Refresh Button */}
          <button
            className="text-sm text-gray-700 border border-gray-200 px-3 py-1 rounded cursor-pointer hover:bg-gray-50 transition flex items-center gap-1.5"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? t('loading', 'Loading…') : t('refresh', 'Refresh')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left border-b border-gray-200">
              <th className="py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  {t("logs.timings", "Time")}
                </div>
              </th>
              <th className="py-3 px-4 font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  {t("logs.account", "Account")}
                </div>
              </th>
              <th className="py-3 px-4 font-medium text-gray-700">{t("logs.status", "Status")}</th>
              <th className="py-3 px-4 font-medium text-gray-700">{t("logs.details", "Details")}</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr>
                <td colSpan={4} className="py-4 px-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle size={16} />
                    {error}
                  </div>
                </td>
              </tr>
            )}
            {loading && !error && (
              <tr>
                <td colSpan={4} className="py-8 px-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <RefreshCw size={16} className="animate-spin" />
                    {t('loading', 'Loading logs...')}
                  </div>
                </td>
              </tr>
            )}
            {!error && !loading && filteredRows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                  {filter === 'all' 
                    ? t('noData', 'No logs available. Run a retrieval to see logs here.')
                    : `No ${filter} logs found.`
                  }
                </td>
              </tr>
            )}
            {!error && !loading && filteredRows.map((log, idx) => {
              const time = formatDate(log.created_at);
              const email = log.email || 'Unknown';
              const details = log.status === 'ok' 
                ? `Retrieved ${log.fetched || 0} invoice(s)`
                : log.error || 'Unknown error';

              return (
                <tr key={log.id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{time}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                        {email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-700 font-medium">{email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(log)}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs">
                    {log.status === 'error' ? (
                      <span className="text-red-600">{details}</span>
                    ) : (
                      <span>{details}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {!loading && !error && filteredRows.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-green-600" />
              {rows.filter(l => l.status === 'ok').length} successful
            </span>
            <span className="flex items-center gap-1">
              <XCircle size={12} className="text-red-600" />
              {rows.filter(l => l.status === 'error').length} failed
            </span>
          </div>
          <span>Showing {filteredRows.length} of {rows.length} logs</span>
        </div>
      )}
    </div>
  );
};

export default Logs;
