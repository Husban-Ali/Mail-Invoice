import React, { useState, useEffect } from "react";

const StepFilterOptions = ({ initial = {}, onSubmit }) => {
  const [unseenOnly, setUnseenOnly] = useState(initial.unseenOnly ?? true);
  const [sinceDays, setSinceDays] = useState(initial.sinceDays ?? 7);

  useEffect(() => {
    // keep controlled when parent changes
    if (initial) {
      if (typeof initial.unseenOnly === 'boolean') setUnseenOnly(initial.unseenOnly);
      if (typeof initial.sinceDays === 'number') setSinceDays(initial.sinceDays);
    }
  }, [initial]);

  return (
    <div className="max-w-2xl">
      <h3 className="text-xl font-semibold mb-4">Filter Options</h3>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={unseenOnly} onChange={(e)=>setUnseenOnly(e.target.checked)} />
          Only unread (UNSEEN)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          Look back days
          <input
            type="number"
            min="0"
            value={sinceDays}
            onChange={(e)=>setSinceDays(parseInt(e.target.value || '0', 10))}
            className="w-24 border rounded px-2 py-1"
          />
        </label>
      </div>

      <div className="mt-6">
        <button
          onClick={() => onSubmit && onSubmit({ unseenOnly, sinceDays })}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepFilterOptions;
