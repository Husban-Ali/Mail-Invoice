import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    { key: "invoices", label: t("export.invoices") },
    { key: "suppliers", label: t("export.suppliers") },
    { key: "rules", label: t("export.rules") },
  ], [t]);

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
          <h2 className="text-lg font-semibold">{t("export.title")}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNew((v) => !v)}
              className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm"
            >
              {showNew ? t("export.close") : t("export.newTemplate")}
            </button>
            <button
              onClick={handleCreatePresets}
              className="bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 text-sm"
            >
              {t("export.createPresets")}
            </button>
          </div>
        </div>

        {showNew && (
          <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
            <div className="grid md:grid-cols-5 grid-cols-1 gap-3">
              <input
                placeholder={t("export.templateName")}
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
                placeholder={t("export.fieldsPlaceholder")}
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
                  {saving ? t("export.saving") : t("export.saveTemplate")}
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
                <th className="py-3 px-4 font-medium">{t("export.name")}</th>
                <th className="py-3 px-4 font-medium">{t("export.entity")}</th>
                <th className="py-3 px-4 font-medium">{t("export.format")}</th>
                <th className="py-3 px-4 font-medium">{t("export.fields")}</th>
                <th className="py-3 px-4 font-medium">{t("export.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-3 px-4" colSpan={5}>{t("export.loading")}</td></tr>
              ) : templates.length === 0 ? (
                <tr><td className="py-3 px-4 text-gray-500" colSpan={5}>{t("export.noTemplates")}</td></tr>
              ) : (
                templates.map((template) => (
                  <tr key={template.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{template.name}</td>
                    <td className="py-3 px-4 text-gray-700">{template.entity}</td>
                    <td className="py-3 px-4 text-gray-700">{template.format}</td>
                    <td className="py-3 px-4 text-gray-700">{Array.isArray(template.fields) ? template.fields.length : 0}</td>
                    <td className="py-3 px-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRunTemplate(template.id)}
                          disabled={running}
                          className="px-3 py-1.5 rounded-md bg-black text-white hover:bg-gray-800 text-xs disabled:opacity-60"
                        >
                          {running ? t("export.running") : t("export.run")}
                        </button>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 text-xs"
                        >
                          {t("export.delete")}
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
          <h3 className="text-md font-semibold">{t("export.recentRuns")}</h3>
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
              placeholder={t("export.fieldsPlaceholder")}
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
              {running ? t("export.running") : t("export.runAdhoc")}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-600">
                <th className="py-3 px-4 font-medium">{t("export.name")}</th>
                <th className="py-3 px-4 font-medium">{t("export.entity")}</th>
                <th className="py-3 px-4 font-medium">{t("export.format")}</th>
                <th className="py-3 px-4 font-medium">{t("export.status")}</th>
                <th className="py-3 px-4 font-medium">{t("export.rows")}</th>
                <th className="py-3 px-4 font-medium">{t("export.finished")}</th>
                <th className="py-3 px-4 font-medium">{t("export.download")}</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 ? (
                <tr><td className="py-3 px-4 text-gray-500" colSpan={7}>{t("export.noRuns")}</td></tr>
              ) : (
                runs.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{r.name || t("export.adHoc")}</td>
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
                          {t("export.download")}
                        </a>
                      ) : r.status === 'Completed' && !r.file_url ? (
                        <span className="text-orange-500 text-xs" title={r.error || "Storage upload failed"}>
                          ⚠️ {t("export.noFile")}
                        </span>
                      ) : r.status === 'Failed' ? (
                        <span className="text-red-500 text-xs" title={r.error || "Run failed"}>
                          ❌ {t("export.failed")}
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