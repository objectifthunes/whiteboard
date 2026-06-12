import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Bubble content. Keep it to a few words. */
  label: ReactNode
  placement?: 'top' | 'bottom'
  children: ReactNode
}

/**
 * CSS-only tooltip: shows on hover and on keyboard focus, no JS, no
 * portal. Wraps its child inline.
 */
export function Tooltip({ label, placement = 'top', className, children, ...props }: TooltipProps) {
  return (
    <span
      className={cn('tooltip', placement === 'bottom' && 'tooltip--bottom', className)}
      {...props}
    >
      {children}
      <span role="tooltip" className="tooltip__bubble">
        {label}
      </span>
    </span>
  )
}
