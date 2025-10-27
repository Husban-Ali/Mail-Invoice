import React, { useState } from "react";
import { createRule, updateRule } from '../lib/api';

export default function AddRuleBuilder({ onSaved, initialRule = null, onCancel }) {
  const [ruleName, setRuleName] = useState(initialRule?.name || "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  // Simple single-condition & single-action form fields (expandable later)
  const [condField, setCondField] = useState(initialRule?.conditions?.[0]?.field || 'Amount');
  const [condOp, setCondOp] = useState(initialRule?.conditions?.[0]?.operator || '>');
  const [condValue, setCondValue] = useState(initialRule?.conditions?.[0]?.value || '500');

  const [actionType, setActionType] = useState(initialRule?.actions?.[0]?.type || 'Move to Archive');
  const [actionDetail, setActionDetail] = useState(initialRule?.actions?.[0]?.detail || '');

  const saveRule = async () => {
    setMsg('');
    if (!ruleName) return setMsg('Please provide a rule name');
    setBusy(true);
    try {
      const cond = { field: condField, operator: condOp, value: condValue };
      const act = { type: actionType, detail: actionDetail };
      const payload = { name: ruleName, conditions: [cond], actions: [act], active: true };

      const body = initialRule && initialRule.id
        ? await updateRule(initialRule.id, payload)
        : await createRule(payload);

      setMsg('Rule saved');
      if (onSaved) onSaved(body?.data || body);
    } catch (e) {
      setMsg(e?.message || 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 m-6">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-5">Add Rule Builder</h2>

      {/* Rule Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
        <input
          type="text"
          placeholder="Auto Archive EU Invoices"
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-black focus:outline-none"
        />
      </div>

      {/* IF Condition Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">IF (Condition)</label>
          <button className="text-sm text-black hover:underline">+ Add New Condition</button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select value={condField} onChange={(e) => setCondField(e.target.value)} className="border border-gray-300 rounded-md p-2 w-40 focus:ring-2 focus:ring-black">
            <option>Amount</option>
            <option>Status</option>
            <option>Country</option>
            <option>Vendor</option>
          </select>

          <select value={condOp} onChange={(e) => setCondOp(e.target.value)} className="border border-gray-300 rounded-md p-2 w-40 focus:ring-2 focus:ring-black">
            <option>=</option>
            <option>!=</option>
            <option>{`>`}</option>
            <option>{`<`}</option>
          </select>

          <input value={condValue} onChange={(e) => setCondValue(e.target.value)} placeholder="Value" className="border border-gray-300 rounded-md p-2 w-40 focus:ring-2 focus:ring-black" />

          <button className="border border-gray-300 rounded-md p-2 text-sm text-gray-600 hover:bg-gray-100">Add multiple conditions</button>
        </div>
      </div>

      {/* THEN Actions Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">THEN (Actions)</label>
          <button className="text-sm text-black hover:underline">+ Add New Action</button>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="border border-gray-300 rounded-md p-2 w-52 focus:ring-2 focus:ring-black">
            <option>Notify Accountant</option>
            <option>Move to Archive</option>
            <option>Apply Tax Rule</option>
            <option>Export CSV</option>
          </select>

          <input value={actionDetail} onChange={(e) => setActionDetail(e.target.value)} placeholder="Details (email/tag/etc)" className="border border-gray-300 rounded-md p-2 w-52 focus:ring-2 focus:ring-black" />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-8">
        <div className="flex items-center gap-3">
          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800" disabled>
            Test Rule
          </button>

          <button onClick={saveRule} disabled={busy} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
            {busy ? 'Saving...' : 'Save & Activate'}
          </button>
        </div>
        {msg && <div className="text-sm text-gray-600 mt-3">{msg}</div>}
      </div>
    </div>
  );
}
