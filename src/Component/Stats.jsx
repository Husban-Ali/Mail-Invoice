// Stats.jsx
import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

const Stats = ({ stats, loading = false }) => {
  const { t, i18n } = useTranslation();

  // Helper: agar German ho to translation, warna fallback original
  const translateIfNeeded = (key, fallback) =>
    i18n.language === "de" ? t(key) : fallback;

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-12 mt-2 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // If no stats data, show fallback
  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No statistics available</p>
      </div>
    );
  }

  // Generate chart data from stats (using breakdown for trend simulation)
  const generateChartData = (value) => {
    // Simple trend data generation for visualization
    const baseValue = value / 7;
    return Array.from({ length: 7 }, (_, i) => 
      Math.max(0, baseValue + Math.random() * baseValue - baseValue / 2)
    );
  };

  const statsDisplay = [
    {
      label: translateIfNeeded("stats.total", "Total"),
      value: stats.totalInvoices || 0,
      color: "#22c55e", // green
      data: generateChartData(stats.totalInvoices || 0),
    },
    {
      label: translateIfNeeded("stats.parsed", "Parsed"),
      value: stats.parsedCount || 0,
      color: "#22c55e",
      data: generateChartData(stats.parsedCount || 0),
    },
    {
      label: translateIfNeeded("stats.errors", "Errors"),
      value: stats.errorCount || 0,
      color: "#ef4444", // red
      data: generateChartData(stats.errorCount || 0),
    },
    {
      label: translateIfNeeded("stats.pending", "Pending"),
      value: stats.pendingCount || 0,
      color: "#f59e0b", // amber
      data: generateChartData(stats.pendingCount || 0),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsDisplay.map((item, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm"
        >
          {/* Label + Value */}
          <p className="text-sm text-gray-500 mb-2">{item.label}:</p>
          <p className="text-xl font-bold text-gray-800">{item.value}</p>

          {/* Mini Chart */}
          <div className="h-12 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={item.data.map((v, i) => ({ x: i, y: v }))}>
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke={item.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
