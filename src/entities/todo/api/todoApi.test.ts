import { createTodo, deleteTodo, getTodos, updateTodo } from './todoApi';

describe('todoApi', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('по умолчанию загружает задачи из локального API', async () => {
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

  it('выбрасывает ошибку, если ответ API не успешный', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response(null, { status: 500 }))),
    );

    await expect(getTodos()).rejects.toThrow('Не удалось загрузить задачи');
  });

  it('нормализует задачи без дат из JSONPlaceholder разными датами', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-26T12:00:00.000Z'));
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                id: 1,
                title: 'delectus aut autem',
                completed: false,
                userId: 1,
              },
              {
                id: 2,
                title: 'quis ut nam facilis',
                completed: true,
                userId: 1,
              },
            ]),
          ),
        ),
      ),
    );

    await expect(getTodos()).resolves.toEqual([
      {
        id: 1,
        title: 'delectus aut autem',
        completed: false,
        createdAt: '2026-04-26T12:00:00.000Z',
        updatedAt: '2026-04-26T12:00:00.000Z',
      },
      {
        id: 2,
        title: 'quis ut nam facilis',
        completed: true,
        createdAt: '2026-04-26T11:59:59.999Z',
        updatedAt: '2026-04-26T11:59:59.999Z',
      },
    ]);
  });

  it('создает задачу', async () => {
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

  it('обновляет задачу', async () => {
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

  it('удаляет задачу', async () => {
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
