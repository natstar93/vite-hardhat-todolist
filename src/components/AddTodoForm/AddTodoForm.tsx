import React, { useContext, useEffect, useState } from 'react';
import { ContractTransactionResponse } from 'ethers';

import './AddTodoForm.css';
import ConnectionContext from '../../contexts/ConnectionContext.ts';
import { formatErrorMessage } from '../../helpers/formatErrorMessage.ts';

const AddTodoForm = ({
  setLastTransationHash,
}: {
  setLastTransationHash: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { connectionStatus } = useContext(ConnectionContext);
  const { isConnected, contract } = connectionStatus;

  useEffect(() => {
    setErrorMessage('');
  }, [connectionStatus]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const contractResponse: ContractTransactionResponse =
        await contract?.createTask(newTodoText);
      setLastTransationHash(contractResponse.hash);
    } catch (err) {
      const displayError = formatErrorMessage(err);
      setErrorMessage(displayError);
    }

    setNewTodoText('');
  };

  return (
    <aside>
      <form onSubmit={onSubmit}>
        <div>
          <input
            id='newTodoField'
            type='text'
            name='newTodoField'
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
          />

          <button
            type='submit'
            aria-disabled={!isConnected}
            aria-describedby='disabledReason'
            className='btnSubmitTodo'
          >
            Add todo
          </button>
        </div>
        {!isConnected && (
          <div role='tooltip' className='tooltipBox' id='disabledReason'>
            <span className='tooltipContent'>
              Please connect to MetaMask to add Todo
            </span>
          </div>
        )}
        <p> {isConnected && errorMessage && <span data-testid='contract-error-msg'>{errorMessage}</span>}</p>
      </form>
    </aside>
  );
};

export default AddTodoForm;
