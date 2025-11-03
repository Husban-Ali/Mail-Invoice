import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AddRuleBuilder from './AddRuleBuilder';
import { listRules, createRule, deleteRules as apiDeleteRules } from '../lib/api';

export default function RulesAutomation() {
  const { t } = useTranslation();
  const [showAddRule, setShowAddRule] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const loadRules = async () => {
    setLoading(true);
    try {
      const body = await listRules();
      setRules(Array.isArray(body?.data) ? body.data : (Array.isArray(body) ? body : []));
    } catch (e) {
      console.warn('Failed to load rules', e.message);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRules(); }, []);

  const getStatusBadge = (status) => {
    return status === "Active" ? (
      <span className="flex items-center text-green-600">
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
        Active
      </span>
    ) : (
      <span className="flex items-center text-gray-500">
        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full mr-2"></span>
        Inactive
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 m-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">{t("rulesAutomation.title")}</h2>
        <button onClick={() => setShowAddRule(true)} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
          {t("rulesAutomation.addNewRule")}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
            <tr>
              <th className="p-3 border-b w-10">
                <input type="checkbox" />
              </th>
              <th className="p-3 border-b text-left">{t("rulesAutomation.name")}</th>
              <th className="p-3 border-b text-left">{t("rulesAutomation.trigger")}</th>
              <th className="p-3 border-b text-left">{t("rulesAutomation.action")}</th>
              <th className="p-3 border-b text-left">{t("rulesAutomation.status")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">{t("rulesAutomation.loading")}</td></tr>
            ) : rules.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">{t("rulesAutomation.noRules")}</td></tr>
            ) : (
              rules.map((rule) => (
                <tr key={rule.id} className="text-sm hover:bg-gray-50">
                  <td className="p-3 border-b">
                    <input type="checkbox" checked={selectedIds.has(rule.id)} onChange={(e)=>{
                      const next = new Set(selectedIds);
                      if (e.target.checked) next.add(rule.id); else next.delete(rule.id);
                      setSelectedIds(next);
                    }} />
                  </td>
                  <td className="p-3 border-b">{rule.name}</td>
                  <td className="p-3 border-b">{
                    (Array.isArray(rule.conditions) && rule.conditions.length)
                      ? `${rule.conditions[0].field} ${rule.conditions[0].operator} ${rule.conditions[0].value}`
                      : '—'
                  }</td>
                  <td className="p-3 border-b">{
                    (Array.isArray(rule.actions) && rule.actions.length)
                      ? `${rule.actions[0].type}${rule.actions[0].detail ? `: ${rule.actions[0].detail}` : ''}`
                      : '—'
                  }</td>
                  <td className="p-3 border-b">{rule.active ? (
                    <span className="flex items-center text-green-600"><span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>{t("rulesAutomation.active")}</span>
                  ) : (
                    <span className="flex items-center text-gray-500"><span className="w-2.5 h-2.5 bg-gray-400 rounded-full mr-2"></span>{t("rulesAutomation.inactive")}</span>
                  )}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between items-center mt-5">
        <div className="flex space-x-3">
          <button onClick={() => {
            // open editor for first selected
            const first = rules.find(r=> selectedIds.has(r.id));
            if (first) { setEditingRule(first); setShowAddRule(true); }
          }} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">{t("rulesAutomation.edit")}</button>

          <button onClick={async ()=>{
            // duplicate first selected
            const first = rules.find(r=> selectedIds.has(r.id));
            if (!first) return;
            try {
              const payload = { name: `${first.name} (Copy)`, conditions: first.conditions || [], actions: first.actions || [], active: first.active };
              await createRule(payload);
              loadRules();
            } catch (e) { console.warn('Duplicate failed', e); }
          }} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">{t("rulesAutomation.duplicate")}</button>
        </div>

        <button onClick={async ()=>{
          // delete selected
          const ids = Array.from(selectedIds);
          if (ids.length === 0) return;
          try {
            await apiDeleteRules(ids);
            setSelectedIds(new Set());
            loadRules();
          } catch (e) { console.warn('Delete failed', e); }
        }} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">{t("rulesAutomation.delete")}</button>
      </div>
      {showAddRule && (
        <AddRuleModal open={showAddRule} onClose={() => { setShowAddRule(false); setEditingRule(null); }} onSaved={(r)=>{ setShowAddRule(false); setEditingRule(null); loadRules(); }} initialRule={editingRule} />
      )}
    </div>
  );
}


function AddRuleModal({ open, onClose, onSaved, initialRule }) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold">{t("rulesAutomation.addNewRule")}</h4>
          <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800">{t("rulesAutomation.close")}</button>
        </div>
        <AddRuleBuilder onSaved={onSaved} initialRule={initialRule} onCancel={onClose} />
      </div>
    </div>
  );
}
