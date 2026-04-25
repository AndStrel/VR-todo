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

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
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
});
