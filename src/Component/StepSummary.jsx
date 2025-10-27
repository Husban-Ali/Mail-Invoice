import React, { useEffect, useState } from "react";
import { fetchImapInvoices } from "../lib/api";

// Expects props: creds {email,password,host,port,tls?,accountId?}, folders [], filters {unseenOnly,sinceDays}
// Loops folders sequentially to fetch and aggregates a summary.
const StepSummary = ({ creds, folders = [], filters = { unseenOnly: true, sinceDays: 7 }, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ scannedFolders: 0, emailsScanned: 0, pdfsFound: 0, xmlsFound: 0, total: 0 });
  const [invoices, setInvoices] = useState([]);

  const runFetch = async () => {
    setLoading(true);
    setError("");
    try {
  let totalFetched = 0;
  let allInvoices = [];
      for (const folder of folders.length ? folders : ['INBOX']) {
        const payload = {
          accountId: creds?.accountId || null,
          host: creds?.host,
          port: creds?.port,
          email: creds?.email,
          password: creds?.password,
          tls: creds?.tls ?? true,
          folder,
          unseenOnly: !!filters?.unseenOnly,
          sinceDays: typeof filters?.sinceDays === 'number' ? filters.sinceDays : null,
        };
        const data = await fetchImapInvoices(payload);
        const count = typeof data?.fetched === 'number' ? data.fetched : (Array.isArray(data?.invoices) ? data.invoices.length : 0);
        totalFetched += count;
        if (Array.isArray(data?.invoices)) allInvoices = allInvoices.concat(data.invoices);
      }
      const pdfs = allInvoices.filter(inv => (inv.format || '').toUpperCase() === 'PDF').length;
      const xmls = allInvoices.filter(inv => (inv.format || '').toUpperCase() === 'XML').length;
      setSummary({ scannedFolders: folders.length || 1, emailsScanned: totalFetched, pdfsFound: pdfs, xmlsFound: xmls, total: allInvoices.length });
      setInvoices(allInvoices);
    } catch (e) {
      console.error('[StepSummary] fetch failed', e);
      setError(e.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run once when component mounts
    runFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl">
      <h3 className="text-xl font-semibold mb-4">Summary</h3>
      {loading && <p className="text-gray-600">Scanning folders...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="border rounded-md w-full">
          <div className="bg-gray-100 p-2 font-bold text-center border-b">Summary</div>
          <table className="w-full text-left table-fixed">
            <tbody>
              <tr className="border-b">
                <td className="w-1/4 p-2 font-medium bg-gray-50">Scanned folders:</td>
                <td className="p-2">{summary.scannedFolders}</td>
              </tr>
              <tr className="border-b">
                <td className="w-1/4 p-2 font-medium bg-gray-50">Emails scanned:</td>
                <td className="p-2">{summary.emailsScanned}</td>
              </tr>
              <tr className="border-b">
                <td className="w-1/4 p-2 font-medium bg-gray-50">PDFs found:</td>
                <td className="p-2">{summary.pdfsFound}</td>
              </tr>
              <tr>
                <td className="w-1/4 p-2 font-medium bg-gray-50">XMLs found:</td>
                <td className="p-2">{summary.xmlsFound}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onComplete && onComplete({ invoices })}
          disabled={loading || !!error}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          Finish and View Invoices
        </button>
      </div>
    </div>
  );
};

export default StepSummary;
