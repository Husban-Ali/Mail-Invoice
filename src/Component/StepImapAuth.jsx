import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaServer, FaHashtag } from "react-icons/fa";
import { testImapConnection, createAccount } from "../lib/api";

const StepImapAuth = ({ onSuccess, preset, providerName }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    host: preset?.host || "",
    port: preset?.port || "993",
    tls: preset?.tls !== undefined ? preset.tls : true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update form when preset changes
  useEffect(() => {
    if (preset) {
      setFormData(prev => ({
        ...prev,
        host: preset.host || prev.host,
        port: preset.port || prev.port,
        tls: preset.tls !== undefined ? preset.tls : prev.tls,
      }));
    }
  }, [preset]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const quickFill = (presetKey) => {
    const presets = {
      gmail: { host: 'imap.gmail.com', port: '993', tls: true },
      outlook: { host: 'outlook.office365.com', port: '993', tls: true },
      yahoo: { host: 'imap.mail.yahoo.com', port: '993', tls: true },
    };
    const cfg = presets[presetKey];
    if (cfg) setFormData((s)=>({ ...s, ...cfg }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // 1) Test IMAP connection
    await testImapConnection({
      email: formData.email,
      password: formData.password,
      host: formData.host,
      port: Number(formData.port),
      tls: !!formData.tls,
    });

    // 2) Save account to Supabase
    const account = await createAccount("imap", formData.email, {
      host: formData.host,
      port: Number(formData.port),
      tls: !!formData.tls,
      // NOTE: storing passwords in plain text is not recommended; the backend mentions encryption.
      // In many setups, you wouldn't store the password; kept here for demo continuity only.
      password: formData.password,
    });

    if (onSuccess) {
      onSuccess({
        email: formData.email,
        password: formData.password,
        host: formData.host,
        port: Number(formData.port),
        tls: !!formData.tls,
        accountId: account?.id,
      });
    }
  } catch (err) {
    console.error("Fetch failed:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6">
      {/* Title for provider */}
      {providerName && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Connect {providerName} Account</h3>
          <p className="text-sm text-gray-600 mt-1">
            Enter your {providerName} email and App Password. 
            {providerName === 'Gmail' && ' (Generate App Password: Google Account → Security → 2-Step Verification → App passwords)'}
            {providerName === 'Outlook' && ' (Generate App Password: Microsoft Account → Security → App passwords)'}
          </p>
        </div>
      )}
      
      {/* Helpful presets and tips - only show if no preset (IMAP mode) */}
      {!preset && (
        <div className="mb-4 text-sm text-gray-700">
          <div className="flex gap-2 mb-2">
            <span>Quick presets:</span>
            <button type="button" onClick={()=>quickFill('gmail')} className="px-2 py-1 border rounded hover:bg-gray-50">Gmail</button>
            <button type="button" onClick={()=>quickFill('outlook')} className="px-2 py-1 border rounded hover:bg-gray-50">Outlook</button>
            <button type="button" onClick={()=>quickFill('yahoo')} className="px-2 py-1 border rounded hover:bg-gray-50">Yahoo</button>
          </div>
          <p className="text-gray-600">
            Tip: Many providers require an App Password for IMAP (Gmail, Outlook, Yahoo). Use port 993 with TLS enabled.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <div className="relative mt-1">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder={providerName ? `your-email@${providerName.toLowerCase()}.com` : "example@gmail.com"}
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            {providerName ? 'App Password' : 'Password / App Password'}
          </label>
          <div className="relative mt-1">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>

        {/* IMAP Host - Hidden when preset is provided */}
        {!preset && (
          <div>
            <label className="block text-sm font-medium text-gray-600">
              IMAP Host
            </label>
            <div className="relative mt-1">
              <FaServer className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="host"
                placeholder="imap.gmail.com"
                value={formData.host}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>
        )}

        {/* Port - Hidden when preset is provided */}
        {!preset && (
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Port
            </label>
            <div className="relative mt-1">
              <FaHashtag className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                name="port"
                placeholder="993"
                value={formData.port}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>
        )}

        {/* TLS - Hidden when preset is provided */}
        {!preset && (
          <div className="flex items-center gap-2">
            <input
              id="tls"
              type="checkbox"
              name="tls"
              checked={!!formData.tls}
              onChange={(e)=>setFormData(s=>({...s, tls: e.target.checked }))}
            />
            <label htmlFor="tls" className="text-sm text-gray-700">Use TLS (recommended)</label>
          </div>
        )}

        {/* Error Display */}
        {error && <p className="text-red-600 text-sm whitespace-pre-wrap">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Connecting..." : "Connect"}
        </button>
      </form>
    </div>
  );
};

export default StepImapAuth;
