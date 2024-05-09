import { ethers, Contract, BrowserProvider, JsonRpcSigner } from 'ethers';

import { abi } from '../../artifacts/contracts/TodoList.sol/TodoList.json';
import addresses from '../../ignition/deployments/chain-11155111/deployed_addresses.json';

export const WALLET_NOT_FOUND =
  'Oops, we couldn\t find your wallet address. Please try again later.';
export const NO_WINDOW_OBJECT =
  'Your account could not be loaded. Please check the MetaMask browser extension is installed correctly.';
export const USER_REJECTED =
  'The MetaMask connection was rejected. Please try connecting again and make sure you accept the connection to MetaMask.';
export const UNKNOWN_ERROR = 'An error has occurred, please try again';
export const WALLET_REQUEST_PENDING =
  'A request to MetaMask is already pending';
export const METHOD_ETHEREUM_REQUEST_ACCOUNTS = 'eth_requestAccounts';

export type EthError = Error & {
  code: string;
};

export const ConnectionErrorResponse: (args: {
  message?: string;
  code?: string;
}) => {
  isConnected: boolean;
  walletAddress: string;
  error: string;
} = (args) => {
  const { message, code } = args;
  const messages: { [key: string]: string } = {
    '4001': USER_REJECTED,
    '-32002': WALLET_REQUEST_PENDING,
  };

  const defaultErrorFields = {
    isConnected: false,
    walletAddress: '',
    error: UNKNOWN_ERROR,
  };

  if (code && messages[code])
    return {
      ...defaultErrorFields,
      error: messages[code],
    };

  if (message)
    return {
      ...defaultErrorFields,
      error: message,
    };

  return defaultErrorFields;
};

const getEthConnectionStatus: () => Promise<{
  isConnected: boolean;
  walletAddress: string;
  error: string | null;
  signer?: JsonRpcSigner;
  contract?: Contract;
}> = async () => {
  const { ethereum } = window;
  const contractAddress = addresses['TodoListModule#TodoList'];
  let walletAddress;

  if (!ethereum?.request)
    return ConnectionErrorResponse({ message: NO_WINDOW_OBJECT });

  try {
    [walletAddress] = await ethereum.request({
      method: METHOD_ETHEREUM_REQUEST_ACCOUNTS,
    });
    const provider: BrowserProvider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract: Contract = new Contract(contractAddress, abi, signer);

    if (walletAddress)
      return {
        isConnected: true,
        walletAddress,
        signer,
        contract,
        error: null,
      };

    return ConnectionErrorResponse({ message: WALLET_NOT_FOUND });
  } catch (err) {
    const { code } = err as EthError;
    return ConnectionErrorResponse({ code });
  }
};

export default getEthConnectionStatus;
