import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Contract } from 'ethers';

import { abi } from '../../../artifacts/contracts/TodoList.sol/TodoList.json';
import addresses from '../../../ignition/deployments/chain-11155111/deployed_addresses.json';
import TodoList, { Task } from '../TodoList/TodoList.tsx';
import AddTodoForm from '../AddTodoForm/AddTodoForm.tsx';
import ConnectionContext from '../../contexts/ConnectionContext.ts';

const TodoListContainer = () => {
  const CONTRACT_ADDRESS = addresses['TodoListModule#TodoList'];
  const { connectionStatus } = useContext(ConnectionContext);
  const { signer, isConnected } = connectionStatus;

  const [taskList, setTaskList] = useState<Task[]>([]);

  const contract = useMemo(() => {
    return new Contract(CONTRACT_ADDRESS, abi, signer);
  }, [CONTRACT_ADDRESS, signer]);

  useEffect(() => {
    async function getTaskData() {
      const taskCountData: Task[] = await contract.taskCount();

      const taskCount: number = Number(taskCountData);

      let taskList: Task[] = [];

      for (let i = 1; i < taskCount + 1; i++) {
        const { id, content, completed } = await contract.tasks(i);
        taskList = [...taskList, { id: Number(id), content, completed }];
      }
      setTaskList(taskList);
    }

    getTaskData();
  }, [contract]);

  return (
    <section id='todoList'>
      <AddTodoForm />
      {isConnected && taskList && <TodoList tasks={taskList} />}
    </section>
  );
};

export default TodoListContainer;
