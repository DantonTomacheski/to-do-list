import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  firstName: string
  lastName: string
  photo?: string | null
}

interface UserState {
  user: User | null
  isOnboarded: boolean
  setUser: (user: User) => void
  updateUser: (updates: Partial<User>) => void
  clearUser: () => void
}

// Define persist configuration type
type UserPersistConfig = {
  name: string
}

// Create the store with proper typing for persist middleware
export const useUserStore = create<
  UserState,
  [['zustand/persist', UserState]]
>(
  persist(
    (set) => ({
      user: null,
      isOnboarded: false,
      setUser: (user) => set({ user, isOnboarded: true }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      clearUser: () => set({ user: null, isOnboarded: false })
    }),
    {
      name: 'user-storage',
    } as UserPersistConfig
  )
)