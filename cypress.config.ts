import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/VR-todo/',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
    video: false,
  },
});
