// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Mock the zustand store
jest.mock('../src/store/userStore', () => ({
  useUserStore: jest.fn().mockImplementation(<T,>(selector: (state: any) => T) => 
    selector({
      user: {
        firstName: 'Test',
        lastName: 'User',
        photo: null
      },
      setUser: jest.fn(),
      updateUser: jest.fn(),
      clearUser: jest.fn()
    })
  )
}));

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en'
    }
  })
}));
