import { ethers, InfuraProvider } from 'ethers';
import erc20 from '../../artifacts/contracts/TodoList.sol/TodoList.json';
import addresses from '../../ignition/deployments/chain-11155111/deployed_addresses.json';

export const NO_CONTRACT = 'The contract could not be loaded.';

type Task = {
  id: number;
  content: string;
  completed: boolean;
}; // move

const getTodoListData: () => Promise<({taskList: Task[], taskCount: number})> = async () => {
  const contractAddress = addresses['TodoListModule#TodoList'];
  const provider = new InfuraProvider('sepolia');
  const signer = new ethers.Wallet(
    `${process.env.VITE_SEPOLIA_PRIVATE_KEY}`,
    provider
  );
  const contract = new ethers.Contract(contractAddress, erc20.abi, signer);

  if(!contract) {
    throw new Error(NO_CONTRACT); // TODO: Custom error object
  }
  const taskCountData: Task[] = await contract.taskCount();

  const taskCount: number = Number(taskCountData);

  let taskList: Task[] = [];

  for (let i = 1; i < taskCount + 1; i++) {
    const { id, content, completed } = await contract.tasks(i);
    taskList = [...taskList, { id: Number(id), content, completed }];
  }

  return { taskList, taskCount };
};

export default getTodoListData;
