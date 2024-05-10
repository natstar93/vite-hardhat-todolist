import React, { useContext, useEffect, useState } from 'react';
import { ContractTransactionResponse } from 'ethers';

import './AddTodoForm.css';
import ConnectionContext from '../../contexts/ConnectionContext.ts';
import { handleErrors } from '../../helpers/handleErrors.ts';

const AddTodoForm = ({
  setLastTransationHash,
}: {
  setLastTransationHash: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { connectionStatus } = useContext(ConnectionContext);
  const { contract, isConnected } = connectionStatus;

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
      const displayError = handleErrors(err);
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
        <div> {isConnected && <p>{errorMessage}</p>}</div>
      </form>
    </aside>
  );
};

export default AddTodoForm;
