import { spawn, type ChildProcess } from 'node:child_process';
import http from 'node:http';
import { defineConfig } from 'cypress';

const APP_URL = 'http://127.0.0.1:5175/test-todo-list/';
const API_ORIGIN = 'http://127.0.0.1:3011';
const API_URL = `${API_ORIGIN}/todos`;

const waitForUrl = (url: string) => new Promise<void>((resolve, reject) => {
  const timeoutMs = 30_000;
  const startedAt = Date.now();

  const check = () => {
    const request = http.get(url, (response) => {
      response.resume();
      resolve();
    });

    request.on('error', () => {
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Не удалось дождаться ${url}`));

        return;
      }

      setTimeout(check, 500);
    });
    request.setTimeout(1_000, () => {
      request.destroy();
    });
  };

  check();
});

const startProcess = (
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv = {},
) => spawn(
  command,
  args,
  {
    detached: true,
    env: {
      ...globalThis.process.env,
      ...env,
    },
    stdio: 'inherit',
  },
);

let processes: ChildProcess[] = [];

const stopProcesses = () => {
  for (const childProcess of processes) {
    if (childProcess.pid) {
      try {
        globalThis.process.kill(-childProcess.pid, 'SIGTERM');
      } catch {
        // Процесс уже мог завершиться сам, например при ошибке запуска.
      }
    }
  }

  processes = [];
};

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('before:run', async () => {
        processes = [
          startProcess(
            './node_modules/.bin/json-server',
            ['--watch', 'server/db.json', '--host', '127.0.0.1', '--port', '3011'],
          ),
          startProcess(
            './node_modules/.bin/vite',
            ['--host', '127.0.0.1', '--port', '5175', '--strictPort'],
            { VITE_API_URL: API_ORIGIN },
          ),
        ];

        try {
          await Promise.all([
            waitForUrl(API_URL),
            waitForUrl(APP_URL),
          ]);
        } catch (error) {
          stopProcesses();
          throw error;
        }
      });

      on('after:run', () => {
        stopProcesses();
      });
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
    video: false,
  },
});
