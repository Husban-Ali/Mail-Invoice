import React, { useEffect, useState } from "react";
import FileTypes from "./FileTypes";
import Schedule from "./Schedule";
import Logs from "./Logs";
import { useTranslation } from "react-i18next";
import { getRetrievalStatus, setRetrievalStatus } from "../lib/api";

const DataRetrievalMain = ({ setEnabled }) => {
  const [enabled, setEnabledLocal] = useState(true);
  useEffect(()=>{
    let cancelled = false;
    (async ()=>{
      try { const { enabled } = await getRetrievalStatus(); if (!cancelled) setEnabledLocal(!!enabled); }
      catch {}
    })();
    return ()=>{ cancelled = true; };
  },[]);

  const onEnable = async (val) => {
    try { await setRetrievalStatus(val); setEnabledLocal(val); setEnabled(val); }
    catch {}
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow border border-gray-200 max-w-auto mx-auto p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl lowercase font-semibold">Data Retrieval Status</h2>

          <div className="flex gap-4">
            <button
              onClick={() => onEnable(true)}
              className="px-6 py-2 rounded-lg lowercase border border-gray-300 text-gray-600 font-medium hover:bg-gray-100"
            >
              Enable
            </button>
            <button className="px-6 py-2 rounded-lg lowercase border bg-black border-gray-300 text-white font-medium hover:bg-gray-100"
            onClick={() => onEnable(false)}>
              Disable
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileTypes />
        <Schedule />
      </div>

      <Logs />
    </div>
  );
};

export default DataRetrievalMain;
