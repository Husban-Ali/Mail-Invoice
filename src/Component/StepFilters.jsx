import React, { useState } from "react";

const StepFilters = () => {
  const [filters, setFilters] = useState([
    { id: 1, label: "Only fetch PDFs", checked: false },
    { id: 2, label: "Only fetch XML", checked: false },
    { id: 3, label: "Skip newsletters", checked: false },
    { id: 4, label: "Max size: [ 10 MB ]", checked: false },
  ]);

  const toggleFilter = (id) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === id ? { ...filter, checked: !filter.checked } : filter
      )
    );
  };

  return (
    <div>
      <h3 className="text-xl font-bold lowercase text-center mb-6">Choose Filters</h3>

      <div className="grid grid-cols-2 gap-6">
        {filters.map((filter) => (
          <label
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`flex items-center gap-3 border lowercase rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition ${
              filter.checked ? "border-black shadow-sm" : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={filter.checked}
              onChange={() => toggleFilter(filter.id)}
              className="w-4 h-4"
            />
            <span className="text-gray-800 lowercase font-medium">{filter.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StepFilters;
