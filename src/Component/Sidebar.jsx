import { Link } from 'react-router-dom';

// ...existing code...

// Add User Management link
// Place this where you want in your sidebar JSX:
// <Link to="/user-management" className="sidebar-link">User Management</Link>
import React, { useState, useEffect } from "react";
import {
  Home,
  ShoppingBag,
  FileText,
  Users,
  Share2,
  BarChart3,
  Search,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem('session');
      if (s) {
        const parsed = JSON.parse(s);
        // Supabase session stores user object at session.user
        const u = parsed?.user || parsed?.user?.user || null;

        // Prefer explicit name from metadata, then name, then email local-part (before @)
        const email = u?.email || null;
        const emailLocal = email ? String(email).split('@')[0] : null;
        let name = u?.user_metadata?.name || u?.name || emailLocal || null;

        // Normalize simple display: remove dots/plus in Gmail local-part if it looks like an email local part
        if (!u?.user_metadata?.name && emailLocal) {
          // for gmail addresses like first.last or first+tag, show just first or joined
          name = emailLocal.replace(/[.+].*$/, '').replace(/\./g, ' ');
        }

        if (name) {
          // Title-case the name for nicer display
          name = String(name)
            .split(' ')
            .filter(Boolean)
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(' ');
        }

        setUserName(name);
        // avatar from metadata if present, else fallback to generated avatar using email hash
        const avatar = u?.user_metadata?.avatar_url || (email ? `https://i.pravatar.cc/100?u=${encodeURIComponent(email)}` : null);
        setUserAvatar(avatar);
      } else {
        setUserName(null);
        setUserAvatar(null);
      }
    } catch (e) {
      setUserName(null);
      setUserAvatar(null);
    }
  }, []);

  const homeItem = { key: "home", icon: Home, label: t("sidebar.home") };

  const operatorsItems = [
    { key: "emailSetup", icon: ShoppingBag, label: t("sidebar.emailSetup") },
    { key: "dataRetrieval", icon: FileText, label: t("sidebar.dataRetrieval") },
    { key: "scrapedData", icon: FileText, label: t("sidebar.scrapedData") },
    { key: "rulesAutomation", icon: Share2, label: t("sidebar.rulesAutomation") },
    { key: "masterData", icon: Users, label: t("sidebar.masterData") },
    { key: "suppliers", icon: Users, label: t("sidebar.suppliers") },
    { key: "export", icon: BarChart3, label: t("sidebar.export") },
  ];

  const settingsItems = [
    { key: "userManagement", label: t("sidebar.userManagement") },
    { key: "account", label: t("sidebar.account") },
    { key: "help", label: t("sidebar.help") },
  ];

  // 🔍 Combine all items for searching
  const allItems = [
    homeItem,
    ...operatorsItems,
    ...settingsItems.map((item) => ({ ...item, icon: null })),
  ];

  // 🔎 Filter items based on search term
  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouping logic
  const filteredHome = filteredItems.find((i) => i.key === "home");
  const filteredOperators = filteredItems.filter((i) =>
    operatorsItems.find((op) => op.key === i.key)
  );
  const filteredSettings = filteredItems.filter((i) =>
    settingsItems.find((s) => s.key === i.key)
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Top Section */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* App Name */}
        <div className="p-4">
          <h1 className="text-lg font-semibold text-gray-900 mb-4 lowercase">
            {t("appName")}
          </h1>

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder={(t("search") || "Search").toLowerCase()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full lowercase"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4">
          {/* Home */}
          {filteredHome && (
            <button
              onClick={() => setActiveMenu(homeItem.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 mb-3 rounded-md transition lowercase ${
                activeMenu === homeItem.key
                  ? "bg-gray-100 text-black font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <homeItem.icon size={18} />
              <span className="text-sm">{homeItem.label.toLowerCase()}</span>
            </button>
          )}

          {/* Operator Group */}
          {filteredOperators.length > 0 && (
            <>
              <p className="text-xs font-bold text-black lowercase mt-4 mb-2 px-3">
                operator
              </p>
              {filteredOperators.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 mb-1 rounded-md transition lowercase ${
                    activeMenu === item.key
                      ? "bg-gray-100 text-black font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm">{item.label.toLowerCase()}</span>
                </button>
              ))}
            </>
          )}

          {/* Setting Group */}
          {filteredSettings.length > 0 && (
            <>
              <p className="text-xs font-bold text-gray-500 lowercase mt-6 mb-2 px-3">
                setting
              </p>
              {filteredSettings.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key)}
                  className={`w-full text-left px-3 py-2 mb-1 text-sm rounded-md transition lowercase ${
                    activeMenu === item.key
                      ? "bg-gray-100 text-black font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label.toLowerCase()}
                </button>
              ))}
            </>
          )}

          {/* 🔸 No Results Message */}
          {filteredItems.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-8 lowercase">
              no results found
            </p>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        {/* User Profile */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={userAvatar || 'https://i.pravatar.cc/100'}
            alt="User"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 lowercase">
              {userName || 'guest user'}
            </p>
            <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md inline-block lowercase">
              {userName ? 'admin' : 'visitor'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={async () => {
            try {
              // attempt to sign out via supabase if available
              const mod = await import('../lib/supabaseClient');
              const supabase = mod?.supabase || mod?.default || null;
              if (supabase && supabase.auth && supabase.auth.signOut) {
                try { await supabase.auth.signOut(); } catch (e) { /* ignore */ }
              }
            } catch (e) {
              // ignore dynamic import errors
            }

            try { localStorage.removeItem('session'); } catch (e) {}
            try { localStorage.removeItem('isLoggedIn'); } catch (e) {}
            // notify other tabs/components
            window.dispatchEvent(new Event('auth-change'));
            // redirect to login
            window.location.href = '/login';
          }}
          className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-600 transition lowercase"
        >
          <LogOut size={16} />
          log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
