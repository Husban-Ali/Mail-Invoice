import React, { useState } from "react";
import { Plus, X } from "lucide-react";

function CustomFolder({ onSave }) {
  const [folders, setFolders] = useState([{ id: 1, name: "Custom Folder Name" }]);

  const addFolder = () => {
    const newFolder = { id: folders.length + 1, name: "Custom Folder Name" };
    setFolders([...folders, newFolder]);
  };

  const handleFolderNameChange = (id, newName) => {
    setFolders(
      folders.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder
      )
    );
  };

  const removeFolder = (id) => {
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  const handleSave = () => {
    if (onSave) onSave(folders); 
  };

  return (
    <div className="w-full p-4 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-black font-inter">Custom Folder</h2>
        <button
          onClick={handleSave}
          className="text-sm text-gray-900 hover:text-gray-700 font-medium border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Save and Add
        </button>
      </div>

      <div className="space-y-3 max-h-44 overflow-y-auto pr-2">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="flex items-center border border-gray-200 rounded-lg p-3"
          >
            <input
              type="text"
              value={folder.name}
              onChange={(e) => handleFolderNameChange(folder.id, e.target.value)}
              className="flex-1 text-sm text-gray-700 focus:outline-none bg-transparent"
            />
            <button
              onClick={() => removeFolder(folder.id)}
              className="ml-2 text-gray-400 hover:text-red-500 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addFolder}
        className="flex items-center justify-center w-full mt-4 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add More
      </button>
    </div>
  );
}

export default CustomFolder;
