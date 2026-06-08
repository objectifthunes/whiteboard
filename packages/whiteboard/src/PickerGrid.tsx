import type { CSSProperties, HTMLAttributes } from 'react'
import { cn } from './cn'
import { List } from './List'

interface PickerGridProps extends HTMLAttributes<HTMLUListElement> {
  /** Minimum width (px) of each cell. The grid auto-fills as many columns as fit. */
  minItemWidth?: number
}

/**
 * Responsive grid for picker cards. Uses `repeat(auto-fill, minmax(minItemWidth, 1fr))`.
 */
export function PickerGrid({ minItemWidth = 120, className, style, ...props }: PickerGridProps) {
  const mergedStyle: CSSProperties = {
    gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
    ...style,
  }
  return <List className={cn('picker-grid', className)} style={mergedStyle} {...props} />
}
