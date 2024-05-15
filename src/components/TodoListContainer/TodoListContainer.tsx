import React, { useContext, useEffect, useState } from 'react';
import { Contract } from 'ethers';

import './TodoListContainer.css';
import ConnectionContext from '../../contexts/ConnectionContext.ts';
import TodoList, { Task } from '../TodoList/TodoList.tsx';
import AddTodoForm from '../AddTodoForm/AddTodoForm.tsx';
import getTasks from '../../helpers/getTasks.ts';

const TodoListContainer = () => {
  const [lastTransationHash, setLastTransationHash] = useState<string>('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [taskListError, setTaskListError] = useState<string>('');

  const {
    connectionStatus: { isConnected, walletAddress, contract },
  } = useContext(ConnectionContext);

  useEffect(() => {
    async function setTasks(contract: Contract) {
      const { error, taskList } = await getTasks(contract);
      setTaskListError(error);
      setTaskList(taskList);
    }

    contract && setTasks(contract);
  }, [contract, walletAddress, lastTransationHash]);

  return (
    <section id='todoListContainer'>
      <p id='errorBanner'>{taskListError}</p>
      <AddTodoForm setLastTransationHash={setLastTransationHash} />
      {isConnected && contract && <TodoList todos={taskList} />}
    </section>
  );
};

export default TodoListContainer;
