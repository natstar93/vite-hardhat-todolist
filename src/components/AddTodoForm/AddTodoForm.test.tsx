import React from 'react';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Contract } from 'ethers';

import AddTodoForm from './AddTodoForm.tsx';
import ConnectionContext from '../../contexts/ConnectionContext.ts';
import { formatErrorMessage } from '../../helpers/formatErrorMessage.ts';

jest.mock('../../helpers/formatErrorMessage.ts', () => ({
  formatErrorMessage: jest.fn(),
}));

describe('AddTodoForm component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders connection message when not connected', async () => {
    const setLastTransationHashMock = jest.fn();
    const { findByText, queryByTestId, getByRole } = render(
      <AddTodoForm setLastTransationHash={setLastTransationHashMock} />
    );
    const addTodoBtn = getByRole('button', { name: 'Submit Todo' });

    expect(addTodoBtn).toHaveAccessibleName();
    expect(findByText('Please connect to MetaMask to add Todo')).toBeTruthy();
    expect(queryByTestId('contract-error-msg')).toBeFalsy();
  });

  it('does not render connection message when connected', async () => {
    const setLastTransationHashMock = jest.fn();
    const providerValue = {
      connectionStatus: {
        walletAddress: '0x123',
        isConnected: true,
        contract: jest.mock as unknown as Contract,
        error: null,
      },
      setConnectionStatus: jest.fn,
    };

    const { queryByText, queryByTestId } = render(
      <ConnectionContext.Provider value={providerValue}>
        <AddTodoForm setLastTransationHash={setLastTransationHashMock} />
      </ConnectionContext.Provider>
    );

    expect(queryByText('Please connect to MetaMask to add Todo')).toBeFalsy();
    expect(queryByTestId('contract-error-msg')).toBeFalsy();
  });

  it('calls setLastTransationHash after task is created successfully', async () => {
    const user = userEvent.setup();
    const setLastTransationHashMock = jest.fn();
    const contractMock = {
      createTask: jest.fn().mockImplementation(() => ({
        hash: '0xe0b2d',
      })),
    };
    const providerValue = {
      connectionStatus: {
        walletAddress: '0x123',
        isConnected: true,
        contract: contractMock as unknown as Contract,
        error: null,
      },
      setConnectionStatus: jest.fn,
    };

    const { getByRole } = render(
      <ConnectionContext.Provider value={providerValue}>
        <AddTodoForm setLastTransationHash={setLastTransationHashMock} />
      </ConnectionContext.Provider>
    );
    const newTodoField = getByRole('textbox', { name: 'New Todo:' });
    const addTodoBtn = getByRole('button', { name: 'Submit Todo' });

    await user.type(newTodoField, 'my todo');
    await user.click(addTodoBtn);

    expect(contractMock.createTask).toHaveBeenCalledWith('my todo');
    expect(setLastTransationHashMock).toHaveBeenCalledWith('0xe0b2d');
  });

  it('sets error message after contract fails to create task', async () => {
    const setLastTransationHashMock = jest.fn();
    (formatErrorMessage as jest.Mock).mockReturnValueOnce('Mock error');
    const user = userEvent.setup();
    const mockError = new Error('FAILED');
    const contractMock = {
      createTask: jest.fn().mockRejectedValue(mockError),
    };
    const providerValue = {
      connectionStatus: {
        walletAddress: '0x123',
        isConnected: true,
        contract: contractMock as unknown as Contract,
        error: null,
      },
      setConnectionStatus: jest.fn,
    };

    const { getByRole, queryByTestId } = render(
      <ConnectionContext.Provider value={providerValue}>
        <AddTodoForm setLastTransationHash={setLastTransationHashMock} />
      </ConnectionContext.Provider>
    );
    const newTodoField = getByRole('textbox', { name: 'New Todo:' });
    const addTodoBtn = getByRole('button', { name: 'Submit Todo' });

    await user.type(newTodoField, 'my todo');
    await user.click(addTodoBtn);

    expect(setLastTransationHashMock).not.toHaveBeenCalled();
    expect(formatErrorMessage).toHaveBeenCalledWith(mockError);
    expect(queryByTestId('contract-error-msg')).toHaveTextContent('Mock error');
  });
});
