import React, { useMemo, useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';

// Map provider to IMAP settings
const PROVIDER_IMAP = {
  gmail: { host: 'imap.gmail.com', port: 993 },
  outlook: { host: 'outlook.office365.com', port: 993 },
};

function StepAuthenticate({ selectedProvider = 'gmail', onSuccess }) {
  const defaults = useMemo(() => PROVIDER_IMAP[selectedProvider] || PROVIDER_IMAP.gmail, [selectedProvider]);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      email: form.email,
      password: form.password,
      host: defaults.host,
      port: defaults.port,
    };

    try {
      // 1) Fast connectivity test
      const res = await fetch('http://localhost:8080/api/invoices/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'IMAP connection failed');

      // 2) Save account row
      const accountRes = await fetch('http://localhost:8080/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          email: form.email,
          status: 'connected',
          meta: { host: defaults.host, port: defaults.port },
        }),
      });
      const accountData = await accountRes.json();
      if (!accountRes.ok) throw new Error(accountData.error || 'Account save failed');

      // 3) Proceed to folder selection; pass creds up
      const accountId = accountData?.data?.id || accountData?.id || accountData?.[0]?.id;
      alert('✅ Connected and account saved!');
      if (onSuccess) onSuccess({
        accountId,
        email: form.email,
        password: form.password,
        host: defaults.host,
        port: defaults.port,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <div className="relative mt-1">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">App Password</label>
          <div className="relative mt-1">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      </form>
    </div>
  );
}

export default StepAuthenticate;
