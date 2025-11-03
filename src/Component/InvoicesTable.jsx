import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const InvoicesTable = ({ data, onStatusUpdate, selectedIds = [], setSelectedIds = () => {}, onAssignClick = () => {} }) => {
  const { t } = useTranslation();

  // Handle file download - force download instead of opening in browser
  const handleDownload = async (fileUrl, filename, format) => {
    try {
      // Determine correct MIME type based on format
      const mimeTypes = {
        'PDF': 'application/pdf',
        'XML': 'application/xml',
        'Scan': 'image/jpeg'
      };
      
      // Fetch file
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      // Create a new blob with correct MIME type
      const correctMimeType = mimeTypes[format] || blob.type || 'application/octet-stream';
      const typedBlob = new Blob([blob], { type: correctMimeType });
      
      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(typedBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Set correct file extension
      const extension = format?.toLowerCase() || 'pdf';
      link.download = filename ? `${filename}.${extension}` : `invoice.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab if download fails
      window.open(fileUrl, '_blank');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Parsed":
        return "text-green-600 bg-green-50";
      case "Error":
        return "text-red-600 bg-red-50";
      case "Pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case "Parsed":
        return "bg-green-500";
      case "Error":
        return "bg-red-500";
      case "Pending":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  const getFormatStyle = (format) => {
    switch (format) {
      case "PDF":
        return "text-blue-600 bg-blue-50";
      case "XML":
        return "text-purple-600 bg-purple-50";
      case "Scan":
        return "text-teal-600 bg-teal-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Handle checkbox selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(data.map(row => row.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  return (
    <div>
      <h2 className="text-xl font-semibold mx-6 my-4">
        {t("invoicesTable.title")}
      </h2>
      <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-3 w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isSomeSelected;
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-2 px-3">{t("invoicesTable.date")}</th>
              <th className="py-2 px-3">{t("invoicesTable.company")}</th>
              <th className="py-2 px-3">{t("invoicesTable.invoice")}</th>
              <th className="py-2 px-3">{t("invoicesTable.amount")}</th>
              <th className="py-2 px-3">{t("invoicesTable.format")}</th>
              <th className="py-2 px-3">{t("invoicesTable.status")}</th>
              <th className="py-2 px-3">{t("invoicesTable.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={`border-t border-gray-200 hover:bg-gray-50 transition ${
                    selectedIds.includes(row.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-2 px-3">{row.date}</td>
                  <td className="py-2 px-3">{row.company}</td>
                  <td className="py-2 px-3">{row.id}</td>
                  <td className="py-2 px-3">{row.amount}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getFormatStyle(
                        row.format
                      )}`}
                    >
                      {row.format}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        row.status
                      )}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${getDotColor(row.status)}`}></span>
                      {t(`invoicesTable.${row.status.toLowerCase()}`, row.status)}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={row.status}
                        onChange={(e) => onStatusUpdate(row.id, e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pending">{t("invoicesTable.pending", "Pending")}</option>
                        <option value="Parsed">{t("invoicesTable.parsed", "Parsed")}</option>
                        <option value="Assigned">{t("invoicesTable.assigned", "Assigned")}</option>
                        <option value="Approved">{t("invoicesTable.approved", "Approved")}</option>
                        <option value="Error">{t("invoicesTable.error", "Error")}</option>
                      </select>
                      {row.file_url && (
                        <button
                          onClick={() => handleDownload(row.file_url, row.id, row.format)}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                          title="Download Invoice File"
                        >
                          {t("invoicesTable.download", "Download")}
                        </button>
                      )}
                      <button
                        onClick={() => onAssignClick(row)}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        title="Assign & Send Email"
                      >
                        {t("invoicesTable.assign", "Assign")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  {t("invoicesTable.noResults", "No data found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesTable;
