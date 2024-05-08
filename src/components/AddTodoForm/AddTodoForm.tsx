import React, { useState } from 'react';
import { Contract } from 'ethers';

import erc20 from '../../../artifacts/contracts/TodoList.sol/TodoList.json';
import addresses from '../../../ignition/deployments/chain-11155111/deployed_addresses.json';

const AddTodoForm = () => {
  const [newTodoText, setNewTodoText] = useState<string>('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contractAddress = addresses['TodoListModule#TodoList'];
    const contract = new Contract(contractAddress, erc20.abi, signer);

    console.log({ contract });
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
