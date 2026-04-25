import type { Todo } from './types';

export type TodoStatusFilter = 'active' | 'all' | 'completed';

export type TodoSort = 'active-first' | 'completed-first' | 'newest' | 'oldest';

type GetVisibleTodosParams = {
  searchQuery: string;
  sort: TodoSort;
  statusFilter: TodoStatusFilter;
  todos: Todo[];
};

const compareByNewest = (firstTodo: Todo, secondTodo: Todo) =>
  Date.parse(secondTodo.createdAt) - Date.parse(firstTodo.createdAt);

export const getVisibleTodos = (params: GetVisibleTodosParams) => {
  const {
    searchQuery,
    sort,
    statusFilter,
    todos,
  } = params;
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  return [...todos]
    .filter((todo) => {
      if (statusFilter === 'active') {
        return !todo.completed;
      }

      if (statusFilter === 'completed') {
        return todo.completed;
      }

      return true;
    })
    .filter((todo) => todo.title.toLowerCase().includes(normalizedSearchQuery))
    .sort((firstTodo, secondTodo) => {
      if (sort === 'oldest') {
        return Date.parse(firstTodo.createdAt) - Date.parse(secondTodo.createdAt);
      }

      if (sort === 'active-first') {
        return (
          Number(firstTodo.completed) - Number(secondTodo.completed) ||
          compareByNewest(firstTodo, secondTodo)
        );
      }

      if (sort === 'completed-first') {
        return (
          Number(secondTodo.completed) - Number(firstTodo.completed) ||
          compareByNewest(firstTodo, secondTodo)
        );
      }

      return compareByNewest(firstTodo, secondTodo);
    });
};
