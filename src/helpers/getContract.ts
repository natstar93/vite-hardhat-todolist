import { ethers, Contract, BrowserProvider, JsonRpcSigner } from 'ethers';

import { abi } from '../../artifacts/contracts/TodoList.sol/TodoList.json';
import addresses from '../../ignition/deployments/chain-11155111/deployed_addresses.json';
import { formatErrorMessage } from './formatErrorMessage.ts';

export const formatConnectionErrorResponse: (error: unknown) => {
  isConnected: boolean;
  walletAddress: string;
  error: string;
} = (err) => {
  return {
    isConnected: false,
    walletAddress: '',
    error: formatErrorMessage(err),
  };
};

export const getContract: () => Promise<{
  error: string | null;
  contract: Contract | null;
}> = async () => {
  const { ethereum } = window;
  const contractAddress = addresses['TodoListModule#TodoList'];
  let contract: Contract;

  try {
    const provider: BrowserProvider = new ethers.BrowserProvider(ethereum);
    const signer: JsonRpcSigner = await provider.getSigner();
    contract = new Contract(contractAddress, abi, signer);
    return { contract, error: null}
  } catch (err) {
    return { contract: null, error: formatErrorMessage(err)}
  }
};

export default getContract;
