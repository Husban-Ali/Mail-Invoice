import React, { useEffect, useMemo, useState } from "react";
import {
  listExportTemplates,
  createExportTemplate,
  deleteExportTemplate,
  listExportRuns,
  runExportJob,
  createExportPresets,
  getExportDownloadUrl,
} from "../lib/api";

export default function ExportTable() {
  const [templates, setTemplates] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    entity: "invoices",
    format: "CSV",
    fields: [],
    filters: {},
  });
  const [fieldsInput, setFieldsInput] = useState("");

  const entities = useMemo(() => [
    { key: "invoices", label: "Invoices" },
    { key: "suppliers", label: "Suppliers" },
    { key: "rules", label: "Rules" },
  ], []);

  const formats = ["CSV", "JSON"]; // Future: Excel, PDF

  async function refreshAll() {
    setLoading(true);
    setError(null);
    try {
      const [t, r] = await Promise.all([
        listExportTemplates().catch(() => ({ data: [] })),
        listExportRuns().catch(() => ({ data: [] })),
      ]);
      setTemplates(t?.data || []);
      setRuns(r?.data || []);
    } catch (e) {
      setError(e.message || "Failed to load exports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const fields = fieldsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const payload = { ...newTemplate, fields };
      await createExportTemplate(payload);
      setShowNew(false);
      setNewTemplate({ name: "", entity: "invoices", format: "CSV", fields: [], filters: {} });
      setFieldsInput("");
      await refreshAll();
    } catch (e) {
      alert(e.message || "Failed to create template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this template?")) return;
    try {
      await deleteExportTemplate(id);
      await refreshAll();
    } catch (e) {
      alert(e.message || "Failed to delete");
    }
  };

  const handleRunTemplate = async (id) => {
    setRunning(true);
    try {
      await runExportJob({ templateId: id });
      await refreshAll();
    } catch (e) {
      alert(e.message || "Run failed");
    } finally {
      setRunning(false);
    }
  };

  const handleCreatePresets = async () => {
    try {
      await createExportPresets();
      await refreshAll();
    } catch (e) {
      alert(e.message || "Failed to create presets");
    }
  };

  const [adhoc, setAdhoc] = useState({ entity: "invoices", format: "CSV" });
  const [adhocFields, setAdhocFields] = useState("");
  const runAdhoc = async () => {
    setRunning(true);
    try {
      const fields = adhocFields
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const inline = { ...adhoc, fields, filters: {} };
      await runExportJob({ inline });
      setAdhocFields("");
      await refreshAll();
    } catch (e) {
      alert(e.message || "Ad-hoc run failed");
    } finally {
      setRunning(false);
    }
  };

  const handleDownload = async (runId, runName) => {
    try {
      const response = await fetch(getExportDownloadUrl(runId), {
        headers: {
          'Authorization': `Bearer ${await (async () => {
            const sessionStr = localStorage.getItem('session');
            if (sessionStr) {
              const sess = JSON.parse(sessionStr);
              return sess?.access_token || sess?.currentSession?.access_token;
            }
            return null;
          })()}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = runName || 'export';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      alert(e.message || 'Download failed');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold">Exports</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNew((v) => !v)}
              className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm"
            >
              {showNew ? "Close" : "New Template"}
            </button>
            <button
              onClick={handleCreatePresets}
              className="bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm"
            >
              Create Presets
            </button>
          </div>
        </div>

        {showNew && (
          <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            <div className="grid md:grid-cols-5 grid-cols-1 gap-3">
              <input
                placeholder="Template name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate((s) => ({ ...s, name: e.target.value }))}
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
              <select
                value={newTemplate.entity}
                onChange={(e) => setNewTemplate((s) => ({ ...s, entity: e.target.value }))}
                className="border rounded-md px-3 py-2 text-sm w-full"
              >
                {entities.map((e) => (
                  <option key={e.key} value={e.key}>{e.label}</option>
                ))}
              </select>
              <select
                value={newTemplate.format}
                onChange={(e) => setNewTemplate((s) => ({ ...s, format: e.target.value }))}
                className="border rounded-md px-3 py-2 text-sm w-full"
              >
                {formats.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <input
                placeholder="Fields (comma-separated)"
                value={fieldsInput}
                onChange={(e) => setFieldsInput(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm w-full"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreate}
                  disabled={saving || !newTemplate.name}
                  className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Template"}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-600">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Entity</th>
                <th className="py-3 px-4 font-medium">Format</th>
                <th className="py-3 px-4 font-medium">Fields</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-3 px-4" colSpan={5}>Loading…</td></tr>
              ) : templates.length === 0 ? (
                <tr><td className="py-3 px-4 text-gray-500" colSpan={5}>No templates yet</td></tr>
              ) : (
                templates.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{t.name}</td>
                    <td className="py-3 px-4 text-gray-700">{t.entity}</td>
                    <td className="py-3 px-4 text-gray-700">{t.format}</td>
                    <td className="py-3 px-4 text-gray-700">{Array.isArray(t.fields) ? t.fields.length : 0}</td>
                    <td className="py-3 px-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRunTemplate(t.id)}
                          disabled={running}
                          className="px-3 py-1.5 rounded-md bg-black text-white hover:bg-gray-800 text-xs disabled:opacity-60"
                        >
                          {running ? "Running…" : "Run"}
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Runs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-md font-semibold">Recent runs</h3>
          <div className="flex items-center gap-2">
            <select
              value={adhoc.entity}
              onChange={(e) => setAdhoc((s) => ({ ...s, entity: e.target.value }))}
              className="border rounded-md px-2 py-1.5 text-sm"
            >
              {entities.map((e) => (
                <option key={e.key} value={e.key}>{e.label}</option>
              ))}
            </select>
            <select
              value={adhoc.format}
              onChange={(e) => setAdhoc((s) => ({ ...s, format: e.target.value }))}
              className="border rounded-md px-2 py-1.5 text-sm"
            >
              {formats.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <input
              placeholder="Fields (comma-separated)"
              value={adhocFields}
              onChange={(e) => setAdhocFields(e.target.value)}
              className="border rounded-md px-2 py-1.5 text-sm"
              style={{minWidth: 220}}
            />
            <button
              onClick={runAdhoc}
              disabled={running}
              className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm disabled:opacity-60"
            >
              {running ? "Running…" : "Run Ad-hoc"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-600">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Entity</th>
                <th className="py-3 px-4 font-medium">Format</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Rows</th>
                <th className="py-3 px-4 font-medium">Finished</th>
                <th className="py-3 px-4 font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 ? (
                <tr><td className="py-3 px-4 text-gray-500" colSpan={7}>No runs yet</td></tr>
              ) : (
                runs.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{r.name || "(ad-hoc)"}</td>
                    <td className="py-3 px-4 text-gray-700">{r.entity}</td>
                    <td className="py-3 px-4 text-gray-700">{r.format}</td>
                    <td className="py-3 px-4 text-gray-700">{r.status}</td>
                    <td className="py-3 px-4 text-gray-700">{r.count_rows ?? "-"}</td>
                    <td className="py-3 px-4 text-gray-700">{r.finished_at ? new Date(r.finished_at).toLocaleString() : '-'}</td>
                    <td className="py-3 px-4">
                      {r.status === 'Completed' && r.file_url ? (
                        <a
                          href={r.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      ) : r.status === 'Completed' && !r.file_url ? (
                        <span className="text-orange-500 text-xs" title={r.error || "Storage upload failed"}>
                          ⚠️ No file
                        </span>
                      ) : r.status === 'Failed' ? (
                        <span className="text-red-500 text-xs" title={r.error || "Run failed"}>
                          ❌ Failed
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}