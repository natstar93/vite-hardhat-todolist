import { JsonRpcSigner } from 'ethers';
import { createContext } from 'react';

export type ConnectionContextType = {
  walletAddress: string,
  isConnected: boolean,
  signer?: JsonRpcSigner,
  error: string | null;
}

export const connectionContextDefaultValues = {
  walletAddress: '',
  isConnected: false,
  error: null,
}

const ConnectionContext = createContext<ConnectionContextType>(connectionContextDefaultValues);

export default ConnectionContext;
