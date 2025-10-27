import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Email1 from "../assets/Email1.png";
import Email2 from "../assets/Email2.png";
import Email3 from "../assets/Email3.png";
import { getScrapedStats } from "../lib/api";

const StatsCards = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getScrapedStats();
        if (!cancelled && res && res.stats) {
          setStats(res.stats);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const display = [
    { label: t("statsCards.emailsProcessed"), value: stats ? stats.totalInvoices : '—', icon: Email1 },
    { label: t("statsCards.emailsPending"), value: stats ? stats.pendingCount : '—', icon: Email2 },
    { label: t("statsCards.emailsFailed"), value: stats ? stats.errorCount : '—', icon: Email3 },
  ];

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">{[0,1,2].map(i=> (
      <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between"> <p className="text-lg text-gray-600 mb-4 font-inter">{t('loading','Loading...')}</p> <div className="h-8 bg-gray-100 rounded" /></div>
    ))}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {error && (
        <div className="col-span-1 md:col-span-3 text-red-500">{t('errorFetch','Failed to load stats')}: {error}</div>
      )}

      {display.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between"
        >
          <p className="text-lg text-gray-600 mb-4 font-inter">{stat.label}</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            <div className="p-2 rounded-lg flex items-center justify-center">
              <img src={stat.icon} alt={stat.label} className="w-10 h-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
