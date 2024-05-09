import React, { useContext, useEffect, useState } from 'react';
import { Contract } from 'ethers';

import ConnectionContext from '../../contexts/ConnectionContext.ts';
import TodoList, { Task } from '../TodoList/TodoList.tsx';
import AddTodoForm from '../AddTodoForm/AddTodoForm.tsx';

const TodoListContainer = () => {
  const [lastTransationHash, setLastTransationHash] = useState<string>('');
  const { connectionStatus } = useContext(ConnectionContext);
  const { isConnected, contract, walletAddress } = connectionStatus;

  const [taskList, setTaskList] = useState<Task[]>([]);

  useEffect(() => {
    async function getTodos(contract: Contract) {
      let taskList: Task[] = [];
      const taskCountData: Task[] = await contract.taskCount();
      const taskCount: number = Number(taskCountData);

      for (let i = 1; i < taskCount + 1; i++) {
        const { id, content, completed } = await contract.tasks(i);
        taskList = [...taskList, { id: Number(id), content, completed }];
      }
      setTaskList(taskList);
    }
    contract && getTodos(contract);
  }, [contract, walletAddress, lastTransationHash]);

  return (
    <section id='todoList'>
      <AddTodoForm setLastTransationHash={setLastTransationHash} />
      {isConnected && <TodoList todos={taskList} />}
    </section>
  );
};

export default TodoListContainer;
