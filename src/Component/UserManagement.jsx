import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUsers, updateUserStatus } from '../lib/api';

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    }
    setLoading(false);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{t("userManagement.title")}</h2>
      {loading ? (
        <div>{t("userManagement.loading")}</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-3">{t("userManagement.name")}</th>
              <th className="py-2 px-3">{t("userManagement.email")}</th>
              <th className="py-2 px-3">{t("userManagement.status")}</th>
              <th className="py-2 px-3">{t("userManagement.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-200">
                <td className="py-2 px-3">{user.name}</td>
                <td className="py-2 px-3">{user.email}</td>
                <td className="py-2 px-3">{user.status}</td>
                <td className="py-2 px-3">
                  <select
                    value={user.status}
                    onChange={e => handleStatusChange(user.id, e.target.value)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded-md"
                  >
                    <option value="active">{t("userManagement.active")}</option>
                    <option value="inactive">{t("userManagement.inactive")}</option>
                    <option value="blocked">{t("userManagement.blocked")}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
