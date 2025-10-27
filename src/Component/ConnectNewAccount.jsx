import React from "react";
import StepSelectProvider from "./StepSelectProvider";
import StepImapAuth from "./StepImapAuth";
import StepSelectFolders from "./StepSelectFolders";
import StepFilterOptions from "./StepFilterOptions";
import StepSummary from "./StepSummary";
import StepInvoicesTable from "./StepInvoicesTable";

const ConnectNewAccount = ({ onCompleted, onBack }) => {
  const [step, setStep] = React.useState(1);
  const [provider, setProvider] = React.useState("");
  const [creds, setCreds] = React.useState(null);
  const [selectedFolders, setSelectedFolders] = React.useState([]);
  const [filters, setFilters] = React.useState({ unseenOnly: true, sinceDays: 7 });
  const [invoices, setInvoices] = React.useState([]);

  const steps = React.useMemo(() => ([
    { id: 1, name: "Select Provider" },
    { id: 2, name: provider === 'imap' ? 'IMAP Credentials' : 'Authenticate' },
    { id: 3, name: "Select Folders" },
    { id: 4, name: "Filters" },
    { id: 5, name: "Summary" },
    { id: 6, name: "Invoices" },
  ]), [provider]);

  const canGoBack = step > 1;
  const canGoNext = step < steps.length;

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length));
  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepSelectProvider value={provider} onSelect={(p) => { setProvider(p); setStep(2); }} />;
      case 2:
        if (provider === 'gmail' || provider === 'outlook') {
          // Auto-fill host and port for Gmail and Outlook
          const presets = {
            gmail: { host: 'imap.gmail.com', port: '993', tls: true },
            outlook: { host: 'outlook.office365.com', port: '993', tls: true },
          };
          return <StepImapAuth 
            preset={presets[provider]} 
            providerName={provider === 'gmail' ? 'Gmail' : 'Outlook'}
            onSuccess={(c) => { setCreds(c); setStep(3); }} 
          />;
        }
        if (provider === 'imap') {
          return <StepImapAuth onSuccess={(c) => { setCreds(c); setStep(3); }} />;
        }
        return <div className="text-gray-700">OAuth login for {provider} not implemented in this wizard.</div>;
      case 3:
        return (
          <StepSelectFolders
            mode="wizard"
            email={creds?.email}
            onSelect={({ selectedFolders }) => { setSelectedFolders(selectedFolders); setStep(4); }}
          />
        );
      case 4:
        return <StepFilterOptions initial={filters} onSubmit={(f) => { setFilters(f); setStep(5); }} />;
      case 5:
        return (
          <StepSummary
            creds={creds}
            folders={selectedFolders}
            filters={filters}
            onComplete={({ invoices: inv = [] }) => {
              setInvoices(inv);
              setStep(6);
              if (onCompleted) onCompleted(inv);
            }}
          />
        );
      case 6:
        return <StepInvoicesTable invoices={invoices} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Connect New Account</h2>
        {onBack && (
          <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-800">Back</button>
        )}
      </div>
      <div className="flex gap-6">
        <div className="bg-white rounded-xl border border-gray-200 w-1/2 p-4">
          <ul className="space-y-3">
            {steps.map((s) => (
              <li
                key={s.id}
                className={`flex items-center text-sm cursor-pointer px-3 py-2 rounded-md border ${step === s.id ? 'border-gray-400 bg-gray-50 font-semibold' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                onClick={() => setStep(s.id)}
              >
                <input type="checkbox" checked={step > s.id} readOnly className="mr-2" />
                {s.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 w-3/4 p-6 flex flex-col justify-between">
          <div>{renderStep()}</div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button onClick={goPrev} className={`px-6 py-2 rounded-lg border ${!canGoBack ? 'text-gray-400 cursor-not-allowed border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`} disabled={!canGoBack}>Previous</button>
        <button onClick={goNext} className={`px-6 py-2 rounded-lg border ${!canGoNext ? 'text-gray-400 cursor-not-allowed border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`} disabled={!canGoNext}>Next</button>
      </div>
    </div>
  );
};

export default ConnectNewAccount;
