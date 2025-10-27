// TableActions.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const TableActions = ({ onExport, onDelete, onAssign, onApprove, selectedCount = 0 }) => {
  const { t, i18n } = useTranslation();

  // Helper: German ho to translation use karo, warna fallback original
  const translateIfNeeded = (key, fallback) =>
    i18n.language === "de" ? t(key) : fallback;

  return (
    <div className="flex justify-between items-center border border-gray-200 rounded-xl bg-gray-50 p-4">
      <div className="flex gap-3 items-center">
        <button 
          onClick={onAssign}
          className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={selectedCount === 0}
        >
          {translateIfNeeded("tableActions.assign", "Assign")}
        </button>
        <button 
          onClick={onApprove}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed"
          disabled={selectedCount === 0}
        >
          {translateIfNeeded("tableActions.approve", "Approve")}
        </button>
        {selectedCount > 0 && (
          <span className="text-sm text-gray-600">
            {selectedCount} selected
          </span>
        )}
      </div>
      <div className="flex gap-3">
        <button 
          onClick={onExport}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          {translateIfNeeded("tableActions.export", "Export")}
        </button>
        <button 
          onClick={onDelete}
          className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          disabled={selectedCount === 0}
        >
          {translateIfNeeded("tableActions.delete", "Delete")}
        </button>
      </div>
    </div>
  );
};

export default TableActions;
