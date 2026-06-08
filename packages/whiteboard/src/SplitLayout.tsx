import type { HTMLAttributes } from 'react'
import { cn } from './cn'

type SplitLayoutVariant = 'media-content' | 'single' | 'media-content-actions'

const variantClasses: Record<SplitLayoutVariant, string> = {
  'media-content': 'split-layout--media-content',
  'single': 'split-layout--single',
  'media-content-actions': 'split-layout--media-content-actions',
}

interface SplitLayoutProps extends HTMLAttributes<HTMLDivElement> {
  variant: SplitLayoutVariant
}

/**
 * Two- or three-column grid for media + content (+ actions) rows.
 *
 * - `media-content` — fixed media column + flexible content column.
 * - `single` — one column (use as the small-screen fallback).
 * - `media-content-actions` — auto media + flexible content + auto actions.
 */
export function SplitLayout({ variant, className, ...props }: SplitLayoutProps) {
  return <div className={cn('split-layout', variantClasses[variant], className)} {...props} />
}
