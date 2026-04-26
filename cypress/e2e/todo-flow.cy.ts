const visitApp = () => {
  cy.visit('/');
  cy.contains('h1', 'Панель задач').should('be.visible');
};

const addTask = (title: string) => {
  cy.get('input[placeholder="Что нужно сделать?"]').clear().type(title);
  cy.contains('button', 'Добавить').click();
  cy.contains('li', title).should('be.visible');
};

const deleteTask = (title: string) => {
  cy.contains('li', title).within(() => {
    cy.contains('button', 'Удалить').click();
  });
  cy.contains(title).should('not.exist');
};

describe('e2e сценарии управления задачами', () => {
  it('добавляет задачу', () => {
    const title = `E2E добавление ${Date.now()}`;

    visitApp();
    addTask(title);
    deleteTask(title);
  });

  it('редактирует задачу', () => {
    const title = `E2E редактирование ${Date.now()}`;
    const editedTitle = `${title} обновлена`;

    visitApp();
    addTask(title);
    cy.contains('li', title).within(() => {
      cy.contains('button', 'Редактировать').click();
    });
    cy.contains('form', 'Сохранить').within(() => {
      cy.get('input').clear().type(`${editedTitle}{enter}`);
    });

    cy.contains('li', editedTitle).should('be.visible');
    deleteTask(editedTitle);
  });

  it('удаляет задачу', () => {
    const title = `E2E удаление ${Date.now()}`;

    visitApp();
    addTask(title);
    deleteTask(title);
  });

  it('отмечает задачу выполненной', () => {
    const title = `E2E статус ${Date.now()}`;

    visitApp();
    addTask(title);
    cy.contains('li', title).within(() => {
      cy.get('input[type="checkbox"]').check();
      cy.get('input[type="checkbox"]').should('be.checked');
    });
    deleteTask(title);
  });

  it('ищет задачу по названию', () => {
    visitApp();
    cy.get('input[placeholder="Найти задачу"]').type('локальный');

    cy.contains('li', 'Подключить локальный сервер').should('be.visible');
    cy.contains('Развернуть тудуху').should('not.exist');
  });

  it('переключает разные сортировки задач', () => {
    visitApp();

    cy.get('li').eq(0).should('contain.text', 'Проверить запросы');
    cy.contains('label', 'Сортировка задач').find('select').select('oldest');
    cy.get('li').eq(0).should('contain.text', 'Развернуть тудуху');
    cy.contains('label', 'Сортировка задач')
      .find('select')
      .select('active-first');
    cy.get('li').eq(0).should('contain.text', 'Подключить локальный сервер');
    cy.contains('label', 'Сортировка задач')
      .find('select')
      .select('completed-first');
    cy.get('li').eq(0).should('contain.text', 'Проверить запросы');
  });

  it('переключает тему и сохраняет выбранный режим', () => {
    visitApp();

    cy.document()
      .its('documentElement.dataset.theme')
      .should('eq', 'light');
    cy.contains('button', 'Темная тема').click();
    cy.document()
      .its('documentElement.dataset.theme')
      .should('eq', 'dark');
    cy.window()
      .its('localStorage')
      .invoke('getItem', 'todo-list-theme')
      .should('eq', 'dark');

    cy.reload();
    cy.document()
      .its('documentElement.dataset.theme')
      .should('eq', 'dark');
    cy.contains('button', 'Светлая тема').should('be.visible');
  });

  it('открывает основной экран на мобильной ширине', () => {
    cy.viewport(390, 844);
    visitApp();

    cy.get('input[placeholder="Что нужно сделать?"]').should('be.visible');
  });
});
