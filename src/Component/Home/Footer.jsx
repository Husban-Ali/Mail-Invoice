import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-gray-400 px-8 py-10 border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start">
        
        {/* Left Section */}
        <div className="mb-8 md:mb-0 md:w-2/3">
          <h2 className="text-white text-lg font-semibold mb-3 tracking-wide">
            MAIL INVOICE
          </h2>
          <p className="text-sm leading-relaxed mb-4 max-w-md">
            {t("Connect inboxes (Gmail, Outlook, IMAP), auto-detect PDF & XML invoices, clean vendor data.")}
          </p>

          {/* Social Icon */}
          <a
            href="#"
            className="inline-block text-gray-400 hover:text-white text-xl transition"
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </div>

        {/* Right Section */}
        <div className="md:w-1/3 text-center md:text-right">
          <h4 className="text-white font-semibold mb-4">{t("Quick Links")}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">{t("About")}</a></li>
            <li><a href="#" className="hover:text-white">{t("Features")}</a></li>
            <li><a href="#" className="hover:text-white">{t("Resources")}</a></li>
            <li><a href="#" className="hover:text-white">{t("Contact")}</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
