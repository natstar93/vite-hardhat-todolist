import React, { useContext, useEffect, useState } from 'react';
import { Contract } from 'ethers';

import ConnectionContext from '../../contexts/ConnectionContext.ts';
import TodoList, { Task } from '../TodoList/TodoList.tsx';
import AddTodoForm from '../AddTodoForm/AddTodoForm.tsx';
import { handleErrors } from '../../helpers/handleErrors.ts';

const TodoListContainer = () => {
  const [lastTransationHash, setLastTransationHash] = useState<string>('');
  const { connectionStatus } = useContext(ConnectionContext);
  const { isConnected, contract, walletAddress } = connectionStatus;
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [taskListError, setTaskListError] = useState<string>('');

  useEffect(() => {
    async function getTodos(contract: Contract) {
      let taskList: Task[] = [];
      let taskCount: number = 0;

      try {
        const taskCountData: Task[] = await contract.taskCount();
        taskCount = Number(taskCountData);
        for (let i = 1; i < taskCount + 1; i++) {
          const { id, content, completed } = await contract.tasks(i);
          taskList = [...taskList, { id: Number(id), content, completed }];
        }
        setTaskList(taskList);
      } catch (err) {
        setTaskListError(handleErrors(err));
      }
    }
    contract && getTodos(contract);
  }, [contract, walletAddress, lastTransationHash]);

  return (
    <section id='todoList'>
      <p id='errorBanner'>{taskListError}</p>
      <AddTodoForm setLastTransationHash={setLastTransationHash} />
      {isConnected && <TodoList todos={taskList} />}
    </section>
  );
};

export default TodoListContainer;
