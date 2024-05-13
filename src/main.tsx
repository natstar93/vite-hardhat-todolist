import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App.tsx';
import './index.css';
import ConnectionProvider from './contexts/ConnectionContextProvider.tsx';
import ContractContextProvider from './contexts/ContractContextProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConnectionProvider>
      <ContractContextProvider>
        <App />
      </ContractContextProvider>
    </ConnectionProvider>
  </React.StrictMode>
);
