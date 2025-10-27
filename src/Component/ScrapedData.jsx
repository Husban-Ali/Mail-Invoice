import React, { useState, useEffect } from "react";
import Filters from "./Filters";
import InvoicesTable from "./InvoicesTable";
import TableActions from "./TableActions";
import Stats from "./Stats";
import SendInvoiceModal from "./SendInvoiceModal";
import { 
  getScrapedInvoices, 
  getScrapedStats, 
  getSuppliersList,
  exportScrapedInvoicesCSV,
  deleteScrapedInvoices,
  updateInvoiceStatus,
  bulkUpdateScrapedInvoices,
  sendInvoiceEmail
} from "../lib/api";
import { showLoading, closeLoading, showSuccess, showError, showConfirm, showWarning } from "../lib/sweetAlert";

const ScrapedData = () => {
  // State management
  const [filters, setFilters] = useState({
    date: "All",
    supplier: "All",
    status: "All",
  });
  
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0
  });
  const [selectedIds, setSelectedIds] = useState([]);
    const [showSendModal, setShowSendModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchScrapedData();
  }, [filters, pagination.offset]);

  // Fetch stats and suppliers on mount
  useEffect(() => {
    fetchStats();
    fetchSuppliers();
  }, []);

  // Fetch scraped invoices data
  const fetchScrapedData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        supplier: filters.supplier,
        status: filters.status,
        limit: pagination.limit,
        offset: pagination.offset
      };

      const response = await getScrapedInvoices(params);

      if (response.success) {
        // Transform backend data to match frontend format
        const transformedData = response.data.map(item => ({
          date: item.date,
          company: item.company,
          id: item.invoiceId,
          amount: item.amount,
          format: item.format,
          status: item.status,
          _rawId: item.id // Keep raw ID for operations
        }));

        setData(transformedData);
        setPagination(prev => ({
          ...prev,
          total: response.total
        }));
      }
    } catch (err) {
      console.error("Error fetching scraped data:", err);
      setError(err.message || "Failed to fetch data");
      setData([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await getScrapedStats();
      
      if (response.success) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Fetch suppliers list
  const fetchSuppliers = async () => {
    try {
      const response = await getSuppliersList();
      
      if (response.success) {
        setSuppliers(response.suppliers);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setSuppliers([]); // Fallback to empty array
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
  };

  // Handle export to CSV
  const handleExport = async () => {
    try {
      showLoading('Preparing CSV...');
      const blob = await exportScrapedInvoicesCSV({
        supplier: filters.supplier,
        status: filters.status
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      closeLoading();
    } catch (err) {
      closeLoading();
      console.error("Error exporting data:", err);
      showError("Failed to export data. Please try again.");
    }
  };

  // Handle delete invoices
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      showWarning('Please select invoices to delete');
      return;
    }

    try {
      const confirmRes = await showConfirm(`Are you sure you want to delete ${selectedIds.length} invoice(s)?`, 'Confirm delete');
      if (!confirmRes.isConfirmed) return;

      // Get raw IDs from displayed data
      const rawIds = data
        .filter(item => selectedIds.includes(item.id))
        .map(item => item._rawId);

      showLoading('Deleting invoices...');
      const response = await deleteScrapedInvoices(rawIds);
      closeLoading();

      if (response.success) {
        showSuccess(`Successfully deleted ${response.deleted} invoice(s)`);
        setSelectedIds([]); // Clear selection
        fetchScrapedData(); // Refresh data
        fetchStats(); // Refresh stats
      } else {
        showError('Delete returned an error');
      }
    } catch (err) {
      closeLoading();
      console.error("Error deleting invoices:", err);
      showError("Failed to delete invoices. Please try again.");
    }
  };

  // Handle assign selected
  const handleAssign = async () => {
    if (selectedIds.length === 0) return;
    try {
      const rawIds = data
        .filter(item => selectedIds.includes(item.id))
        .map(item => item._rawId);
      showLoading('Assigning invoices...');
      const response = await bulkUpdateScrapedInvoices(rawIds, { status: 'Assigned' });
      closeLoading();
      if (response.success) {
        showSuccess('Invoices assigned');
        setSelectedIds([]);
        fetchScrapedData();
        fetchStats();
      } else {
        showError('Failed to assign invoices');
      }
    } catch (err) {
      console.error('Error assigning invoices:', err);
      closeLoading();
      showError('Failed to assign invoices.');
    }
  };

  // Handle approve selected
  const handleApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      const rawIds = data
        .filter(item => selectedIds.includes(item.id))
        .map(item => item._rawId);
      showLoading('Approving invoices...');
      const response = await bulkUpdateScrapedInvoices(rawIds, { status: 'Approved' });
      closeLoading();
      if (response.success) {
        showSuccess('Invoices approved');
        setSelectedIds([]);
        fetchScrapedData();
        fetchStats();
      } else {
        showError('Failed to approve invoices');
      }
    } catch (err) {
      console.error('Error approving invoices:', err);
      closeLoading();
      showError('Failed to approve invoices.');
    }
  };

  // Handle status update
  const handleStatusUpdate = async (invoiceId, newStatus) => {
    try {
      // Get raw ID
      const invoice = data.find(item => item.id === invoiceId);
      if (!invoice) return;
      showLoading('Updating status...');
      const response = await updateInvoiceStatus(invoice._rawId, newStatus);
      closeLoading();
      if (response.success) {
        showSuccess('Status updated');
        fetchScrapedData(); // Refresh data
        fetchStats(); // Refresh stats
      } else {
        showError('Failed to update status');
      }
    } catch (err) {
      console.error("Error updating status:", err);
      closeLoading();
      showError("Failed to update status. Please try again.");
    }
  };

    // Handle assign button click
    const handleAssignClick = (invoice) => {
      setSelectedInvoice(invoice);
      setShowSendModal(true);
    };

    // Handle send email
    const handleSendEmail = async (invoice, formData) => {
      try {
        showLoading('Sending email...');
        await sendInvoiceEmail(invoice, formData);
        closeLoading();
        showSuccess('Email sent successfully!');
        // Update status to Assigned
        await handleStatusUpdate(invoice.id, 'Assigned');
      } catch (error) {
        closeLoading();
        showError('Failed to send email');
        throw error;
      }
    };

  // Handle pagination
  const handlePageChange = (newOffset) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  return (
    <>
      {/* Error Display */}
      {error && (
        <div className="mx-6 my-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Filters Section */}
      <div className="mx-6 my-4">
        <Filters 
          filters={filters} 
          setFilters={handleFilterChange}
          suppliers={suppliers}
        />
      </div>

      {/* Table Section */}
      <div className="p-6 font-inter text-black space-y-6 border border-gray-200 rounded-2xl bg-white shadow mx-6 mb-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading invoices...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No invoices found.</p>
            <p className="text-sm mt-2">Try adjusting your filters or fetch new data.</p>
          </div>
        ) : (
          <>
            <InvoicesTable 
              data={data}
              onStatusUpdate={handleStatusUpdate}
                onAssignClick={handleAssignClick}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
            <TableActions 
              onExport={handleExport}
              onDelete={handleDelete}
              onAssign={handleAssign}
              onApprove={handleApprove}
              selectedCount={selectedIds.length}
            />
            
            {/* Pagination */}
            {pagination.total > pagination.limit && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                  disabled={pagination.offset === 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-600">
                  Showing {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                  disabled={pagination.offset + pagination.limit >= pagination.total}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

        {/* Send Invoice Modal */}
        <SendInvoiceModal
          isOpen={showSendModal}
          onClose={() => {
            setShowSendModal(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
          onSend={handleSendEmail}
        />

      {/* Stats Section */}
      <div className="mx-6 mb-6">
        <Stats stats={stats} loading={!stats} />
      </div>
    </>
  );
};

export default ScrapedData;
