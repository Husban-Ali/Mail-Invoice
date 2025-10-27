import React, { useState } from 'react';
import ConnectedAccounts from './ConnectedAccounts';
import ConnectNewAccount from './ConnectNewAccount';

const EmailSetup = () => {
  const [showConnectNew, setShowConnectNew] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ConnectedAccounts 
        isCompact={showConnectNew}
        onConnectNew={() => setShowConnectNew(true)}
      />
      {showConnectNew && (
        <div className="mt-6">
          <ConnectNewAccount onBack={() => setShowConnectNew(false)} />
        </div>
      )}
    </div>
  );
};

export default EmailSetup;
