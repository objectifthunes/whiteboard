import type { ReactNode } from 'react'
import { Stack } from './Stack'
import { CardTitle, MutedText } from './Typography'

interface EmptyStateProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Stack size="sm">
      <CardTitle>{title}</CardTitle>
      {description ? <MutedText>{description}</MutedText> : null}
      {action}
    </Stack>
  )
}
