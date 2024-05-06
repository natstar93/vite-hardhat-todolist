import React, { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import './App.css';
import TodoList from '../TodoList/TodoList.tsx';
import getEthConnectionStatus from '../../helpers/getEthConnectionStatus.ts';

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState<string>('');

  const handleClick = useCallback(async () => {
    setConnectionError(null);
    const { isConnected, walletAddress, error } = await getEthConnectionStatus();

    if (error) {
      setConnectionError(error);
      return;
    }

    setIsConnected(isConnected);
    walletAddress && setAccountNumber(walletAddress);
 }, [setIsConnected, setAccountNumber]);


  const { isPending, error, data, isFetching } = useQuery({
    queryFn: () => fetch('/api/wallet').then((res) => res.json()),
    queryKey: ['accountNumber']
  });

  console.log({ isPending, error, data, isFetching });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // send to blockchain
    // contract?.createTask(newTodoText);
    console.log({ newTodoText });
    setNewTodoText('');
  };

  return (
    <main id='todo-list-app'>
      <header>
        <h1>Blockchain Todo List</h1>
        <p>
          Just what the world needed. Another todo list. This one is on the
          Ethereum blockchain for no apparent reason.
        </p>
      </header>

      <aside id='connectionDetails'>
        <p>
          {accountNumber
            ? `${accountNumber} is connected`
            : 'Press button to connect'}
        </p>
        <button onClick={handleClick} disabled={isConnected}>
          Connect
        </button>
        <p>{connectionError}</p>
      </aside>
      <section id='todoList'>
        <form onSubmit={onSubmit}>
          <div>
            <input
              id='newTodoField'
              type='text'
              name='newTodoField'
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
            />
          </div>
          <div>
            <input type='submit' value='Add todo' />
          </div>
        </form>
        { data?.taskList && <TodoList tasks={data.taskList} />}
      </section>
    </main>
  );
};

export default App;
