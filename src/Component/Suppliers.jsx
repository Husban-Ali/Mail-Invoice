// NEW: Core Flow Implementation - split from MasterData: Suppliers page
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { listSuppliers, updateSupplier, mergeSuppliers, blockSuppliers, createSupplier, deleteSuppliers, getSupplierDuplicates } from '../lib/api';

const initialSuppliers = [
  { id: 's1', name: 'ACME Corp', tax_id: '12345', country: 'US', category: 'Default', status: 'Active' },
  { id: 's2', name: 'ACME Limited', tax_id: '54321', country: 'US', category: 'Default', status: 'Active' },
  { id: 's3', name: 'Beta LLC', tax_id: '99887', country: 'DE', category: 'Default', status: 'Inactive' },
  { id: 's4', name: 'Gamma Ltd', tax_id: '11223', country: 'FR', category: 'Default', status: 'Active' },
];

export default function Suppliers() {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [mode, setMode] = useState('list'); // list | edit | merge | block
  const [msg, setMsg] = useState('');

  // Edit form state
  const [editForm, setEditForm] = useState({ id: null, name: '', taxId: '', country: '', category: '' });

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const openEdit = () => {
    if (selectedIds.size !== 1) { setMsg('Select one supplier to edit'); return; }
    const id = Array.from(selectedIds)[0];
    const s = suppliers.find(x => x.id === id);
    if (!s) return;
    setEditForm({ id: s.id, name: s.name, taxId: s.tax_id || s.taxId, country: s.country, category: s.category });
    setMode('edit'); setMsg('');
  };

  const openCreate = () => {
    setEditForm({ id: null, name: '', taxId: '', country: '', category: '' });
    setMode('edit'); setMsg('');
  };

  const deleteSelected = async () => {
    try {
      if (selectedIds.size === 0) { setMsg('Select one or more suppliers to delete'); return; }
      const ids = Array.from(selectedIds);
      await deleteSuppliers(ids);
      setMsg('Deleted');
      setSelectedIds(new Set());
      await fetchSuppliers();
    } catch (err) {
      console.error('Delete failed', err);
      setMsg('Delete failed');
    }
  };

  const saveEdit = async () => {
    try {
      const payload = { name: editForm.name, tax_id: editForm.taxId, country: editForm.country, category: editForm.category };
      if (editForm.id) {
        await updateSupplier(editForm.id, payload);
        setMsg('Supplier updated');
      } else {
        await createSupplier(payload);
        setMsg('Supplier created');
      }
      await fetchSuppliers();
      setMode('list'); setSelectedIds(new Set());
    } catch (err) {
      console.error('Save failed', err);
      setMsg('Save failed');
    }
  };

  const openMerge = () => {
    if (selectedIds.size < 2) { setMsg('Select two or more suppliers to merge'); return; }
    setMode('merge'); setMsg('');
  };

  const [duplicateGroups, setDuplicateGroups] = useState([]);

  const findDuplicates = async () => {
    try {
      setMsg('');
      const resp = await getSupplierDuplicates();
      if (resp && resp.groups) setDuplicateGroups(resp.groups);
      else setDuplicateGroups([]);
    } catch (err) {
      console.error('Find duplicates failed', err);
      setMsg('Find duplicates failed');
    }
  };

  const doMerge = async () => {
    try {
      const ids = Array.from(selectedIds);
      const primaryId = ids[0];
      await mergeSuppliers(ids, primaryId);
      setMsg('Suppliers merged');
      await fetchSuppliers();
      setSelectedIds(new Set()); setMode('list');
    } catch (err) {
      console.error('Merge failed', err);
      setMsg('Merge failed');
    }
  };

  const openBlock = () => {
    if (selectedIds.size === 0) { setMsg('Select one or more suppliers to block'); return; }
    setMode('block'); setMsg('');
  };

  const doBlock = async () => {
    try {
      const ids = Array.from(selectedIds);
      await blockSuppliers(ids);
      setMsg('Supplier(s) blocked');
      await fetchSuppliers();
      setSelectedIds(new Set()); setMode('list');
    } catch (err) {
      console.error('Block failed', err);
      setMsg('Block failed');
    }
  };

  // Fetch suppliers from backend
  const fetchSuppliers = async () => {
    try {
      const resp = await listSuppliers();
      if (resp && resp.data) setSuppliers(resp.data);
      else setSuppliers(initialSuppliers);
    } catch (err) {
      console.warn('Could not fetch suppliers, using local sample', err.message || err);
      setSuppliers(initialSuppliers);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const cancelMode = () => { setMode('list'); setMsg(''); };

  return (
    <div className="p-6">
      <div className="max-w-full">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4">{t("suppliers.title")}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-100">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="p-3 border-b w-10"><input type="checkbox" onChange={(e)=>{
                    if (e.target.checked) setSelectedIds(new Set(suppliers.map(s=>s.id))); else setSelectedIds(new Set());
                  }} checked={selectedIds.size === suppliers.length} /></th>
                  <th className="p-3 border-b text-left">{t("suppliers.name")}</th>
                  <th className="p-3 border-b text-left">{t("suppliers.status")}</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 text-sm">
                    <td className="p-3 border-b"><input type="checkbox" checked={selectedIds.has(r.id)} onChange={()=>toggleSelect(r.id)} /></td>
                    <td className="p-3 border-b">{r.name}</td>
                    <td className="p-3 border-b text-right">{
                      r.status === 'Merged' ? <span className="text-green-600 font-medium">Merged</span>
                      : r.status === 'Blocked' ? <span className="text-red-600 font-medium">Blocked</span>
                      : <span className="text-gray-500">{r.status}</span>
                    }</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic panel based on mode */}
        {mode === 'list' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{t("suppliers.details")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("suppliers.supplier")}</label>
                <input className="w-full border border-gray-200 rounded-md p-2" value={suppliers.find(s=>selectedIds.size===1?s.id===Array.from(selectedIds)[0]: 'ACME Corp')?.name || 'ACME Corp'} readOnly />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("suppliers.taxId")}</label>
                <input className="w-full border border-gray-200 rounded-md p-2" value={suppliers.find(s=>selectedIds.size===1?s.id===Array.from(selectedIds)[0]: 'ACME Corp')?.taxId || '12345'} readOnly />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("suppliers.country")}</label>
                <input className="w-full border border-gray-200 rounded-md p-2" value={suppliers.find(s=>selectedIds.size===1?s.id===Array.from(selectedIds)[0]: 'ACME Corp')?.country || 'US'} readOnly />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("suppliers.category")}</label>
                <input className="w-full border border-gray-200 rounded-md p-2" value={suppliers.find(s=>selectedIds.size===1?s.id===Array.from(selectedIds)[0]: 'ACME Corp')?.category || 'Default'} readOnly />
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-3">
                  <button onClick={openCreate} className="px-6 py-2 border border-gray-300 rounded-md">{t("suppliers.add")}</button>
                  <button onClick={openEdit} className="px-6 py-2 border border-gray-300 rounded-md">{t("suppliers.editInfo")}</button>
                  <button onClick={openMerge} className="px-6 py-2 bg-black text-white rounded-md">{t("suppliers.merge")}</button>
                  <button onClick={findDuplicates} className="px-6 py-2 border border-gray-300 rounded-md">{t("suppliers.findDuplicates")}</button>
                  <button onClick={openBlock} className="px-6 py-2 border border-gray-300 rounded-md">{t("suppliers.blockSupplier")}</button>
                  <button onClick={deleteSelected} className="px-6 py-2 border border-red-300 text-red-700 rounded-md">{t("suppliers.delete")}</button>
                </div>
              <div className="text-xs text-gray-500">{msg}</div>
            </div>
          </div>
        )}

        {mode === 'edit' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{t("suppliers.editSupplierInfo")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("suppliers.supplier")}</label>
                <input className="w-full border border-gray-200 rounded-md p-2" value={editForm.name} onChange={(e)=>setEditForm({...editForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("suppliers.taxId")}</label>
                <input className="w-full border border-gray-200 rounded-md p-2" value={editForm.taxId} onChange={(e)=>setEditForm({...editForm, taxId: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("suppliers.country")}</label>
                <input className="w-full border border-gray-200 rounded-md p-2" value={editForm.country} onChange={(e)=>setEditForm({...editForm, country: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("suppliers.category")}</label>
                <input className="w-full border border-gray-200 rounded-md p-2" value={editForm.category} onChange={(e)=>setEditForm({...editForm, category: e.target.value})} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-3">
                <button onClick={saveEdit} className="px-6 py-2 bg-black text-white rounded-md">{t("suppliers.saveChanges")}</button>
                <button onClick={cancelMode} className="px-6 py-2 border border-gray-300 rounded-md">{t("suppliers.cancel")}</button>
              </div>
              <div className="text-xs text-gray-500">{msg}</div>
            </div>
          </div>
        )}

        {mode === 'merge' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{t("suppliers.mergeSuppliers")}</h3>
            <div className="mb-4">
              <div className="text-sm text-gray-700">{t("suppliers.merging")}</div>
              <div className="text-sm font-medium">{Array.from(selectedIds).map(id=>suppliers.find(s=>s.id===id)?.name).filter(Boolean).join('  =  ')}</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-700">{t("suppliers.result")}</div>
              <ul className="text-sm list-disc ml-6">
                <li>{t("suppliers.keepFirst")}</li>
                <li>{t("suppliers.combineInvoices")}</li>
                <li>{t("suppliers.archiveDuplicates")}</li>
              </ul>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-3">
                <button onClick={doMerge} className="px-6 py-2 bg-black text-white rounded-md">{t("suppliers.saveChanges")}</button>
                <button onClick={cancelMode} className="px-6 py-2 border border-gray-300 rounded-md">{t("suppliers.cancel")}</button>
              </div>
              <div className="text-xs text-gray-500">{msg}</div>
            </div>
          </div>
        )}

        {/* Duplicate groups panel */}
        {duplicateGroups && duplicateGroups.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
            <h3 className="text-lg font-semibold mb-4">{t("suppliers.duplicateGroups")}</h3>
            <div className="space-y-4">
              {duplicateGroups.map((g, idx) => (
                <div key={idx} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{t("suppliers.group")} {idx + 1} — {g.length || (g.suppliers?.length || 0)} {t("suppliers.records")}</div>
                    <div className="flex gap-2">
                      <button onClick={()=>{ const arr = g.map ? g.map(s=>s.id) : (g.suppliers||[]).map(s=>s.id); setSelectedIds(new Set(arr)); setMode('merge'); setMsg('Selected group for merge'); }} className="px-3 py-1 border rounded-md text-sm">{t("suppliers.selectMerge")}</button>
                      <button onClick={()=>{ const arr = g.map ? g.map(s=>s.id) : (g.suppliers||[]).map(s=>s.id); setSelectedIds(new Set(arr)); setMsg('Selected group'); }} className="px-3 py-1 border rounded-md text-sm">{t("suppliers.select")}</button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                    {(g.suppliers || g).map(s => (
                      <div key={s.id} className="p-2 border rounded-md text-xs">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-gray-500">{s.vat_number || s.tax_id || (s.metadata && s.metadata.vat) || ''}</div>
                        <div className="text-gray-500">{s.email || (s.metadata && s.metadata.email) || ''}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'block' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{t("suppliers.blockSuppliers")}</h3>
            <div className="mb-4">
              <div className="text-sm text-gray-700">{t("suppliers.confirmBlock")}</div>
              <div className="text-sm font-medium">{Array.from(selectedIds).map(id=>suppliers.find(s=>s.id===id)?.name).filter(Boolean).join(', ')}</div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-3">
                <button onClick={doBlock} className="px-6 py-2 bg-black text-white rounded-md">{t("suppliers.confirmBlockBtn")}</button>
                <button onClick={cancelMode} className="px-6 py-2 border border-gray-300 rounded-md">{t("suppliers.cancel")}</button>
              </div>
              <div className="text-xs text-gray-500">{msg}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
