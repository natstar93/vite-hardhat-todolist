import { Contract } from 'ethers';

import { Task } from '../components/TodoList/TodoList.tsx';
import { handleErrors } from './handleErrors.ts';

const getTasks = async (contract: Contract) => {
  try {
    let taskList: Task[] = [];
    const taskCount: Task[] = await contract.taskCount();
    for (let i = 1; i < Number(taskCount) + 1; i++) {
      const { id, content, completed } = await contract.tasks(i);
      taskList = [...taskList, { id: Number(id), content, completed }];
    }

    return { taskList, error: '' };
  } catch (err) {
    const error = handleErrors(err);
    return { taskList: [], error };
  }
};

export default getTasks;
