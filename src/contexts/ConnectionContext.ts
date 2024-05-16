import { Dispatch, createContext } from 'react';
import { Contract } from 'ethers';

export type ConnectionStatusType = {
  walletAddress: string;
  isConnected: boolean;
  contract: Contract | null,
  error: string | null;
};

export type ConnectionContextType = {
  connectionStatus: ConnectionStatusType;
  setConnectionStatus: Dispatch<React.SetStateAction<ConnectionStatusType>>;
};

export const connectionStatusDefaultValues = {
  walletAddress: '',
  isConnected: false,
  contract: null,
  error: null,
};

export const connectionContextDefaultValues = {
  connectionStatus: connectionStatusDefaultValues,
  setConnectionStatus: () => connectionStatusDefaultValues,
};

const ConnectionContext = createContext<ConnectionContextType>(
  connectionContextDefaultValues
);

export default ConnectionContext;
