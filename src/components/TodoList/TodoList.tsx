import React from 'react';

export type Task = {
  id: number;
  content: string;
  completed: boolean;
};

const TodoList = ({ todos }: { todos: Task[] }) => (
  <ul className='todoListContainer'>
    {todos.length
      ? todos.map(({ id, content, completed }) => (
          <li
            key={`task-${id}`}
          >{`${id} - ${content} - completed: ${completed}`}</li>
        ))
      : 'Nothing to do today'}
  </ul>
);

export default TodoList;
