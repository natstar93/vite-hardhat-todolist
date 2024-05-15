import { Contract, BrowserProvider, JsonRpcSigner } from 'ethers';

import { formatErrorMessage } from './formatErrorMessage.ts';
import {
  METHOD_ETHEREUM_REQUEST_ACCOUNTS,
  ERR_NO_WINDOW_OBJECT,
  ERR_WALLET_NOT_FOUND,
  ERR_NO_CONTRACT,
} from '../constants.ts';
import { abi } from '../../blockchain/artifacts/contracts/TodoList.sol/TodoList.json';
import addresses from '../../blockchain/ignition/deployments/chain-11155111/deployed_addresses.json';

const errorResponse = (errorMessage: string) => ({
  isConnected: false,
  walletAddress: '',
  contract: null,
  error: errorMessage
})

const connectWallet: () => Promise<{
  isConnected: boolean;
  walletAddress: string;
  contract: Contract | null;
  error: string | null;
}> = async () => {
  let walletAddress: string;
  const { ethereum } = window;
  const contractAddress = addresses['TodoListModule#TodoList'];

  if (!ethereum?.request)
    return errorResponse(ERR_NO_WINDOW_OBJECT);

  try {
    [walletAddress] = await ethereum.request({
      method: METHOD_ETHEREUM_REQUEST_ACCOUNTS,
    });
    if (!walletAddress)
      return errorResponse(ERR_WALLET_NOT_FOUND);

    const provider: BrowserProvider = new BrowserProvider(ethereum);
    const signer: JsonRpcSigner = await provider.getSigner();
    const contract = new Contract(contractAddress, abi, signer);
    if (!contract)
      return errorResponse(ERR_NO_CONTRACT)

    return {
      isConnected: true,
      walletAddress,
      contract,
      error: null,
    };
  } catch (err) {
    return errorResponse(formatErrorMessage(err))
  }
};

export default connectWallet;
