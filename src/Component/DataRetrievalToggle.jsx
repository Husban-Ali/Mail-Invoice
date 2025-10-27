import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRetrievalStatus, setRetrievalStatus } from "../lib/api";

const DataRetrievalToggle = ({ setEnabled }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enabledLocal, setEnabledLocal] = useState(false);

  useEffect(()=>{
    let canceled = false;
    (async () => {
      try {
        const { enabled } = await getRetrievalStatus();
        if (!canceled) { setEnabledLocal(!!enabled); setEnabled(!!enabled); }
      } catch (e) {
        if (!canceled) setError(e.message || 'Failed to load status');
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return ()=>{ canceled = true; };
  }, [setEnabled]);

  const update = async (val) => {
    setLoading(true); setError("");
    try { await setRetrievalStatus(val); setEnabledLocal(val); setEnabled(val); }
    catch(e){ setError(e.message || 'Failed to update'); }
    finally{ setLoading(false); }
  };

  return (
    <>
      
      <div className="bg-white rounded-2xl shadow border border-gray-200 max-w-auto mx-auto p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl lowercase font-semibold">
            {t("dataRetrieval.statusTitle")}
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => update(true)}
              className="px-6 py-2 rounded-lg lowercase bg-black text-white font-medium hover:bg-gray-800"
            >
              {t("dataRetrieval.enable")}
            </button>
            <button
              onClick={() => update(false)}
              className="px-6 py-2 rounded-lg lowercase border border-gray-300 text-gray-600 font-medium hover:bg-gray-100"
            >
              {t("dataRetrieval.disable")}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-200 max-w-auto mx-auto p-6 mt-6 min-h-[400px] flex justify-center items-center">
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 text-center gap-4 p-6 w-[400px] min-h-[250px]">
          <h3 className="text-lg font-bold lowercase text-black w-full text-center">
            {loading ? t('loading', 'Loading...') : t("dataRetrieval.offTitle")}
          </h3>

          <hr className="w-full border-t border-gray-300 " />

          <p className="text-sm text-gray-600 leading-relaxed">
            {error ? error : t("dataRetrieval.offDescription")}
          </p>
        </div>
      </div>
    </>
  );
};

export default DataRetrievalToggle;
