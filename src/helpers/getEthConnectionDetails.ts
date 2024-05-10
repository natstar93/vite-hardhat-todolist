import {
  ethers,
  Contract,
  BrowserProvider,
  JsonRpcSigner,
} from 'ethers';

import { abi } from '../../artifacts/contracts/TodoList.sol/TodoList.json';
import addresses from '../../ignition/deployments/chain-11155111/deployed_addresses.json';
import { handleErrors } from './handleErrors.ts';
import { METHOD_ETHEREUM_REQUEST_ACCOUNTS, ERR_NO_WINDOW_OBJECT, ERR_WALLET_NOT_FOUND } from '../constants.ts';


export const formatConnectionErrorResponse: (error: unknown) => {
  isConnected: boolean;
  walletAddress: string;
  error: string;
} = (err) => {
  return {
    isConnected: false,
    walletAddress: '',
    error: handleErrors(err),
  };
};

const getEthConnectionDetails: () => Promise<{
  isConnected: boolean;
  walletAddress: string;
  error: string | null;
  signer?: JsonRpcSigner;
  contract?: Contract;
}> = async () => {
  const { ethereum } = window;
  const contractAddress = addresses['TodoListModule#TodoList'];
  let walletAddress;
  let signer;
  let contract;

  if (!ethereum?.request)
    return formatConnectionErrorResponse({ message: ERR_NO_WINDOW_OBJECT });

  try {
    [walletAddress] = await ethereum.request({
      method: METHOD_ETHEREUM_REQUEST_ACCOUNTS,
    });
  } catch (err) {
    return formatConnectionErrorResponse(err);
  }

  try {
    const provider: BrowserProvider = new ethers.BrowserProvider(ethereum);
    signer = await provider.getSigner();
    contract = new Contract(contractAddress, abi, signer);
  } catch (err) {
    return formatConnectionErrorResponse(err);
  }

  if (walletAddress)
    return {
      isConnected: true,
      walletAddress,
      signer,
      contract,
      error: null,
    };
  return formatConnectionErrorResponse(new Error(ERR_WALLET_NOT_FOUND));
};

export default getEthConnectionDetails;
