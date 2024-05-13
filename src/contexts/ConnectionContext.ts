import { Dispatch, createContext, useContext } from 'react';

export type ConnectionStatusType = {
  walletAddress: string;
  isConnected: boolean;
  error: string | null;
};

export type ConnectionContextType = {
  connectionStatus: ConnectionStatusType;
  setConnectionStatus: Dispatch<React.SetStateAction<ConnectionStatusType>>;
};

export const connectionStatusDefaultValues = {
  walletAddress: '',
  isConnected: false,
  error: null,
};

export const connectionContextDefaultValues = {
  connectionStatus: connectionStatusDefaultValues,
  setConnectionStatus: () => connectionStatusDefaultValues,
};

const ConnectionContext = createContext<ConnectionContextType>(
  connectionContextDefaultValues
);

export const useConnectionContext = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error(
      'useConnectionContext must be used within a ConnectionProvider'
    );
  }
  return context;
};

export default ConnectionContext;
