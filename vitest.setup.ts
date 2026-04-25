import '@testing-library/jest-dom/vitest';

const createTestStorage = (): Storage => {
  let storage = new Map<string, string>();

  return {
    get length() {
      return storage.size;
    },
    clear: () => {
      storage = new Map<string, string>();
    },
    getItem: (key: string) => storage.get(key) ?? null,
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    removeItem: (key: string) => {
      storage.delete(key);
    },
    setItem: (key: string, value: string) => {
      storage.set(key, String(value));
    },
  };
};

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: createTestStorage(),
});

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: globalThis.localStorage,
});
