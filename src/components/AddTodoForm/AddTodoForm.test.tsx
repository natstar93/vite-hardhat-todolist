import React from 'react';
import { render } from '@testing-library/react';

import AddTodoForm from './AddTodoForm.tsx';
import ConnectionContext from '../../contexts/ConnectionContext.ts';

describe('AddTodoForm component', () => {
  const setLastTransationHash = jest.fn;

  it('renders connection message when not connected', async () => {
    const { findByText, queryByTestId, getByRole } = render(
      <AddTodoForm setLastTransationHash={setLastTransationHash} />
    );
    const addTodoBtn = getByRole('button', {name: 'Add todo'});
    
    expect(addTodoBtn).toHaveAccessibleName();
    expect(findByText('Please connect to MetaMask to add Todo')).toBeTruthy();
    expect(queryByTestId('contract-error-msg')).toBeFalsy();
  });

  it('does not render connection message when connected', async () => {
    const providerValue = {
      connectionStatus: {
        walletAddress: '0x123',
        isConnected: true,
        contract: null,
        error: null,
      },
      setConnectionStatus: jest.fn,
    };

    const { queryByText, queryByTestId } = render(
      <ConnectionContext.Provider value={providerValue}>
        <AddTodoForm setLastTransationHash={setLastTransationHash} />
      </ConnectionContext.Provider>
    );
    const hasConnectionMessage = queryByText(
      'Please connect to MetaMask to add Todo'
    );

    expect(hasConnectionMessage).toBeFalsy();
    expect(queryByTestId('contract-error-msg')).toBeFalsy();
  });
});
