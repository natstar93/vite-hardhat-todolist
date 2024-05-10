import React, { useContext, useState } from 'react';
import { ContractTransactionResponse } from 'ethers';

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
  const { contract } = connectionStatus;

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
    <form onSubmit={onSubmit}>
      <div>
        <input
          id='newTodoField'
          type='text'
          name='newTodoField'
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
      </div>
      <div>
        <input type='submit' value='Add todo' />
      </div>
      <p>{errorMessage}</p>
    </form>
  );
};

export default AddTodoForm;
