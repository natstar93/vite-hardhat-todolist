import React from 'react';
import { Contract } from 'ethers';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ConnectionPanel from './ConnectionPanel.tsx';
import ConnectionContextProvider from '../../contexts/ConnectionContextProvider.tsx';
import ConnectionContext, {
  ConnectionContextType,
} from '../../contexts/ConnectionContext.ts';
import connectWallet from '../../helpers/connectWallet.ts';

jest.mock('../../helpers/connectWallet');

describe('ConnectionPanel', () => {
  const connectedValues = {
    walletAddress: '123',
    isConnected: true,
    contract: jest.mock as unknown as Contract,
    error: null,
  };
  const notConnectedValues = {
    walletAddress: '',
    isConnected: false,
    contract: null,
    error: null,
  };

  it('shows connect instructions when not connected', () => {
    const { getByText } = render(
      <ConnectionContextProvider>
        <ConnectionPanel />
      </ConnectionContextProvider>
    );
    expect(getByText('Press button to connect')).toBeInTheDocument();
  });

  it('shows wallet address when connected', () => {
    const value = {
      setConnectionStatus: () => jest.fn(),
      connectionStatus: connectedValues,
    } as ConnectionContextType;
    const { getByText } = render(
      <ConnectionContext.Provider value={value}>
        <ConnectionPanel />
      </ConnectionContext.Provider>
    );
    expect(getByText('123 is connected')).toBeInTheDocument();
  });

  it('calls connectWallet on button click', async () => {
    (connectWallet as jest.Mock).mockResolvedValueOnce(connectedValues);
    const setConnectionStatusMock = jest.fn();

    const { getByTestId } = render(
      <ConnectionContext.Provider
        value={{
          setConnectionStatus: setConnectionStatusMock,
          connectionStatus: notConnectedValues,
        }}
      >
        <ConnectionPanel />
      </ConnectionContext.Provider>
    );

    const button = getByTestId('connect-btn');

    fireEvent.click(button);

    expect(connectWallet).toHaveBeenCalled();

    await waitFor(() => {
      expect(setConnectionStatusMock).toHaveBeenCalledWith(
        connectedValues
      );
    });
  });
});
