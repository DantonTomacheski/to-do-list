import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Set up automatic cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock userStore
vi.mock('../store/userStore', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useUserStore: vi.fn().mockImplementation((selector: (state: Record<string, unknown>) => unknown) => 
    selector({
      user: {
        firstName: 'Test',
        lastName: 'User',
        photo: null
      },
      setUser: vi.fn(),
      updateUser: vi.fn(),
      clearUser: vi.fn()
    })
  )
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en'
    }
  })
}));
