'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type WbTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: WbTheme
  setTheme: (theme: WbTheme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'wb-theme'

/**
 * Owns the kit's theme state: persists the choice, and keeps
 * `data-theme` on <html> and <body> in sync so every `--wb-*` token
 * (and any consumer CSS keyed on `[data-theme]`) follows.
 *
 * SSR-safe: the server renders `defaultTheme`; the stored choice is
 * applied on mount. Pair with `data-theme={defaultTheme}` on <body>
 * (plus `suppressHydrationWarning` on <html>) to avoid a flash.
 */
export function ThemeProvider({
  defaultTheme = 'dark',
  children,
}: {
  defaultTheme?: WbTheme
  children: ReactNode
}) {
  const [theme, setThemeState] = useState<WbTheme>(defaultTheme)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') setThemeState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.body.dataset.theme = theme
  }, [theme])

  const setTheme = useCallback((next: WbTheme) => {
    setThemeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage may be unavailable (private mode); theme still applies
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/** Theme state from the nearest ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used inside a <ThemeProvider>')
  }
  return ctx
}
