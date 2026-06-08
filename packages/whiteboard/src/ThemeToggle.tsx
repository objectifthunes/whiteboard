
import { type ReactNode } from 'react'
import { Moon, Sun } from './icons'
import { cn } from './cn'

interface ThemeToggleProps {
  className?: string
  theme?: 'light' | 'dark'
  onToggle?: () => void
  lightIcon?: ReactNode
  darkIcon?: ReactNode
}

export function ThemeToggle({ className, theme = 'light', onToggle, lightIcon, darkIcon }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className={cn('wb-btn', 'wb-btn--secondary', 'wb-btn--icon-only', className)}
      onClick={onToggle}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (darkIcon ?? <Moon size={14} />) : (lightIcon ?? <Sun size={14} />)}
    </button>
  )
}
