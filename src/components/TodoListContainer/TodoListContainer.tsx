import React, { useContext, useEffect, useState } from 'react';
import { Contract } from 'ethers';

import ConnectionContext from '../../contexts/ConnectionContext.ts';
import TodoList, { Task } from '../TodoList/TodoList.tsx';
import AddTodoForm from '../AddTodoForm/AddTodoForm.tsx';
import getTasks from '../../helpers/getTasks.ts';
import { useContractContext } from '../../contexts/ContractContext.ts';

const TodoListContainer = () => {
  const [lastTransationHash, setLastTransationHash] = useState<string>('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [taskListError, setTaskListError] = useState<string>('');

  const {
    connectionStatus: { isConnected, walletAddress },
  } = useContext(ConnectionContext);
  const { contractStatus } = useContractContext();

  useEffect(() => {
    async function setTasks(contract: Contract) {
      const { error, taskList } = await getTasks(contract);
      setTaskListError(error);
      setTaskList(taskList);
    }
    const { contract } = contractStatus;
    contract && setTasks(contract);
  }, [contractStatus, walletAddress, lastTransationHash]);

  return (
    <section id='todoList'>
      <p id='errorBanner'>{taskListError}</p>
      <AddTodoForm setLastTransationHash={setLastTransationHash} />
      {isConnected && <TodoList todos={taskList} />}
    </section>
  );
};

export default TodoListContainer;
