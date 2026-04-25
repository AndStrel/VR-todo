describe('основной сценарий управления задачами', () => {
  const appUrl = 'http://127.0.0.1:5175/test-todo-list/';

  it('создает, ищет, отмечает, редактирует и удаляет задачу', () => {
    const title = `E2E задача ${Date.now()}`;
    const editedTitle = `${title} обновлена`;

    cy.visit(appUrl);

    cy.contains('h1', 'Панель задач').should('be.visible');
    cy.get('input[placeholder="Что нужно сделать?"]').type(title);
    cy.contains('button', 'Добавить').click();

    cy.contains('li', title).should('be.visible');
    cy.get('input[placeholder="Найти задачу"]').type(title);
    cy.contains('li', title).should('be.visible');

    cy.contains('li', title).within(() => {
      cy.get('input[type="checkbox"]').check();
      cy.get('input[type="checkbox"]').should('be.checked');
    });

    cy.contains('li', title).within(() => {
      cy.contains('button', 'Редактировать').click();
    });

    cy.contains('form', 'Сохранить').within(() => {
      cy.get('input')
        .clear()
        .type(`${editedTitle}{enter}`);
    });

    cy.contains('li', editedTitle).should('be.visible');
    cy.contains('li', editedTitle).within(() => {
      cy.contains('button', 'Удалить').click();
    });

    cy.contains(editedTitle).should('not.exist');
  });

  it('открывает основной экран на мобильной ширине', () => {
    cy.viewport(390, 844);
    cy.visit(appUrl);

    cy.contains('h1', 'Панель задач').should('be.visible');
    cy.get('input[placeholder="Что нужно сделать?"]').should('be.visible');
  });
});
