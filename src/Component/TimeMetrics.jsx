import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getScrapedStats } from '../lib/api';

function startOfWeekISO(date) {
  // Monday as start of week
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 0=Mon
  d.setDate(d.getDate() - day);
  d.setHours(0,0,0,0);
  return d;
}

function startOfMonth(date) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0,0,0,0);
  return d;
}

function startOfYear(date) {
  const d = new Date(date);
  d.setMonth(0,1);
  d.setHours(0,0,0,0);
  return d;
}

function isoDate(d) {
  const dt = new Date(d);
  return dt.toISOString().split('T')[0];
}

function formatNumber(n) {
  if (n === null || n === undefined) return '—';
  return Number(n).toLocaleString();
}

function computeChange(current, previous) {
  if (previous === 0) return { text: previous === 0 && current > 0 ? `+100%` : '0%', trend: current >= previous ? 'up' : 'down' };
  const diff = current - previous;
  const pct = (diff / previous) * 100;
  const sign = pct >= 0 ? '+' : '';
  return { text: `${sign}${pct.toFixed(0)}%`, trend: pct >= 0 ? 'up' : 'down' };
}

function TimeMetrics() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({ week: null, month: null, year: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const now = new Date();

        // This week: from Monday of current week to today
        const thisWeekStart = startOfWeekISO(now);
        const thisWeekEnd = now;
        const prevWeekStart = new Date(thisWeekStart);
        prevWeekStart.setDate(prevWeekStart.getDate() - 7);
        const prevWeekEnd = new Date(thisWeekStart);
        prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);

        // This month: first of month to today
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = now;
        const prevMonthStart = new Date(thisMonthStart);
        prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
        const prevMonthEnd = new Date(thisMonthStart);
        prevMonthEnd.setDate(prevMonthEnd.getDate() - 1);

        // This year: Jan 1 to today
        const thisYearStart = startOfYear(now);
        const thisYearEnd = now;
        const prevYearStart = new Date(thisYearStart);
        prevYearStart.setFullYear(prevYearStart.getFullYear() - 1);
        const prevYearEnd = new Date(thisYearStart);
        prevYearEnd.setDate(prevYearEnd.getDate() - 1);

        // Parallel requests
        const [wCur, wPrev, mCur, mPrev, yCur, yPrev] = await Promise.all([
          getScrapedStats({ startDate: isoDate(thisWeekStart), endDate: isoDate(thisWeekEnd) }).catch(e=>({stats:{totalInvoices:0}})),
          getScrapedStats({ startDate: isoDate(prevWeekStart), endDate: isoDate(prevWeekEnd) }).catch(e=>({stats:{totalInvoices:0}})),
          getScrapedStats({ startDate: isoDate(thisMonthStart), endDate: isoDate(thisMonthEnd) }).catch(e=>({stats:{totalInvoices:0}})),
          getScrapedStats({ startDate: isoDate(prevMonthStart), endDate: isoDate(prevMonthEnd) }).catch(e=>({stats:{totalInvoices:0}})),
          getScrapedStats({ startDate: isoDate(thisYearStart), endDate: isoDate(thisYearEnd) }).catch(e=>({stats:{totalInvoices:0}})),
          getScrapedStats({ startDate: isoDate(prevYearStart), endDate: isoDate(prevYearEnd) }).catch(e=>({stats:{totalInvoices:0}})),
        ]);

        if (cancelled) return;

        const wkCur = Number(wCur?.stats?.totalInvoices || 0);
        const wkPrev = Number(wPrev?.stats?.totalInvoices || 0);
        const mnCur = Number(mCur?.stats?.totalInvoices || 0);
        const mnPrev = Number(mPrev?.stats?.totalInvoices || 0);
        const yrCur = Number(yCur?.stats?.totalInvoices || 0);
        const yrPrev = Number(yPrev?.stats?.totalInvoices || 0);

        setMetrics({
          week: { period: t('timeMetrics.thisWeek'), value: wkCur, change: computeChange(wkCur, wkPrev).text, trend: computeChange(wkCur, wkPrev).trend },
          month: { period: t('timeMetrics.thisMonth'), value: mnCur, change: computeChange(mnCur, mnPrev).text, trend: computeChange(mnCur, mnPrev).trend },
          year: { period: t('timeMetrics.thisYear'), value: yrCur, change: computeChange(yrCur, yrPrev).text, trend: computeChange(yrCur, yrPrev).trend },
        });

      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      {loading && (
        <>
          {[0,1,2].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">{i===0?t('timeMetrics.thisWeek'):i===1?t('timeMetrics.thisMonth'):t('timeMetrics.thisYear')}</p>
              <div className="flex items-end gap-4">
                <p className="text-3xl font-bold text-gray-800">—</p>
                <div className="h-16 w-32 mb-2 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </>
      )}

      {!loading && error && (
        <div className="col-span-3 text-red-500">Failed to load metrics: {error}</div>
      )}

      {!loading && !error && (
        <>
          {[metrics.week, metrics.month, metrics.year].map((metric, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">{metric.period}</p>
              <div className="flex items-end gap-4">
                <p className="text-3xl font-bold text-gray-800">{formatNumber(metric.value)}</p>
                <div className="h-16 w-32 mb-2">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    <polyline
                      points="0,40 20,35 40,38 60,30 80,25 100,20"
                      fill="none"
                      stroke={metric.trend === 'up' ? '#22c55e' : '#ef4444'}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md">
                  {metric.change} {metric.trend === 'up' ? '↑' : '↓'}
                </button>
                <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">i</span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default TimeMetrics;
