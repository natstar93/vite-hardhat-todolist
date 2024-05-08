import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import TodoList from '../TodoList/TodoList.tsx';
import AddTodoForm from '../AddTodoForm/AddTodoForm.tsx';
import ConnectionContext from '../../contexts/ConnectionContext.ts';

const TodoListContainer = () => {
  const { isConnected } = useContext(ConnectionContext);

  const { isPending, error, data, isFetching } = useQuery({
    queryFn: () => fetch('/api/wallet').then((res) => res.json()),
    queryKey: ['accountNumber'],
  });
  console.log({ isPending, error, data, isFetching });

  return (
    <section id='todoList'>
      <AddTodoForm />
      {isConnected && data?.taskList && <TodoList tasks={data.taskList} />}
    </section>
  );
};

export default TodoListContainer;
