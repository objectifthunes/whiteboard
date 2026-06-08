import type { HTMLAttributes } from 'react'
import { cn } from './cn'

type AlertTone = 'error' | 'muted' | 'info' | 'success'

interface AlertProps extends HTMLAttributes<HTMLParagraphElement> {
  tone?: AlertTone
}

const toneClasses: Record<AlertTone, string> = {
  error: 'wb-alert wb-alert--error',
  muted: 'wb-alert wb-alert--muted',
  info: 'wb-alert wb-alert--info',
  success: 'wb-alert wb-alert--success',
}

export function Alert({ tone = 'info', className, ...props }: AlertProps) {
  return <p className={cn(toneClasses[tone], className)} {...props} />
}
