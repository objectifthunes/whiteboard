import type { HTMLAttributes } from 'react'
import { cn } from './cn'

/** Keyboard-key chip for shortcut hints: <Kbd>esc</Kbd> <Kbd>⌫</Kbd>. */
export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <kbd className={cn('kbd', className)} {...props} />
}
