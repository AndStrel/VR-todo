import { createTodo, deleteTodo, getTodos, updateTodo } from './todoApi';

describe('todoApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads todos from localhost API by default', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify([
            {
              id: 1,
              title: 'Подключить работу с API',
              completed: false,
              createdAt: '2026-04-25T09:30:00.000Z',
              updatedAt: '2026-04-25T09:30:00.000Z',
            },
          ]),
        ),
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(getTodos()).resolves.toEqual([
      {
        id: 1,
        title: 'Подключить работу с API',
        completed: false,
        createdAt: '2026-04-25T09:30:00.000Z',
        updatedAt: '2026-04-25T09:30:00.000Z',
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/todos');
  });

  it('throws an error when API response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(null, { status: 500 }))),
    );

    await expect(getTodos()).rejects.toThrow('Не удалось загрузить задачи');
  });

  it('creates a todo', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            id: 2,
            title: 'Новая задача',
            completed: false,
            createdAt: '2026-04-25T10:00:00.000Z',
            updatedAt: '2026-04-25T10:00:00.000Z',
          }),
        ),
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      createTodo({
        title: 'Новая задача',
        completed: false,
        createdAt: '2026-04-25T10:00:00.000Z',
        updatedAt: '2026-04-25T10:00:00.000Z',
      }),
    ).resolves.toMatchObject({
      id: 2,
      title: 'Новая задача',
    });
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/todos', {
      body: JSON.stringify({
        title: 'Новая задача',
        completed: false,
        createdAt: '2026-04-25T10:00:00.000Z',
        updatedAt: '2026-04-25T10:00:00.000Z',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  });

  it('updates a todo', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            id: 2,
            title: 'Обновленная задача',
            completed: true,
            createdAt: '2026-04-25T10:00:00.000Z',
            updatedAt: '2026-04-25T10:05:00.000Z',
          }),
        ),
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      updateTodo(2, {
        completed: true,
        title: 'Обновленная задача',
        updatedAt: '2026-04-25T10:05:00.000Z',
      }),
    ).resolves.toMatchObject({
      id: 2,
      completed: true,
    });
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/todos/2', {
      body: JSON.stringify({
        completed: true,
        title: 'Обновленная задача',
        updatedAt: '2026-04-25T10:05:00.000Z',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });
  });

  it('deletes a todo', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 200 })),
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(deleteTodo(2)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/todos/2', {
      method: 'DELETE',
    });
  });
});
