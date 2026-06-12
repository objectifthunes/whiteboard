import { createElement, type ElementType, type HTMLAttributes } from 'react'
import { cn } from './cn'

interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  padding?: 'none' | 'sm' | 'md'
}

/**
 * The plain floating surface: --wb-surface background, border, radius,
 * soft shadow. For overlays that live OUTSIDE a WhiteboardShell —
 * selection menus, legends, log panes — where FloatingPanel's canvas
 * coupling would be wrong.
 */
export function Surface({ as, padding = 'md', className, ...props }: SurfaceProps) {
  return createElement(as ?? 'div', {
    className: cn(
      'surface',
      padding === 'sm' && 'surface--pad-sm',
      padding === 'none' && 'surface--pad-none',
      className
    ),
    ...props,
  })
}
