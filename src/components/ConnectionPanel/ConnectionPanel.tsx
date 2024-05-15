import React, { useContext } from 'react';

import ConnectionContext from '../../contexts/ConnectionContext.ts';
import connectWallet from '../../helpers/connectWallet.ts';

const ConnectionPanel = () => {
  const {
    setConnectionStatus,
    connectionStatus: { walletAddress, isConnected, error },
  } = useContext(ConnectionContext);

  const handleClick = () => {
    async function connect() {
      const connectWalletResponse = await connectWallet();
      setConnectionStatus(connectWalletResponse);
    }

    connect();
  };

  return (
    <aside id='connectionDetails'>
      <p>
        {walletAddress.length
          ? `${walletAddress} is connected`
          : 'Press button to connect'}
      </p>
      <button onClick={handleClick} disabled={isConnected} data-testid='connect-btn'>
        Connect
      </button>
      <p>{error}</p>
    </aside>
  );
};

export default ConnectionPanel;
