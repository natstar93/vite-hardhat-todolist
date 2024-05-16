import React, { useContext, useEffect } from 'react';

import ConnectionContext, {
  connectionStatusDefaultValues,
} from '../../contexts/ConnectionContext.ts';
import ConnectionPanel from '../ConnectionPanel/ConnectionPanel.tsx';
import './App.css';
import TodoListContainer from '../TodoListContainer/TodoListContainer.tsx';
import Header from '../Header/Header.tsx';

const App = () => {
  const { setConnectionStatus } = useContext(ConnectionContext);

  useEffect(() => {
    async function handleAccountsChanged(accounts: string[]) {
      !accounts.length && setConnectionStatus(connectionStatusDefaultValues);
    }

    window?.ethereum?.on('accountsChanged', handleAccountsChanged);

    return () =>
      window?.ethereum?.removeListener(
        'accountsChanged',
        handleAccountsChanged
      );
  }, [setConnectionStatus]);

  return (
    <main id='todo-list-app'>
      <Header />
      <ConnectionPanel />
      <TodoListContainer />
    </main>
  );
};

export default App;
