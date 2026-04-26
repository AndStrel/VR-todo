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

type TodosUpdater = (todos: Todo[]) => Todo[];

export const useTodos = () => {
  const queryClient = useQueryClient();
  const [mutationErrorMessage, setMutationErrorMessage] = useState<string | null>(null);

  const {
    data: todos = [],
    isError,
    isLoading,
  } = useQuery({
    queryFn: getTodos,
    queryKey: TODOS_QUERY_KEY,
  });

  const updateTodosCache = (updater: TodosUpdater) => {
    queryClient.setQueryData<Todo[]>(TODOS_QUERY_KEY, (todos = []) =>
      updater(todos),
    );
  };

  const addTodoToCache = (todo: Todo) => {
    updateTodosCache((todos) => [...todos, todo]);
  };

  const updateTodoInCache = (id: Todo['id'], todo: UpdateTodoDto) => {
    updateTodosCache((todos) =>
      todos.map((currentTodo) =>
        currentTodo.id === id
          ? { ...currentTodo, ...todo }
          : currentTodo,
      ),
    );
  };

  const removeTodoFromCache = (id: Todo['id']) => {
    updateTodosCache((todos) => todos.filter((todo) => todo.id !== id));
  };

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: addTodoToCache,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, todo }: UpdateTodoMutationVariables) =>
      updateTodo(id, todo),
    onSuccess: (_, { id, todo }) => {
      updateTodoInCache(id, todo);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, deletedId) => removeTodoFromCache(deletedId),
  });

  const runMutation = async (
    mutation: () => Promise<unknown>,
    errorMessage: string,
  ) => {
    setMutationErrorMessage(null);

    try {
      await mutation();
    } catch (error) {
      setMutationErrorMessage(errorMessage);
      throw error;
    }
  };

  const handleCreateTodo = async (title: string) => {
    const createdAt = new Date().toISOString();

    await runMutation(
      () =>
        createMutation.mutateAsync({
          completed: false,
          createdAt,
          title,
          updatedAt: createdAt,
        }),
      'Не удалось создать задачу',
    );
  };

  const handleUpdateTodo = async (id: Todo['id'], title: Todo['title']) => {
    await runMutation(
      () =>
        updateMutation.mutateAsync({
          id,
          todo: {
            title,
            updatedAt: new Date().toISOString(),
          },
        }),
      'Не удалось обновить задачу',
    );
  };

  const handleToggleTodo = async (todo: Todo) => {
    await runMutation(
      () =>
        updateMutation.mutateAsync({
          id: todo.id,
          todo: {
            completed: !todo.completed,
            updatedAt: new Date().toISOString(),
          },
        }),
      'Не удалось обновить статус задачи',
    );
  };

  const handleDeleteTodo = async (id: Todo['id']) => {
    await runMutation(
      () => deleteMutation.mutateAsync(id),
      'Не удалось удалить задачу',
    );
  };

  const updatingTodoId = updateMutation.isPending
    ? updateMutation.variables?.id ?? null
    : null;
  const deletingTodoId = deleteMutation.isPending
    ? deleteMutation.variables ?? null
    : null;

  return {
    deletingTodoId,
    handleCreateTodo,
    handleDeleteTodo,
    handleToggleTodo,
    handleUpdateTodo,
    isCreatePending: createMutation.isPending,
    isError,
    isLoading,
    mutationErrorMessage,
    todos,
    updatingTodoId,
  };
};
