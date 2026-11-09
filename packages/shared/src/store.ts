import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User store
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user): void => set({ user, isAuthenticated: true }),
      logout: (): void => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
);

// App settings store
interface AppSettings {
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  notifications: boolean;
}

interface AppState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: {
        theme: 'light',
        language: 'ko',
        notifications: true,
      },
      updateSettings: (newSettings): void =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'app-settings',
    }
  )
);