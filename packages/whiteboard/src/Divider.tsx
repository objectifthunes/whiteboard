import type { HTMLAttributes } from 'react'
import { cn } from './cn'

interface DividerProps extends HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical'
}

/** Hairline separator; vertical inside toolbars/inlines, horizontal in stacks. */
export function Divider({ orientation = 'horizontal', className, ...props }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        className={cn('divider', 'divider--vertical', className)}
        {...props}
      />
    )
  }
  return <hr className={cn('divider', className)} {...props} />
}
