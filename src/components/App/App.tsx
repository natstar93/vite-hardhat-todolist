import { useCallback, useState } from 'react';
import { InfuraProvider, ethers } from 'ethers';

import { connectToEthereum } from '../../helpers/blockchainFunctions';
import * as erc20 from '../../../artifacts/contracts/TodoList.sol/TodoList.json';
import './App.css';

type Task = {
  id: number;
  content: string;
  completed: boolean;
};

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  return tasks.map(({ id, content, completed }) => (
    <div
      key={`task-${id}`}
    >{`${id} - ${content} - completed: ${completed}`}</div>
  ));
};

const App = () => {
  const [todoListData, setTodoListData] = useState<Task[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleClick = useCallback(async () => {
    setConnectionError(null);
      const { isConnected, walletAddress, error } = await connectToEthereum();

      if(error) {
        setConnectionError(error);
        return;
      }

      setIsConnected(isConnected);
      walletAddress && setAccountNumber(walletAddress);
      const contractAddress = '0x347EcE27D451BBe1E99Bc0916573900411AFc97C';

      const provider = new InfuraProvider('sepolia');

      const contract = new ethers.Contract(contractAddress, erc20.abi, provider);

      const taskCountData: Task[] = await contract.taskCount();
      const taskCount: number = Number(taskCountData);

      let taskList: Task[] = [];

      for (let i = 1; i < taskCount + 1; i++) {
        const { id, content, completed } = await contract.tasks(i);
        taskList = [...taskList, { id: Number(id), content, completed }];
      }

      setTodoListData(taskList);
  }, [setIsConnected, setAccountNumber, setTodoListData]);

  return (
    <div>
      <h1>Blockchain Todo List</h1>
      <div>
        {accountNumber
          ? `${accountNumber} is connected`
          : 'Press button to connect'}
      </div>
      <button onClick={handleClick} disabled={isConnected}>
        Connect
      </button>
      {connectionError && <div>{connectionError}</div>}
      <div className='todoListContainer'>
        {todoListData.length ? (
          <TaskList tasks={todoListData} />
        ) : (
          'Nothing to do today'
        )}
      </div>
    </div>
  );
};

export default App;
