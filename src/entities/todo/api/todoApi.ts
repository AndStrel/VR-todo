import type { CreateTodoDto, Todo, UpdateTodoDto } from '../model/types';

const DEFAULT_API_URL = 'http://localhost:3001';

const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

  return apiUrl.replace(/\/$/, '');
};

const getJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const url = `${getApiUrl()}${path}`;
  const response = init ? await fetch(url, init) : await fetch(url);

  if (!response.ok) {
    throw new Error('Не удалось загрузить задачи');
  }

  return await response.json() as T;
};

export const getTodos = () => getJson<Todo[]>('/todos');

export const createTodo = (todo: CreateTodoDto) =>
  getJson<Todo>('/todos', {
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

export const updateTodo = (id: Todo['id'], todo: UpdateTodoDto) =>
  getJson<Todo>(`/todos/${id}`, {
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
  });

export const deleteTodo = async (id: Todo['id']) => {
  const response = await fetch(`${getApiUrl()}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить задачи');
  }
};
