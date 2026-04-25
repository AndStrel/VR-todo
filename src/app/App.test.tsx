import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
};

const mockFetch = (response: unknown, ok = true) => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(response), {
          status: ok ? 200 : 500,
        }),
      ),
    ),
  );
};

const createTodo = {
  completed: false,
  createdAt: '2026-04-25T10:00:00.000Z',
  id: 2,
  title: 'Новая задача',
  updatedAt: '2026-04-25T10:00:00.000Z',
};

const existingTodo = {
  completed: false,
  createdAt: '2026-04-25T09:10:00.000Z',
  id: 1,
  title: 'Подключить локальный сервер задач',
  updatedAt: '2026-04-25T09:10:00.000Z',
};

const editedTodo = {
  ...existingTodo,
  title: 'Обновленная задача',
  updatedAt: '2026-04-25T11:00:00.000Z',
};

const completedTodo = {
  ...existingTodo,
  completed: true,
  updatedAt: '2026-04-25T12:00:00.000Z',
};

const todosForListControls = [
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

describe('App', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('renders the task panel heading', () => {
    mockFetch([]);

    renderApp();

    expect(
      screen.getByRole('heading', { name: 'Панель задач' }),
    ).toBeInTheDocument();
  });

  it('renders loaded tasks from the API', async () => {
    mockFetch([
      {
        id: 1,
        title: 'Подключить локальный сервер задач',
        completed: false,
        createdAt: '2026-04-25T09:10:00.000Z',
        updatedAt: '2026-04-25T09:10:00.000Z',
      },
    ]);

    renderApp();

    expect(await screen.findByText('Подключить локальный сервер задач'))
      .toBeInTheDocument();
  });

  it('renders loading state while tasks are loading', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => undefined)));

    renderApp();

    expect(screen.getByText('Загружаем задачи...')).toBeInTheDocument();
  });

  it('renders error state when tasks cannot be loaded', async () => {
    mockFetch({ message: 'Server error' }, false);

    renderApp();

    expect(await screen.findByText('Не удалось загрузить задачи'))
      .toBeInTheDocument();
  });

  it('creates a task and refreshes the list', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([])))
      .mockResolvedValueOnce(new Response(JSON.stringify(createTodo)))
      .mockResolvedValueOnce(new Response(JSON.stringify([createTodo])));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();

    await screen.findByRole('list');
    await userEvent.type(
      screen.getByLabelText('Название новой задачи'),
      '  Новая задача  ',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(await screen.findByText('Новая задача')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3001/todos',
      expect.objectContaining({
        body: expect.stringContaining('"title":"Новая задача"'),
        method: 'POST',
      }),
    );
    expect(screen.getByLabelText('Название новой задачи')).toHaveValue('');
  });

  it('does not create an empty task', async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response('[]')));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();

    await screen.findByRole('list');
    await userEvent.type(screen.getByLabelText('Название новой задачи'), '   ');
    await userEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('limits new task title length', async () => {
    mockFetch([]);

    renderApp();

    expect(await screen.findByLabelText('Название новой задачи'))
      .toHaveAttribute('maxlength', '120');
  });

  it('edits a task title and refreshes the list', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-04-25T11:00:00.000Z'));

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([existingTodo])))
      .mockResolvedValueOnce(new Response(JSON.stringify(editedTodo)))
      .mockResolvedValueOnce(new Response(JSON.stringify([editedTodo])));
    vi.stubGlobal('fetch', fetchMock);

    try {
      renderApp();

      await screen.findByText(existingTodo.title);
      await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
      await userEvent.clear(screen.getByLabelText('Название задачи'));
      await userEvent.type(
        screen.getByLabelText('Название задачи'),
        '  Обновленная задача  {Enter}',
      );

      expect(await screen.findByText('Обновленная задача')).toBeInTheDocument();
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        'http://localhost:3001/todos/1',
        expect.objectContaining({
          body: expect.stringContaining('"title":"Обновленная задача"'),
          method: 'PATCH',
        }),
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        'http://localhost:3001/todos/1',
        expect.objectContaining({
          body: expect.stringContaining(
            '"updatedAt":"2026-04-25T11:00:00.000Z"',
          ),
        }),
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('cancels task editing with Escape without saving', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([existingTodo])));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();

    await screen.findByText(existingTodo.title);
    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
    await userEvent.clear(screen.getByLabelText('Название задачи'));
    await userEvent.type(screen.getByLabelText('Название задачи'), 'Черновик');
    await userEvent.keyboard('{Escape}');

    expect(screen.getByText(existingTodo.title)).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Черновик')).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not save an empty edited task title', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([existingTodo])));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();

    await screen.findByText(existingTodo.title);
    await userEvent.click(screen.getByRole('button', { name: 'Редактировать' }));
    await userEvent.clear(screen.getByLabelText('Название задачи'));
    await userEvent.type(screen.getByLabelText('Название задачи'), '   {Enter}');

    expect(screen.getByLabelText('Название задачи')).toHaveValue('   ');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('deletes a task and refreshes the list', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([existingTodo])))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([])));
    vi.stubGlobal('fetch', fetchMock);

    renderApp();

    await screen.findByText(existingTodo.title);
    await userEvent.click(screen.getByRole('button', { name: 'Удалить' }));

    expect(await screen.findByRole('list')).toBeEmptyDOMElement();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3001/todos/1',
      {
        method: 'DELETE',
      },
    );
  });

  it('marks an active task as completed and refreshes the list', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-04-25T12:00:00.000Z'));

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([existingTodo])))
      .mockResolvedValueOnce(new Response(JSON.stringify(completedTodo)))
      .mockResolvedValueOnce(new Response(JSON.stringify([completedTodo])));
    vi.stubGlobal('fetch', fetchMock);

    try {
      renderApp();

      const checkbox = await screen.findByRole('checkbox', {
        name: 'Выполнена',
      });
      expect(checkbox).not.toBeChecked();

      await userEvent.click(checkbox);

      expect(await screen.findByRole('checkbox', {
        name: 'Выполнена',
      })).toBeChecked();
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        'http://localhost:3001/todos/1',
        expect.objectContaining({
          body: expect.stringContaining('"completed":true'),
          method: 'PATCH',
        }),
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        'http://localhost:3001/todos/1',
        expect.objectContaining({
          body: expect.stringContaining(
            '"updatedAt":"2026-04-25T12:00:00.000Z"',
          ),
        }),
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('marks a completed task as active and refreshes the list', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-04-25T12:00:00.000Z'));

    const activeTodo = {
      ...completedTodo,
      completed: false,
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([completedTodo])))
      .mockResolvedValueOnce(new Response(JSON.stringify(activeTodo)))
      .mockResolvedValueOnce(new Response(JSON.stringify([activeTodo])));
    vi.stubGlobal('fetch', fetchMock);

    try {
      renderApp();

      const checkbox = await screen.findByRole('checkbox', {
        name: 'Выполнена',
      });
      expect(checkbox).toBeChecked();

      await userEvent.click(checkbox);

      expect(await screen.findByRole('checkbox', {
        name: 'Выполнена',
      })).not.toBeChecked();
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        'http://localhost:3001/todos/1',
        expect.objectContaining({
          body: expect.stringContaining('"completed":false'),
          method: 'PATCH',
        }),
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('filters tasks by search query', async () => {
    mockFetch(todosForListControls);

    renderApp();

    await screen.findByText('Подключить локальный сервер задач');
    await userEvent.type(screen.getByLabelText('Поиск по задачам'), 'поиск');

    expect(screen.getByText('Написать поиск')).toBeInTheDocument();
    expect(screen.queryByText('Подключить локальный сервер задач'))
      .not.toBeInTheDocument();
    expect(screen.queryByText('Завершить фильтры')).not.toBeInTheDocument();
  });

  it('renders empty search state when no tasks match search query', async () => {
    mockFetch(todosForListControls);

    renderApp();

    await screen.findByText('Подключить локальный сервер задач');
    await userEvent.type(screen.getByLabelText('Поиск по задачам'), 'нет');

    expect(screen.getByText('ничего не найдено')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('filters tasks by status', async () => {
    mockFetch(todosForListControls);

    renderApp();

    await screen.findByText('Подключить локальный сервер задач');
    await userEvent.selectOptions(
      screen.getByLabelText('Фильтр задач'),
      'completed',
    );

    expect(screen.getByText('Завершить фильтры')).toBeInTheDocument();
    expect(screen.queryByText('Подключить локальный сервер задач'))
      .not.toBeInTheDocument();
    expect(screen.queryByText('Написать поиск')).not.toBeInTheDocument();

    await userEvent.selectOptions(
      screen.getByLabelText('Фильтр задач'),
      'active',
    );

    expect(screen.getByText('Подключить локальный сервер задач'))
      .toBeInTheDocument();
    expect(screen.getByText('Написать поиск')).toBeInTheDocument();
    expect(screen.queryByText('Завершить фильтры')).not.toBeInTheDocument();
  });

  it('sorts tasks by date', async () => {
    mockFetch(todosForListControls);

    renderApp();

    await screen.findByText('Подключить локальный сервер задач');
    await userEvent.selectOptions(
      screen.getByLabelText('Сортировка задач'),
      'oldest',
    );

    expect(screen.getAllByRole('listitem').map((item) => item.textContent))
      .toEqual([
        expect.stringContaining('Подключить локальный сервер задач'),
        expect.stringContaining('Написать поиск'),
        expect.stringContaining('Завершить фильтры'),
      ]);

    await userEvent.selectOptions(
      screen.getByLabelText('Сортировка задач'),
      'newest',
    );

    expect(screen.getAllByRole('listitem').map((item) => item.textContent))
      .toEqual([
        expect.stringContaining('Завершить фильтры'),
        expect.stringContaining('Написать поиск'),
        expect.stringContaining('Подключить локальный сервер задач'),
      ]);
  });

  it('sorts tasks by status', async () => {
    mockFetch(todosForListControls);

    renderApp();

    await screen.findByText('Подключить локальный сервер задач');
    await userEvent.selectOptions(
      screen.getByLabelText('Сортировка задач'),
      'completed-first',
    );

    expect(screen.getAllByRole('listitem').map((item) => item.textContent))
      .toEqual([
        expect.stringContaining('Завершить фильтры'),
        expect.stringContaining('Написать поиск'),
        expect.stringContaining('Подключить локальный сервер задач'),
      ]);

    await userEvent.selectOptions(
      screen.getByLabelText('Сортировка задач'),
      'active-first',
    );

    expect(screen.getAllByRole('listitem').map((item) => item.textContent))
      .toEqual([
        expect.stringContaining('Написать поиск'),
        expect.stringContaining('Подключить локальный сервер задач'),
        expect.stringContaining('Завершить фильтры'),
      ]);
  });

  it('switches theme and saves the selected mode', async () => {
    mockFetch([]);

    renderApp();

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await userEvent.click(screen.getByRole('button', { name: 'Темная тема' }));

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('todo-list-theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Светлая тема' }))
      .toBeInTheDocument();
  });

  it('uses saved theme on start', () => {
    localStorage.setItem('todo-list-theme', 'dark');
    mockFetch([]);

    renderApp();

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('button', { name: 'Светлая тема' }))
      .toBeInTheDocument();
  });
});
