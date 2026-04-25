import { render, screen } from '@testing-library/react';
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
});
