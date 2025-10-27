import React, { useState } from 'react';
import { X, Upload, Send, Loader } from 'lucide-react';

const SendInvoiceModal = ({ isOpen, onClose, invoice, onSend }) => {
  const [formData, setFormData] = useState({
    to: '',
    subject: `Invoice ${invoice?.id || ''} from ${invoice?.company || ''}`,
    message: `Dear Sir/Madam,\n\nPlease find attached the invoice ${invoice?.id || ''} for ${invoice?.amount || ''}.\n\nBest regards`,
    file: null
  });
  const [sending, setSending] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type === 'text/xml' || file.name.endsWith('.xml')) {
        setFormData(prev => ({ ...prev, file }));
      } else {
        alert('Please upload PDF or XML files only');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type === 'text/xml' || file.name.endsWith('.xml')) {
        setFormData(prev => ({ ...prev, file }));
      } else {
        alert('Please upload PDF or XML files only');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.to || !formData.file) {
      alert('Please fill in email address and upload a file');
      return;
    }

    setSending(true);
    try {
      await onSend(invoice, formData);
      onClose();
      setFormData({
        to: '',
        subject: '',
        message: '',
        file: null
      });
    } catch (error) {
      alert(error.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Send Invoice via Email</h2>
            <p className="text-sm text-gray-500 mt-1">
              Invoice: {invoice?.id} | {invoice?.company} | {invoice?.amount}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* To Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email *
            </label>
            <input
              type="email"
              value={formData.to}
              onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
              placeholder="recipient@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Invoice subject"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Enter your message here..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach Invoice File (PDF/XML) *
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.xml"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {formData.file ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {formData.file.type === 'application/pdf' ? (
                      <span className="text-blue-600 font-semibold text-xs">PDF</span>
                    ) : (
                      <span className="text-purple-600 font-semibold text-xs">XML</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(formData.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                    className="ml-auto p-2 hover:bg-red-50 rounded-lg text-red-500 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">
                    Drag & drop your invoice file here, or <span className="text-blue-600 font-medium">browse</span>
                  </p>
                  <p className="text-xs text-gray-500">Supports PDF and XML files</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !formData.to || !formData.file}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sending ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendInvoiceModal;
