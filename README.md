# Todo List

## Запуск проекта

Установить зависимости:

```bash
npm install
```

Запустить приложение:

```bash
npm run dev
```

Запустить локальный API:

```bash
npm run server
```

Проверить сборку:

```bash
npm run build
```

Запустить тесты:

```bash
npm run test:run
```

Запустить e2e-тесты Cypress:

```bash
npm run dev
```

В отдельном терминале:

```bash
npm run test:e2e
```

Открыть Cypress App:

```bash
npm run test:e2e:open
```

Или запустить e2e-тесты одной коммандой:

```bash
npm run cypress
```

Открыть Cypress App вместе с dev-сервером:

```bash
npm run cypress:open
```

Команды `npm run cypress` и `npm run cypress:open` поднимают отдельные e2e-серверы на портах `5175` и `3011`, поэтому не конфликтуют с обычным `npm run dev`.

## API

В dev-режиме приложение использует локальный API:

```text
http://localhost:3001
```

Для production-сборки Vite подставляет `VITE_API_URL` из `.env.production`:

```text
https://jsonplaceholder.typicode.com
```

На GitHub Pages запросы `POST`, `PATCH` и `DELETE` выполняются, но JSONPlaceholder не сохраняет изменения после перезагрузки страницы. Для проверки CRUD с сохранением данных запускайте проект локально через `npm run dev`.

## Деплой

Деплой на GitHub Pages выполняется через GitHub Actions при пуше в `main`. Workflow запускает lint, unit-тесты, production-сборку и публикует папку `dist`.

Проверить код линтером:

```bash
npm run lint
```
