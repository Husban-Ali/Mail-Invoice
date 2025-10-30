import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import navlogo1 from "../../assets/navlogo1.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const sync = () => {
      try {
        const session = localStorage.getItem('session');
        const flag = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(!!session || flag === 'true');
      } catch (e) {
        setIsLoggedIn(false);
      }
    };

    sync();
    window.addEventListener('auth-change', sync);
    return () => window.removeEventListener('auth-change', sync);
  }, []);

  const currentLang = i18n.language === "de" ? "German" : "English";

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setShowLangDropdown(false);
  };

  const navLinks = [
    { en: "about", de: "Über uns", href: "/about" },
    { en: "features", de: "Funktionen", href: "/features" },
    { en: "resources", de: "Ressourcen", href: "/resources" },
    { en: "contact", de: "Kontakt", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center select-none"
        >
          <motion.img
            src={navlogo1}
            alt="Mail Invoice Logo"
            className="h-16 w-auto object-contain select-none"
          />
        </motion.div>

        {/* Desktop Links */}
        <motion.div
          className="hidden md:flex items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.href}
              className="text-black text-lg font-dm font-semibold hover:text-black transition cursor-pointer"
            >
              {i18n.language === "de" ? link.de : link.en}
            </NavLink>
          ))}
        </motion.div>

        {/* Desktop Right Section */}
        <motion.div
          className="hidden md:flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          {!isLoggedIn ? (
            <>
              <a
                href="/login"
                className="px-4 py-2 border border-black rounded-md bg-white text-sm cursor-pointer hover:bg-gray-50"
              >
                {i18n.language === "de" ? "Einloggen" : "login Now"}
              </a>
              <a
                href="/signup"
                className="px-4 py-2 bg-black text-white rounded-md border border-black text-sm cursor-pointer hover:bg-gray-800"
              >
                {i18n.language === "de" ? "Registrieren" : "sign Up Now"}
              </a>
            </>
          ) : (
            <>
              <a
                href="/dashboard"
                className="px-4 py-2 border border-black rounded-md bg-white text-sm cursor-pointer hover:bg-gray-50"
              >
                Dashboard
              </a>
              <button
                onClick={() => {
                  try { localStorage.removeItem('session'); localStorage.removeItem('isLoggedIn'); } catch {}
                  // notify listeners
                  window.dispatchEvent(new Event('auth-change'));
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-black text-white rounded-md border border-black text-sm cursor-pointer hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          )}

          {/* Language Dropdown */}
          <div className="relative ml-3">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 text-base font-semibold text-black cursor-pointer hover:text-gray-700"
            >
              {currentLang} <ChevronDown size={16} />
            </button>

            <AnimatePresence>
              {showLangDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md border border-gray-200"
                >
                  <button
                    onClick={() => changeLanguage("en")}
                    className="block w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("de")}
                    className="block w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    German
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
