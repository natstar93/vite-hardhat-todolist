import React, { useContext } from 'react';
import ConnectionContext from '../../contexts/ConnectionContext.ts';

const handleClick = () => {
  console.log('connect')
}

const ConnectionPanel = () => {
  const { walletAddress, isConnected, error } = useContext(ConnectionContext);
  
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
