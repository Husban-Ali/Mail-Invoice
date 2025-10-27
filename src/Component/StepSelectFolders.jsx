import React, { useEffect, useState } from "react";
import CustomFolder from "./CustomeFolder";
import SelectFolder from "./SelectFolder";
import { listImapFolders } from "../lib/api";

// Supports two modes:
// - legacy (default): behaves like before and can directly trigger scan
// - wizard: fetch folders from backend and let parent handle next steps
const StepSelectFolders = ({ connectedCreds, onDone, mode = 'legacy', email, onSelect }) => {
  const [defaultFolders, setDefaultFolders] = useState(["INBOX", "Spam", "Invoices"]);
  const [customFolders, setCustomFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showCustomFolder, setShowCustomFolder] = useState(false);
  const [showSelectFolder, setShowSelectFolder] = useState(false);

  const addCustomFolder = () => setShowCustomFolder(true);
  const addSelectFolder = () => setShowSelectFolder(true);

  const handleSaveCustomFolders = (folders) => {
    setCustomFolders(folders.map(f => f.name));
    setShowCustomFolder(false);
    setShowSelectFolder(true);
  };

  useEffect(() => {
    const fetchFolders = async () => {
      if (mode !== 'wizard' || !email) return;
      setLoading(true);
      setError("");
      try {
        const data = await listImapFolders(email);
        const folders = Array.isArray(data?.folders) ? data.folders : [];
        setDefaultFolders(folders.length ? folders : ["INBOX", "Spam", "Invoices"]);
        setShowSelectFolder(true);
      } catch (e) {
        console.error('[StepSelectFolders] list folders failed', e);
        setError(e.message || 'Failed to load folders');
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [mode, email]);

  if (loading) {
    return <div className="text-gray-600">Loading folders...</div>;
  }
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (showCustomFolder) {
    return <CustomFolder onSave={handleSaveCustomFolders} />;
  }

  if (showSelectFolder || mode === 'wizard') {
    return (
      <SelectFolder
        defaultFolders={defaultFolders}
        customFolders={customFolders}
        onAddCustom={addCustomFolder}
        showFilters={mode !== 'wizard'}
        onContinue={async ({ selectedFolders, unseenOnly, sinceDays }) => {
          if (mode === 'wizard' && onSelect) {
            onSelect({ selectedFolders });
            return;
          }
          // LEGACY behavior: trigger scan here
          if (!connectedCreds) return;
          const folders = (selectedFolders && selectedFolders.length) ? selectedFolders : ['INBOX'];
          let total = 0;
          try {
            for (const folder of folders) {
              const res = await fetch('http://localhost:8080/api/invoices/fetch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: connectedCreds.email,
                  password: connectedCreds.password,
                  host: connectedCreds.host,
                  port: connectedCreds.port,
                  tls: true,
                  folder,
                  accountId: connectedCreds.accountId,
                  unseenOnly,
                  sinceDays,
                })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || 'Fetch failed');
              const count = typeof data?.fetched === 'number' ? data.fetched : (Array.isArray(data?.invoices) ? data.invoices.length : 0);
              total += count;
            }
            alert(`Scanned ${folders.length} folder(s). Imported ${total} PDF${total===1?'':'s'}.`);
            if (onDone) onDone();
          } catch (e) {
            console.error('Folder scan failed', e);
            alert(e.message);
          }
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-black font-inter"> Select Folders</h3>
        <button
          onClick={addCustomFolder}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Add Custom Folder
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 pt-6">
        {defaultFolders.map((folder, idx) => (
          <div
            key={idx}
            className="flex text-xl items-center justify-center h-20 border border-gray-300 rounded-lg text-black font-semibold hover:bg-gray-50 cursor-pointer font-inter"
          >
            {folder}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepSelectFolders;

