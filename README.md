# VR Todo

Приложение для управления задачами: создание, редактирование, удаление, переключение статуса, поиск, фильтрация и сортировка.

Демо: https://andstrel.github.io/VR-todo/

## Стек

- React
- TypeScript
- Vite
- TanStack Query
- SCSS Modules
- Vitest + Testing Library
- Cypress
- json-server

## Установка

```bash
npm install
```

## Локальный запуск

```bash
npm run dev
```

Команда запускает фронтенд и локальный API:

- приложение: `http://localhost:5173/VR-todo/`
- API: `http://localhost:3001/todos`

Локально данные сохраняются в `server/db.json`.

## Production API

В production-сборке используется API из `.env.production`:

```text
https://jsonplaceholder.typicode.com
```

На GitHub Pages приложение делает реальные `GET`, `POST`, `PATCH` и `DELETE` запросы, но JSONPlaceholder не сохраняет изменения после перезагрузки. Для проверки CRUD с сохранением данных используйте локальный запуск.

## Команды

```bash
npm run lint
npm run test:run
npm run build
```

E2E-тесты:

```bash
npm run dev
```

В отдельном терминале:

```bash
npm run test:e2e
```

Открыть Cypress App вместе с dev-сервером:

```bash
npm run cypress
```

## Деплой

Деплой на GitHub Pages выполняется через GitHub Actions при пуше в `main`.

Workflow:

1. Устанавливает зависимости через `npm ci`.
2. Запускает `npm run lint`.
3. Запускает `npm run test:run`.
4. Собирает проект через `npm run build`.
5. Публикует папку `dist` на GitHub Pages.

## Безопасность

- Пользовательский ввод рендерится как обычный текст.
- Длинна строки ввода ограничена до 120 символов
- `dangerouslySetInnerHTML` не используется.
- Ошибки загрузки и мутаций показываются пользователю.
- Есть тест на XSS-like строку: `<img src=x onerror=alert(1)>`.
