import React, { useEffect, useState } from 'react';

import ConnectionContext, {
  ConnectionContextType,
  connectionContextDefaultValues,
} from '../../contexts/ConnectionContext.ts';
import ConnectionPanel from '../ConnectionPanel/ConnectionPanel.tsx';
import './App.css';
import getEthConnectionStatus from '../../helpers/getEthConnectionStatus.ts';
import TodoListContainer from '../TodoListContainer/TodoListContainer.tsx';
import Header from '../Header/Header.tsx';

const App = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionContextType>(connectionContextDefaultValues);

  useEffect(() => {
    async function getConnectionStatus() {
      const connectionStatus = await getEthConnectionStatus();
      setConnectionStatus(connectionStatus);
    }

    getConnectionStatus();
  }, []);

  console.log(connectionStatus);

  return (
    <main id='todo-list-app'>
      <Header />
      <ConnectionContext.Provider value={connectionStatus}>
        <ConnectionPanel />
        <TodoListContainer />
      </ConnectionContext.Provider>
    </main>
  );
};

export default App;
