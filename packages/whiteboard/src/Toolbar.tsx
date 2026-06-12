import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

interface ToolbarProps extends HTMLAttributes<HTMLElement> {
  /** 'top' (fixed, centered) · 'bottom' · 'static' (position it yourself). */
  position?: 'top' | 'bottom' | 'static'
  /** Actions pinned to the end of the bar after a divider gap. */
  end?: ReactNode
}

/**
 * Horizontal sibling of VerticalToolbar — same surface, same rhythm.
 * The app-chrome bar: title, file chip, navigation, primary action.
 */
export function Toolbar({ children, end, position = 'top', className, ...props }: ToolbarProps) {
  return (
    <nav
      className={cn(
        'toolbar',
        position === 'bottom' && 'toolbar--bottom',
        position === 'static' && 'toolbar--static',
        className
      )}
      {...props}
    >
      <div className="toolbar__items">{children}</div>
      {end != null && <div className="toolbar__end">{end}</div>}
    </nav>
  )
}
