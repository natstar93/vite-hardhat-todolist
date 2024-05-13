import React, { useContext } from 'react';

import ConnectionContext from '../../contexts/ConnectionContext.ts';
import connectWallet from '../../helpers/connectWallet.ts';
import { useContractContext } from '../../contexts/ContractContext.ts';
import getContract from '../../helpers/getContract.ts';

const ConnectionPanel = () => {
  const {
    setConnectionStatus,
    connectionStatus: { walletAddress, isConnected, error },
  } = useContext(ConnectionContext);

  const { setContractStatus } = useContractContext();

  const handleClick = () => {
    async function connect() {
      const connectWalletResponse = await connectWallet();
      setConnectionStatus(connectWalletResponse);

      const contractResponse = await getContract();
      setContractStatus(contractResponse);
    }

    connect();
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
