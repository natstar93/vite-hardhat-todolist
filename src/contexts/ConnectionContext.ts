import { JsonRpcSigner } from 'ethers';
import { Dispatch, createContext } from 'react';

export type ConnectionStatusType = {
  walletAddress: string;
  isConnected: boolean;
  signer?: JsonRpcSigner;
  error: string | null;
};
export type ConnectionContextType = {
  connectionStatus: ConnectionStatusType;
  setConnectionStatus?: Dispatch<React.SetStateAction<ConnectionStatusType>>;
};

export const connectionStatusDefaultValues = {
  walletAddress: '',
  isConnected: false,
  error: null,
};

export const connectionContextDefaultValues = {
  connectionStatus: connectionStatusDefaultValues,
};

const ConnectionContext = createContext<ConnectionContextType>(
  connectionContextDefaultValues
);

export default ConnectionContext;
