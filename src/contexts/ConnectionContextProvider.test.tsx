import React, { useContext } from 'react';
// import { Contract } from 'ethers';
import { render, screen } from '@testing-library/react';

import ConnectionProvider from './ConnectionContextProvider.tsx';
import ConnectionContext from './ConnectionContext.ts';

describe('ConnectionProvider', () => {
  it('should render children', () => {
    render(
      <ConnectionProvider>
        <div data-testid='child' />
      </ConnectionProvider>
    );

    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('should render with default values', () => {
    const TestingComponent = () => {
      const {
        connectionStatus: { isConnected, walletAddress, contract, error },
      } = useContext(ConnectionContext);
      return (
        <>
          <p>{`Connected: ${isConnected.toString()}`}</p>
          <p>
            {walletAddress ? walletAddress : 'no wallet'}
          </p>
          {contract && 'Has contract'}
          {error && `Error: ${error}`}
        </>
      );
    };

    render(
      <ConnectionProvider>
        <TestingComponent />
      </ConnectionProvider>
    );

    expect(screen.getByText('Connected: false')).toBeInTheDocument;
    expect(screen.getByText('no wallet')).toBeInTheDocument;
    expect(screen.queryByText('Has contract')).not.toBeInTheDocument();
    expect(screen.queryByText('Error: ')).not.toBeInTheDocument();
  });
});
