// Filters.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const Filters = ({ filters, setFilters, suppliers = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-xl bg-white shadow-sm px-4 py-4">
      {/* Left label */}
      <span className="text-md font-medium text-gray-700 font-inter">
        {t("filters.title", "Filters")}
      </span>

      {/* Right dropdowns */}
      <div className="flex items-center gap-2">
        {/* Date Filter */}
        <select
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="bg-black text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none"
        >
          <option value="All">{t("filters.date", "All Dates")}</option>
          <option value="Today">{t("filters.today", "Today")}</option>
          <option value="Last7Days">{t("filters.last7days", "Last 7 Days")}</option>
        </select>

        {/* Supplier Filter - Dynamic from API */}
        <select
          value={filters.supplier}
          onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
          className="border border-gray-300 bg-white text-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
        >
          <option value="All">{t("filters.supplier", "All Suppliers")}</option>
          {suppliers.map((supplier) => (
            <option key={supplier} value={supplier}>
              {supplier}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border border-gray-300 bg-white text-gray-700 rounded-md px-3 py-1.5 text-sm focus:outline-none"
        >
          <option value="All">{t("filters.status", "All Statuses")}</option>
          <option value="Parsed">{t("filters.parsed", "Parsed")}</option>
          <option value="Pending">{t("filters.pending", "Pending")}</option>
          <option value="Error">{t("filters.error", "Error")}</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
