import React from "react";
import { FaServer } from "react-icons/fa";
import googleLogo from "../assets/google.png"; 
import outloo from "../assets/outloo.png";     

const StepChooseProvider = ({ selectedProvider, setSelectedProvider }) => {
  const providers = [
    { id: "google", name: "Google", type: "image", icon: googleLogo },
    { id: "outlook", name: "Outlook", type: "image", icon: outloo },
    { id: "imap", name: "IMAP", type: "icon", icon: <FaServer className="text-gray-600 text-2xl" /> },
  ];

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-center pt-6 font-inter">Choose Provider</h3>
      <div className="grid grid-cols-3 gap-6">
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => setSelectedProvider(provider.id)}
            className={`flex flex-col items-center justify-center gap-2 border rounded-lg p-6 hover:bg-gray-50 transition ${
              selectedProvider === provider.id ? "border-black shadow-md" : "border-gray-200"
            }`}
          >
            {provider.type === "image" ? (
              <img src={provider.icon} alt={provider.name} className="w-8 h-8 object-contain" />
            ) : (
              provider.icon
            )}
            <span className="font-medium text-gray-800">{provider.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepChooseProvider;



