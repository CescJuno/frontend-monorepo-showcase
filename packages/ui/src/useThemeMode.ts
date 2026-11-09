import { useState, useContext, createContext } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  if (!context) {
    // Fallback for when used outside provider
    return { themeMode, setThemeMode };
  }
  return context;
};

export { ThemeContext };