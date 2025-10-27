import React from "react";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

function Header({ activeMenu }) {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === "en" ? "de" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang); 
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center justify-between mx-6 my-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span className=" font-inter text-black font-medium">
          {t("sidebar.home")}
        </span>
        {activeMenu !== "home" && (
          <>
            <span>›</span>
            <span className="text-gray-800 font-semibold">
              {t(`sidebar.${activeMenu}`)}
            </span>
          </>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          {i18n.language === "en" ? "GER" : "ENG"}
        </button>
        <Bell size={18} className="text-gray-600 " />
      </div>
    </div>
  );
}

export default Header;
