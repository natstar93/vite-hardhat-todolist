import React from 'react';
import { render } from '@testing-library/react';
import { Contract } from 'ethers';

import App from './App.tsx';
import ConnectionContext from '../../contexts/ConnectionContext.ts';

describe('App component', () => {
  it('handles accountsChanged event', async () => {
    const mockedOn = jest.fn();
    const mockedRemove = jest.fn();
    const setConnectionStatusMock = jest.fn()
    window.ethereum = { on: mockedOn, removeListener: mockedRemove };

    const { unmount  } = render(
      <ConnectionContext.Provider
        value={{
          connectionStatus: {
            walletAddress: '0x123',
            isConnected: true,
            contract: jest.mock as unknown as Contract,
            error: null,
          },
          setConnectionStatus: setConnectionStatusMock,
        }}
      >
        <App />
      </ConnectionContext.Provider>
    );

    expect(window.ethereum.on).toHaveBeenCalledWith(
      'accountsChanged',
      expect.any(Function)
    );
    expect(mockedRemove).not.toHaveBeenCalled();

    unmount();

    expect(mockedRemove).toHaveBeenCalledWith(
      'accountsChanged',
      expect.any(Function)
    );
  });
});
