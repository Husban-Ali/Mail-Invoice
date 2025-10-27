// NEW: Core Flow Implementation - MasterData hub page linking to Suppliers
import React from 'react';

export default function MasterData({ setActiveMenu }) {
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Master Data</h2>
          <p className="text-gray-600 mt-1">Manage foundational data like suppliers and, in the future, products, tax codes, and categories.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Suppliers Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Suppliers</h3>
              <p className="text-sm text-gray-600">Directory, details, contacts, merge, review queue, and keyword matching for emails.</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setActiveMenu && setActiveMenu('suppliers')}
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                Open Suppliers
              </button>
            </div>
          </div>

          {/* Future entities placeholder */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col opacity-70">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Products (coming soon)</h3>
              <p className="text-sm text-gray-600">Standardize product catalog and mappings.</p>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 border rounded-md text-gray-500" disabled>Not Available</button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col opacity-70">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Tax Codes (coming soon)</h3>
              <p className="text-sm text-gray-600">Define tax codes and validation rules.</p>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 border rounded-md text-gray-500" disabled>Not Available</button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col opacity-70">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Categories (coming soon)</h3>
              <p className="text-sm text-gray-600">Set up spend categories and mappings.</p>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 border rounded-md text-gray-500" disabled>Not Available</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
