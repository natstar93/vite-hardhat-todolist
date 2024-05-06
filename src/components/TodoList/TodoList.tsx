import React from 'react';

export type Task = {
  id: number;
  content: string;
  completed: boolean;
};

const TodoList = ({ tasks }: { tasks: Task[] }) => (
  <ul className='todoListContainer'>
    {tasks.length
      ? tasks.map(({ id, content, completed }) => (
          <li
            key={`task-${id}`}
          >{`${id} - ${content} - completed: ${completed}`}</li>
        ))
      : 'Nothing to do today'}
  </ul>
);

export default TodoList;
