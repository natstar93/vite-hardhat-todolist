import { ethers } from 'ethers';
import erc20 from '../../artifacts/contracts/TodoList.sol/TodoList.json';
import addresses from '../../ignition/deployments/chain-11155111/deployed_addresses.json';

export const NO_CONTRACT = 'The contract could not be loaded.';


const postTodo = async (todoText: string, signer: ethers.ContractRunner | null | undefined) => {
  const contractAddress = addresses['TodoListModule#TodoList'];

  const contract = new ethers.Contract(contractAddress, erc20.abi, signer);

  if (!contract) {
    throw new Error(NO_CONTRACT); // TODO: Custom error object
  }
  const response = await contract.createTask(todoText);
  return response;
};

export default postTodo;
