import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRetrievalConfig, setRetrievalConfig } from "../lib/api";

const FileTypes = () => {
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();

  const toggle = (type) => {
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  useEffect(()=>{
    let canceled = false;
    (async ()=>{
      try{ const cfg = await getRetrievalConfig(); if (!canceled) setSelected(Array.isArray(cfg.fileTypes)? cfg.fileTypes: []);}catch{}
    })();
    return ()=>{ canceled = true; };
  },[]);

  useEffect(()=>{
    // auto-save on change
    let t;
    if (selected) {
      t = setTimeout(async ()=>{
        try { setSaving(true); await setRetrievalConfig({ fileTypes: selected }); } catch {}
        finally { setSaving(false); }
      }, 400);
    }
    return ()=>{ if (t) clearTimeout(t); };
  },[selected]);

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-4">
        {t("fileTypes.title")}
      </h3>
      {saving && <div className="text-xs text-gray-500 mb-2">Saving…</div>}
      <div className="space-y-3">
        {["pdf", "xml", "others"].map((type) => (
          <label
            key={type}
            className="flex items-center gap-3 cursor-pointer text-gray-700"
          >
            <input
              type="checkbox"
              checked={selected.includes(type)}
              onChange={() => toggle(type)}
              className="w-4 h-4"
            />
            {t(`fileTypes.${type}`)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FileTypes;
