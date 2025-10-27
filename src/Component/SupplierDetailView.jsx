// Component/SupplierDetailView.jsx
// NEW: Core Flow Implementation - detailed supplier view with contacts, invoices, audit history
import React, { useEffect, useState } from 'react';
import { getSupplier, listSupplierContacts, createSupplierContact, updateSupplierContact, deleteSupplierContact } from '../lib/api';

export default function SupplierDetailView({ supplierId, onClose }) {
  const [supplier, setSupplier] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview | contacts | invoices | audit

  const [contactForm, setContactForm] = useState({ name: '', role: '', email: '', phone: '', is_primary: false, notes: '' });
  const [editingContactId, setEditingContactId] = useState(null);

  useEffect(() => {
    loadSupplier();
  }, [supplierId]);

  const loadSupplier = async () => {
    try {
      setLoading(true);
      const resp = await getSupplier(supplierId);
      if (resp && resp.data) {
        setSupplier(resp.data);
        setContacts(resp.data.contacts || []);
        setInvoices(resp.data.invoices || []);
        setAudit(resp.data.audit || []);
      }
    } catch (err) {
      console.error('Failed to load supplier:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveContact = async () => {
    try {
      if (editingContactId) {
        await updateSupplierContact(editingContactId, contactForm);
      } else {
        await createSupplierContact(supplierId, contactForm);
      }
      setContactForm({ name: '', role: '', email: '', phone: '', is_primary: false, notes: '' });
      setEditingContactId(null);
      await loadSupplier();
    } catch (err) {
      console.error('Failed to save contact:', err);
    }
  };

  const deleteContact = async (contactId) => {
    try {
      await deleteSupplierContact(contactId);
      await loadSupplier();
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!supplier) return <div className="p-6">Supplier not found</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">{supplier.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {['overview', 'contacts', 'invoices', 'audit'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium ${activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Legal Name</label>
                  <div className="text-sm font-medium">{supplier.legal_name || '—'}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Aliases</label>
                  <div className="text-sm">{Array.isArray(supplier.aliases) ? supplier.aliases.join(', ') : '—'}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">VAT Number</label>
                  <div className="text-sm font-medium">{supplier.vat_number || '—'}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">VAT Status</label>
                  <div className={`text-sm font-medium ${supplier.vat_status === 'Valid' ? 'text-green-600' : supplier.vat_status === 'Invalid' ? 'text-red-600' : 'text-gray-500'}`}>
                    {supplier.vat_status || 'Unknown'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Country</label>
                  <div className="text-sm">{supplier.country || '—'}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Confidence Score</label>
                  <div className="text-sm font-medium">{supplier.confidence_score || 0}/100</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-2">Address</h3>
                <div className="text-sm text-gray-700">
                  {supplier.address_line1 && <div>{supplier.address_line1}</div>}
                  {supplier.address_line2 && <div>{supplier.address_line2}</div>}
                  {(supplier.city || supplier.state || supplier.postal_code) && (
                    <div>{[supplier.city, supplier.state, supplier.postal_code].filter(Boolean).join(', ')}</div>
                  )}
                  {!supplier.address_line1 && !supplier.city && <div className="text-gray-400">No address</div>}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-2">Contact Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span> {supplier.email || '—'}
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span> {supplier.phone || '—'}
                  </div>
                  <div>
                    <span className="text-gray-500">Website:</span> {supplier.website || '—'}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-2">Keywords (for email matching)</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(supplier.keywords) && supplier.keywords.length > 0 ? (
                    supplier.keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs">{kw}</span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No keywords</span>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-2">Accounting</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Code:</span> {supplier.accounting_code || '—'}
                  </div>
                  <div>
                    <span className="text-gray-500">Payment Terms:</span> {supplier.payment_terms || '—'}
                  </div>
                  <div>
                    <span className="text-gray-500">Currency:</span> {supplier.currency || 'USD'}
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span> {supplier.category || '—'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-sm font-semibold mb-3">Add/Edit Contact</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Name *"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="border rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Role"
                    value={contactForm.role}
                    onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                    className="border rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="border rounded-md px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Phone"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="border rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div className="mt-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={contactForm.is_primary}
                      onChange={(e) => setContactForm({ ...contactForm, is_primary: e.target.checked })}
                    />
                    Primary Contact
                  </label>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={saveContact} className="px-4 py-2 bg-black text-white rounded-md text-sm">
                    {editingContactId ? 'Update' : 'Add'} Contact
                  </button>
                  {editingContactId && (
                    <button onClick={() => { setEditingContactId(null); setContactForm({ name: '', role: '', email: '', phone: '', is_primary: false, notes: '' }); }} className="px-4 py-2 border rounded-md text-sm">
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Contacts</h3>
                {contacts.length === 0 ? (
                  <div className="text-gray-400 text-sm">No contacts</div>
                ) : (
                  <div className="space-y-2">
                    {contacts.map(c => (
                      <div key={c.id} className="p-3 border rounded-md flex justify-between items-start">
                        <div>
                          <div className="font-medium">{c.name} {c.is_primary && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Primary</span>}</div>
                          <div className="text-sm text-gray-600">{c.role || 'No role'}</div>
                          <div className="text-sm text-gray-500">{c.email || ''} {c.phone ? `• ${c.phone}` : ''}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setContactForm({ name: c.name, role: c.role || '', email: c.email || '', phone: c.phone || '', is_primary: c.is_primary, notes: c.notes || '' }); setEditingContactId(c.id); }} className="text-xs text-blue-600">Edit</button>
                          <button onClick={() => deleteContact(c.id)} className="text-xs text-red-600">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Related Invoices ({invoices.length})</h3>
              {invoices.length === 0 ? (
                <div className="text-gray-400 text-sm">No invoices linked</div>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-full border text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-2 border text-left">Date</th>
                        <th className="p-2 border text-left">Subject</th>
                        <th className="p-2 border text-left">Amount</th>
                        <th className="p-2 border text-left">File</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-gray-50">
                          <td className="p-2 border">{inv.date ? new Date(inv.date).toLocaleDateString() : '—'}</td>
                          <td className="p-2 border">{inv.subject || '—'}</td>
                          <td className="p-2 border">{inv.amount ? `${inv.amount} ${inv.currency || ''}` : '—'}</td>
                          <td className="p-2 border">{inv.filename || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Audit History ({audit.length})</h3>
              {audit.length === 0 ? (
                <div className="text-gray-400 text-sm">No audit records</div>
              ) : (
                <div className="space-y-2">
                  {audit.map(a => (
                    <div key={a.id} className="p-3 border rounded-md text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium capitalize">{a.action}</span> by {a.changed_by || 'system'}
                        </div>
                        <span className="text-xs text-gray-500">{new Date(a.created_at).toLocaleString()}</span>
                      </div>
                      {a.notes && <div className="text-gray-600 mt-1">{a.notes}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
