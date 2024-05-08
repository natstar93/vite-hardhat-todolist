import React, { useContext } from 'react';

import ConnectionContext from '../../contexts/ConnectionContext.ts';
import getEthConnectionStatus from '../../helpers/getEthConnectionStatus.ts';

const ConnectionPanel = () => {
  const { setConnectionStatus, connectionStatus } = useContext(ConnectionContext);
  const { walletAddress, isConnected, error } = connectionStatus;
  
  const handleClick = () => {
    async function getConnectionStatus() {
      const connectionStatus = await getEthConnectionStatus();
      setConnectionStatus && setConnectionStatus(connectionStatus);
    }

    getConnectionStatus();
  };

  return (
    <aside id='connectionDetails'>
      <p>
        {walletAddress
          ? `${walletAddress} is connected`
          : 'Press button to connect'}
      </p>
      <button onClick={handleClick} disabled={isConnected}>
        Connect
      </button>
      <p>{error}</p>
    </aside>
  );
};

export default ConnectionPanel;
