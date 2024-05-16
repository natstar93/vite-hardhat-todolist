import React, { memo } from 'react';
import './TodoList.css';

export type Task = {
  id: number;
  content: string;
  completed: boolean;
};

const TodoList = memo(({ todos }: { todos: Task[] }) => (
  <ul id='todoList'>
    {todos.length
      ? todos.map(({ id, content, completed }) => (
          <li
            key={`task-${id}`}
          ><input type="checkbox" id={id.toString()} checked={completed} onClick={() => console.info('Not enabled yet, soz')}/> {content}</li>
        ))
      : 'Nothing to do today'}
  </ul>
));

export default TodoList;
