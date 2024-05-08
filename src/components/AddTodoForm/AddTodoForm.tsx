import React, { useContext, useState } from 'react';
import { Contract } from 'ethers';

import {abi} from '../../../artifacts/contracts/TodoList.sol/TodoList.json';
import addresses from '../../../ignition/deployments/chain-11155111/deployed_addresses.json';
import ConnectionContext from '../../contexts/ConnectionContext.ts';

const AddTodoForm = () => {
  const [newTodoText, setNewTodoText] = useState<string>('');
  const { connectionStatus } = useContext(ConnectionContext);
  const { signer } = connectionStatus;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contractAddress = addresses['TodoListModule#TodoList'];
    const contract = new Contract(contractAddress, abi, signer);
    
    contract.createTask(newTodoText);
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
    </form>
  );
};

export default AddTodoForm;
