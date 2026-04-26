import type { CreateTodoDto, Todo, UpdateTodoDto } from '../model/types';

const DEFAULT_API_URL = 'http://localhost:3001';

type TodoResponse = Todo & {
  userId?: number;
};

const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

  return apiUrl.replace(/\/$/, '');
};

const getFallbackDate = (offsetMs = 0) =>
  new Date(Date.now() - offsetMs).toISOString();

const normalizeTodo = (todo: TodoResponse, fallbackDate = getFallbackDate()): Todo => ({
  id: todo.id,
  title: todo.title,
  completed: todo.completed,
  createdAt: todo.createdAt || fallbackDate,
  updatedAt: todo.updatedAt || todo.createdAt || fallbackDate,
});

const getJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const url = `${getApiUrl()}${path}`;
  const response = init ? await fetch(url, init) : await fetch(url);

  if (!response.ok) {
    throw new Error('Не удалось загрузить задачи');
  }

  return await response.json() as T;
};

export const getTodos = async () => {
  const todos = await getJson<TodoResponse[]>('/todos');

  return todos.map((todo, index) => normalizeTodo(todo, getFallbackDate(index)));
};

export const createTodo = async (todo: CreateTodoDto) => {
  const createdTodo = await getJson<TodoResponse>('/todos', {
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  return normalizeTodo(createdTodo);
};

export const updateTodo = async (id: Todo['id'], todo: UpdateTodoDto) => {
  const updatedTodo = await getJson<TodoResponse>(`/todos/${id}`, {
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
  });

  return normalizeTodo(updatedTodo);
};

export const deleteTodo = async (id: Todo['id']) => {
  const response = await fetch(`${getApiUrl()}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить задачи');
  }
};
