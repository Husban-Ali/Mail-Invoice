import React, { useState } from "react";
import DataRetrievalToggle from "./DataRetrievalToggle";
import DataRetrievalMain from "./DataRetrievalMain";

const DataRetrieval = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="p-6 font-inter text-black">
      {!enabled ? (
        <DataRetrievalToggle setEnabled={setEnabled} />
      ) : (
        <DataRetrievalMain setEnabled={setEnabled} />
      )}
    </div>
  );
};

export default DataRetrieval;
