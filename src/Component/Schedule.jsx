// Schedule.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRetrievalConfig, setRetrievalConfig, runRetrievalNow } from "../lib/api";

const Schedule = () => {
  const { t } = useTranslation();
  const [frequency, setFrequency] = useState("every30");
  const [nextRun, setNextRun] = useState("10:15");
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  // NEW: Core Flow Implementation - storage provider and backfill configuration
  const [storage, setStorage] = useState('supabase');
  const [backfill, setBackfill] = useState({ startDate: '', endDate: '', emailLimit: 500 });

  useEffect(()=>{
    let canceled = false;
    (async ()=>{
      try{ const cfg = await getRetrievalConfig(); if (!canceled){
        setFrequency(cfg.frequency || 'every30');
        setNextRun(cfg.nextRun || '10:15');
        setStorage(cfg.storage || 'supabase');
        setBackfill({
          startDate: cfg.backfill?.startDate || '',
          endDate: cfg.backfill?.endDate || '',
          emailLimit: cfg.backfill?.emailLimit ?? 500,
        });
      } }catch{}
    })();
    return ()=>{ canceled = true; };
  },[]);

  useEffect(()=>{
    // debounce save
    const t = setTimeout(async ()=>{
      try {
        setSaving(true);
        await setRetrievalConfig({ frequency, nextRun, storage, backfill });
      }
      catch {}
      finally { setSaving(false); }
    }, 400);
    return ()=>clearTimeout(t);
  }, [frequency, nextRun, storage, backfill]);

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
      <h3 className="font-semibold lowercase text-lg mb-4">
        {t("schedule.title")}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block lowercase text-sm text-gray-600 mb-1">
            {t("schedule.frequency")}
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full lowercase border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="every15">{t("schedule.every15")}</option>
            <option value="every30">{t("schedule.every30")}</option>
            <option value="hourly">{t("schedule.hourly")}</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {saving && <div className="text-xs text-gray-500 mt-1">Saving…</div>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {t("schedule.nextRun")}
          </label>
          <input
            type="time"
            value={nextRun}
            onChange={(e)=>setNextRun(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* NEW: Core Flow Implementation - storage provider selection */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Storage Provider
          </label>
          <select
            value={storage}
            onChange={(e) => setStorage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="supabase">Supabase</option>
            <option value="gdrive">Google Drive (soon)</option>
            <option value="onedrive">OneDrive (soon)</option>
          </select>
        </div>

        {/* NEW: Core Flow Implementation - backfill controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Backfill Start</label>
            <input
              type="date"
              value={backfill.startDate || ''}
              onChange={(e)=>setBackfill((b)=>({ ...b, startDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Backfill End</label>
            <input
              type="date"
              value={backfill.endDate || ''}
              onChange={(e)=>setBackfill((b)=>({ ...b, endDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email Limit</label>
            <input
              type="number"
              min={1}
              step={1}
              value={backfill.emailLimit ?? 500}
              onChange={(e)=>setBackfill((b)=>({ ...b, emailLimit: Number(e.target.value || 0) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          className="px-4 py-2 bg-black lowercase  text-white rounded-lg hover:bg-gray-800 disabled:opacity-60"
          onClick={async ()=>{ setRunning(true); try { await runRetrievalNow(); window.dispatchEvent(new CustomEvent('invoices:refresh')); } finally{ setRunning(false); } }}
          disabled={running}
        >
          {t("schedule.runNow")}
        </button>
      </div>
    </div>
  );
};

export default Schedule;
