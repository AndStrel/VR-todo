import { describe, expect, it } from 'vitest';
import { getVisibleTodos } from './getVisibleTodos';
import type { Todo } from './types';

const todos: Todo[] = [
  {
    completed: false,
    createdAt: '2026-04-25T09:00:00.000Z',
    id: 1,
    title: 'Подключить локальный сервер задач',
    updatedAt: '2026-04-25T09:00:00.000Z',
  },
  {
    completed: true,
    createdAt: '2026-04-25T11:00:00.000Z',
    id: 2,
    title: 'Завершить фильтры',
    updatedAt: '2026-04-25T11:00:00.000Z',
  },
  {
    completed: false,
    createdAt: '2026-04-25T10:00:00.000Z',
    id: 3,
    title: 'Написать поиск',
    updatedAt: '2026-04-25T10:00:00.000Z',
  },
];

const getTitles = (visibleTodos: Todo[]) =>
  visibleTodos.map((todo) => todo.title);

describe('getVisibleTodos', () => {
  it('filters tasks by search query', () => {
    expect(getTitles(getVisibleTodos({
      searchQuery: 'поиск',
      sort: 'newest',
      statusFilter: 'all',
      todos,
    }))).toEqual(['Написать поиск']);
  });

  it('filters tasks by status', () => {
    expect(getTitles(getVisibleTodos({
      searchQuery: '',
      sort: 'newest',
      statusFilter: 'completed',
      todos,
    }))).toEqual(['Завершить фильтры']);

    expect(getTitles(getVisibleTodos({
      searchQuery: '',
      sort: 'newest',
      statusFilter: 'active',
      todos,
    }))).toEqual([
      'Написать поиск',
      'Подключить локальный сервер задач',
    ]);
  });

  it('sorts tasks by date', () => {
    expect(getTitles(getVisibleTodos({
      searchQuery: '',
      sort: 'oldest',
      statusFilter: 'all',
      todos,
    }))).toEqual([
      'Подключить локальный сервер задач',
      'Написать поиск',
      'Завершить фильтры',
    ]);

    expect(getTitles(getVisibleTodos({
      searchQuery: '',
      sort: 'newest',
      statusFilter: 'all',
      todos,
    }))).toEqual([
      'Завершить фильтры',
      'Написать поиск',
      'Подключить локальный сервер задач',
    ]);
  });

  it('sorts tasks by status', () => {
    expect(getTitles(getVisibleTodos({
      searchQuery: '',
      sort: 'completed-first',
      statusFilter: 'all',
      todos,
    }))).toEqual([
      'Завершить фильтры',
      'Написать поиск',
      'Подключить локальный сервер задач',
    ]);

    expect(getTitles(getVisibleTodos({
      searchQuery: '',
      sort: 'active-first',
      statusFilter: 'all',
      todos,
    }))).toEqual([
      'Написать поиск',
      'Подключить локальный сервер задач',
      'Завершить фильтры',
    ]);
  });
});
