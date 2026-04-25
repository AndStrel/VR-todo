import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../api/todoApi';
import type { Todo, UpdateTodoDto } from './types';

const TODOS_QUERY_KEY = ['todos'] as const;

type UpdateTodoMutationVariables = {
  id: Todo['id'];
  todo: UpdateTodoDto;
};

export const useTodos = () => {
  const queryClient = useQueryClient();
  const [deletingTodoId, setDeletingTodoId] = useState<Todo['id'] | null>(null);
  const [mutationErrorMessage, setMutationErrorMessage] = useState<string | null>(null);
  const [updatingTodoId, setUpdatingTodoId] = useState<Todo['id'] | null>(null);
  const {
    data: todos = [],
    isError,
    isLoading,
  } = useQuery({
    queryFn: getTodos,
    queryKey: TODOS_QUERY_KEY,
  });

  const invalidateTodos = async () => {
    await queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
  };

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
    mutationFn: ({ id, todo }: UpdateTodoMutationVariables) =>
      updateTodo(id, todo),
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

    setMutationErrorMessage(null);

    try {
      await createTodoMutateAsync({
        completed: false,
        createdAt,
        title,
        updatedAt: createdAt,
      });
    } catch (error) {
      setMutationErrorMessage('Не удалось создать задачу');
      throw error;
    }
  };

  const handleUpdateTodo = async (id: Todo['id'], title: Todo['title']) => {
    setUpdatingTodoId(id);
    setMutationErrorMessage(null);

    try {
      await updateTodoMutateAsync({
        id,
        todo: {
          title,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      setMutationErrorMessage('Не удалось обновить задачу');
      throw error;
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setUpdatingTodoId(todo.id);
    setMutationErrorMessage(null);

    try {
      await updateTodoMutateAsync({
        id: todo.id,
        todo: {
          completed: !todo.completed,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      setMutationErrorMessage('Не удалось обновить статус задачи');
      throw error;
    }
  };

  const handleDeleteTodo = async (id: Todo['id']) => {
    setDeletingTodoId(id);
    setMutationErrorMessage(null);

    try {
      await deleteTodoMutateAsync(id);
    } catch (error) {
      setMutationErrorMessage('Не удалось удалить задачу');
      throw error;
    }
  };

  return {
    deletingTodoId,
    handleCreateTodo,
    handleDeleteTodo,
    handleToggleTodo,
    handleUpdateTodo,
    isCreatePending,
    isError,
    isLoading,
    mutationErrorMessage,
    todos,
    updatingTodoId,
  };
};
