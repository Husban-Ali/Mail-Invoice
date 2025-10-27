import React from "react";

// Minimal table to show imported invoices; tries to map common fields gracefully.
const StepInvoicesTable = ({ invoices = [] }) => {
  const rows = invoices.map((inv, idx) => ({
    id: inv.id || inv.invoiceNumber || idx + 1,
    date: inv.date || inv.created_at || inv.sentAt || '-',
    from: inv.from || inv.sender || inv.company || '-',
    subject: inv.subject || inv.title || '-',
    amount: inv.amount || inv.total || '-',
    attachments: Array.isArray(inv.attachments) ? inv.attachments.length : (inv.pdf ? 1 : 0),
    status: inv.status || 'Imported',
  }));

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4">Imported Invoices</h3>
      <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">From</th>
              <th className="py-2 px-3">Subject</th>
              <th className="py-2 px-3">Amount</th>
              <th className="py-2 px-3">Attachments</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((r, i) => (
              <tr key={i} className="border-t border-gray-200 hover:bg-gray-50 transition">
                <td className="py-2 px-3">{String(r.date)}</td>
                <td className="py-2 px-3">{r.from}</td>
                <td className="py-2 px-3">{r.subject}</td>
                <td className="py-2 px-3">{r.amount}</td>
                <td className="py-2 px-3">{r.attachments}</td>
                <td className="py-2 px-3">{r.status}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">No invoices to display</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StepInvoicesTable;
