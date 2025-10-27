import React, { useState, useEffect } from "react";
import { ChevronDown, Info, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getSuppliersList } from "../lib/api";

const StatusCard = ({ title, subtitle, data }) => {
  const { t } = useTranslation();
  const [sortOrder, setSortOrder] = useState("first");
  const [sortedData] = useState(data || []);

  const handleSort = (order) => {
    setSortOrder(order);
    // Sorting/local state features can be added later
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex-1">
      {/* Header with Buttons */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => handleSort("first")}
          className={`flex items-center  lowercase justify-center gap-2 min-w-[150px] px-6 py-2 rounded-full text-xs font-semibold transition-all ${
            sortOrder === "first"
              ? "bg-black text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {t("statusCard.first")}
          {sortOrder === "first" && (
            <ChevronDown
              size={14}
              strokeWidth={2.5}
              className="text-green-500"
            />
          )}
        </button>

        <button
          onClick={() => handleSort("last")}
          className={`flex items-center justify-center lowercase gap-2 min-w-[150px] px-6 py-2 rounded-full text-xs font-semibold transition-all ${
            sortOrder === "last"
              ? "bg-black text-white"
              : "bg-white text-gray-700 border lowercase border-gray-200 hover:bg-gray-50"
          }`}
        >
          {t("statusCard.last")}
          {sortOrder === "last" && (
            <ArrowUp size={14} strokeWidth={2.5} className="text-red-500" />
          )}
        </button>

        <button className="ml-auto w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
          <Info size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Title Section */}
      <div className="mb-4 pb-3 border-b lowercase border-gray-100">
        <h3 className="text-sm font-semibold lowercase text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 lowercase mt-0.5">{subtitle}</p>
      </div>

      {/* Data List */}
      <div className="space-y-2">
        {sortedData.map((item, idx) => (
          <div key={idx} className="flex items-center lowercase justify-between py-2.5">
            <span className="text-sm text-gray-900 lowercase font-medium">{item.name}</span>
            <div className="flex gap-1.5">
              {item.badges.map((badge, badgeIdx) => (
                <span key={badgeIdx} className={`px-2.5 py-1 rounded lowercase text-xs font-medium ${badge.color}`}>
                  {badge.text}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusCardsContainer = () => {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getSuppliersList();
        if (!cancelled && res && Array.isArray(res.suppliers)) {
          setSuppliers(res.suppliers.slice(0, 8));
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

  const supplierData = suppliers.length
    ? suppliers.map((s) => ({ name: s, badges: [{ text: "—", color: "bg-gray-200 text-gray-800" }] }))
    : [];

  const emailSendingData = [
    { name: t('statusCard.emailExample1','Vendor A'), badges: [{ text: t('statusCard.emailBadge','Pending'), color: 'bg-yellow-300 text-yellow-900' }] },
    { name: t('statusCard.emailExample2','Vendor B'), badges: [{ text: t('statusCard.emailBadge2','Sent'), color: 'bg-green-300 text-green-900' }] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-1 lg:grid-cols-2">
        <StatusCard
          title={t("statusCard.supplierTitle")}
          subtitle={t("statusCard.supplierSubtitle")}
          data={supplierData}
        />
        <StatusCard
          title={t("statusCard.emailTitle")}
          subtitle={t("statusCard.emailSubtitle")}
          data={emailSendingData}
        />
      </div>
      {error && <div className="text-red-500 mt-3">{t('errorFetch','Failed to load suppliers')}: {error}</div>}
      {loading && <div className="text-gray-500 mt-3">{t('loading','Loading...')}</div>}
    </div>
  );
};

export default StatusCardsContainer;
