import React, { useEffect, useState } from 'react';

import ConnectionContext, {
  ConnectionStatusType,
  connectionStatusDefaultValues,
} from '../../contexts/ConnectionContext.ts';
import ConnectionPanel from '../ConnectionPanel/ConnectionPanel.tsx';
import './App.css';
import TodoListContainer from '../TodoListContainer/TodoListContainer.tsx';
import Header from '../Header/Header.tsx';

const App = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatusType>(connectionStatusDefaultValues);

  useEffect(() => {
    function handleAccountsChanged(accounts: string[]) {
      !accounts.length && setConnectionStatus(connectionStatusDefaultValues);
    }
    window?.ethereum?.on('accountsChanged', handleAccountsChanged);
  
    return () =>
      window?.ethereum.removeListener(
        'accountsChanged',
        handleAccountsChanged
      );
  }, []);

  return (
    <main id='todo-list-app'>
      <Header />
      <ConnectionContext.Provider
        value={{ connectionStatus, setConnectionStatus }}
      >
        <ConnectionPanel />
        <TodoListContainer />
      </ConnectionContext.Provider>
    </main>
  );
};

export default App;
