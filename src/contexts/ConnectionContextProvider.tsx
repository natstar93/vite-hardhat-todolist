import React, { ReactNode, useState } from 'react';
import ConnectionContext, {
  ConnectionContextType,
  ConnectionStatusType,
  connectionStatusDefaultValues,
} from './ConnectionContext.ts';

interface ConnectionProviderProps {
  children: ReactNode;
}

const ConnectionProvider: React.FC<ConnectionProviderProps> = ({
  children,
}) => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatusType>(connectionStatusDefaultValues);

  const connectionContextValue: ConnectionContextType = {
    connectionStatus,
    setConnectionStatus,
  };

  return (
    <ConnectionContext.Provider value={connectionContextValue}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
