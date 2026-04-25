import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../api/todoApi';
import type { Todo } from './types';

const TODOS_QUERY_KEY = ['todos'] as const;

type UpdateTodoMutationVariables = {
  id: Todo['id'];
  title: Todo['title'];
  updatedAt: Todo['updatedAt'];
};

export const useTodos = () => {
  const queryClient = useQueryClient();
  const [deletingTodoId, setDeletingTodoId] = useState<Todo['id'] | null>(null);
  const [updatingTodoId, setUpdatingTodoId] = useState<Todo['id'] | null>(null);
  const {
    data: todos = [],
    isError,
    isLoading,
  } = useQuery({
    queryFn: getTodos,
    queryKey: TODOS_QUERY_KEY,
  });

  const invalidateTodos = () =>
    queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });

  const {
    isPending: isCreatePending,
    mutateAsync: createTodoMutateAsync,
  } = useMutation({
    mutationFn: createTodo,
    onSuccess: invalidateTodos,
  });

  const {
    mutateAsync: updateTodoMutateAsync,
  } = useMutation({
    mutationFn: ({
      id,
      title,
      updatedAt,
    }: UpdateTodoMutationVariables) => updateTodo(id, { title, updatedAt }),
    onSettled: () => {
      setUpdatingTodoId(null);
    },
    onSuccess: invalidateTodos,
  });

  const {
    mutateAsync: deleteTodoMutateAsync,
  } = useMutation({
    mutationFn: deleteTodo,
    onSettled: () => {
      setDeletingTodoId(null);
    },
    onSuccess: invalidateTodos,
  });

  const handleCreateTodo = async (title: string) => {
    const createdAt = new Date().toISOString();

    await createTodoMutateAsync({
      completed: false,
      createdAt,
      title,
      updatedAt: createdAt,
    });
  };

  const handleUpdateTodo = async (id: Todo['id'], title: Todo['title']) => {
    setUpdatingTodoId(id);

    await updateTodoMutateAsync({
      id,
      title,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteTodo = async (id: Todo['id']) => {
    setDeletingTodoId(id);

    await deleteTodoMutateAsync(id);
  };

  return {
    deletingTodoId,
    handleCreateTodo,
    handleDeleteTodo,
    handleUpdateTodo,
    isCreatePending,
    isError,
    isLoading,
    todos,
    updatingTodoId,
  };
};
