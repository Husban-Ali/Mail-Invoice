// ChartsSection.jsx
import React, { useEffect, useState } from "react";
import DonutChart from "./DonutChart";
import { useTranslation } from "react-i18next";
import { getScrapedStats } from "../lib/api";

function ChartsSection() {
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
        if (!cancelled && res && res.stats) setStats(res.stats);
      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Build chart data from stats (fallback to small placeholders)
  const invoiceData = stats
    ? [
        { type: t("charts.parsed"), value: stats.parsedCount || 0, color: "bg-green-500", strokeColor: "#22c55e" },
        { type: t("charts.pending"), value: stats.pendingCount || 0, color: "bg-yellow-500", strokeColor: "#eab308" },
        { type: t("charts.error"), value: stats.errorCount || 0, color: "bg-red-500", strokeColor: "#ef4444" },
      ]
    : [
        { type: t("charts.parsed"), value: 0, color: "bg-green-500", strokeColor: "#22c55e" },
        { type: t("charts.pending"), value: 0, color: "bg-yellow-500", strokeColor: "#eab308" },
        { type: t("charts.error"), value: 0, color: "bg-red-500", strokeColor: "#ef4444" },
      ];

  const formatData = stats
    ? Object.entries(stats.formatBreakdown || {}).map(([k, v]) => ({ type: k, value: v, color: "bg-indigo-400", strokeColor: "#6366f1" }))
    : [
        { type: t("charts.pdf"), value: 0, color: "bg-red-500", strokeColor: "#ef4444" },
      ];

  if (error) {
    return (
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="col-span-2 text-red-500">{t('errorFetch','Failed to load chart data')}: {error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      <DonutChart title={t("charts.invoicesCrawled")} data={invoiceData} type="donut" loading={loading} />
      <DonutChart title={t("charts.invoiceFormats")} data={formatData} type="pie" loading={loading} />
    </div>
  );
}

export default ChartsSection;
