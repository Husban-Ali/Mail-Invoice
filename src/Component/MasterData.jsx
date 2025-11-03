// NEW: Core Flow Implementation - MasterData hub page linking to Suppliers
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function MasterData({ setActiveMenu }) {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{t("masterData.title")}</h2>
          <p className="text-gray-600 mt-1">{t("masterData.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Suppliers Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{t("masterData.suppliers")}</h3>
              <p className="text-sm text-gray-600">{t("masterData.suppliersDesc")}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setActiveMenu && setActiveMenu('suppliers')}
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                {t("masterData.openSuppliers")}
              </button>
            </div>
          </div>

          {/* Future entities placeholder */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col opacity-70">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{t("masterData.products")}</h3>
              <p className="text-sm text-gray-600">{t("masterData.productsDesc")}</p>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 border rounded-md text-gray-500" disabled>{t("masterData.notAvailable")}</button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col opacity-70">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{t("masterData.taxCodes")}</h3>
              <p className="text-sm text-gray-600">{t("masterData.taxCodesDesc")}</p>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 border rounded-md text-gray-500" disabled>{t("masterData.notAvailable")}</button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col opacity-70">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{t("masterData.categories")}</h3>
              <p className="text-sm text-gray-600">{t("masterData.categoriesDesc")}</p>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 border rounded-md text-gray-500" disabled>{t("masterData.notAvailable")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
