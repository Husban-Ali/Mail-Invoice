import React, { useState, useEffect } from "react";
import AddRuleBuilder from './AddRuleBuilder';
import { listRules, createRule, deleteRules as apiDeleteRules } from '../lib/api';

export default function RulesAutomation() {
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
        <h2 className="text-lg font-semibold">Rules & Automation</h2>
        <button onClick={() => setShowAddRule(true)} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
          Add New Rule
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
              <th className="p-3 border-b text-left">Name</th>
              <th className="p-3 border-b text-left">Trigger</th>
              <th className="p-3 border-b text-left">Action</th>
              <th className="p-3 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td></tr>
            ) : rules.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500">No rules defined</td></tr>
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
                    <span className="flex items-center text-green-600"><span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>Active</span>
                  ) : (
                    <span className="flex items-center text-gray-500"><span className="w-2.5 h-2.5 bg-gray-400 rounded-full mr-2"></span>Inactive</span>
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
          }} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Edit</button>

          <button onClick={async ()=>{
            // duplicate first selected
            const first = rules.find(r=> selectedIds.has(r.id));
            if (!first) return;
            try {
              const payload = { name: `${first.name} (Copy)`, conditions: first.conditions || [], actions: first.actions || [], active: first.active };
              await createRule(payload);
              loadRules();
            } catch (e) { console.warn('Duplicate failed', e); }
          }} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Duplicate</button>
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
        }} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Delete</button>
      </div>
      {showAddRule && (
        <AddRuleModal open={showAddRule} onClose={() => { setShowAddRule(false); setEditingRule(null); }} onSaved={(r)=>{ setShowAddRule(false); setEditingRule(null); loadRules(); }} initialRule={editingRule} />
      )}
    </div>
  );
}


function AddRuleModal({ open, onClose, onSaved, initialRule }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold">Add New Rule</h4>
          <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800">Close</button>
        </div>
        <AddRuleBuilder onSaved={onSaved} initialRule={initialRule} onCancel={onClose} />
      </div>
    </div>
  );
}
