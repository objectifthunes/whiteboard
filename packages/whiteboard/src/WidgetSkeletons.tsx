import type { HTMLAttributes } from 'react'
import { ButtonRow } from './ButtonRow'
import { ItemCard } from './ItemCard'
import { List } from './List'
import { PickerCard } from './PickerCard'
import { Stack } from './Stack'
import { TagRow } from './TagRow'
import {
  ButtonSkeleton,
  ChipSkeleton,
  InputSkeleton,
  LineSkeleton,
  ThumbSkeleton,
  TitleSkeleton,
} from './Skeleton'

interface PanelFormSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  inputs?: number
  showButton?: boolean
}

/** Skeleton for a panel body containing inputs + an optional submit button. */
export function PanelFormSkeleton({ inputs = 1, showButton = true, className, ...props }: PanelFormSkeletonProps) {
  return (
    <Stack className={className} {...props}>
      {Array.from({ length: inputs }).map((_, i) => (
        <InputSkeleton key={`panel-form-input-${i}`} />
      ))}
      {showButton && <ButtonSkeleton />}
    </Stack>
  )
}

interface CardSkeletonProps extends HTMLAttributes<HTMLLIElement> {
  /** Show a thumbnail placeholder at the top of the card. Defaults to true. */
  withThumb?: boolean
  /** Number of chip placeholders shown above the title. */
  chipCount?: number
  /** Number of action-button placeholders shown at the bottom of the card. */
  actionCount?: number
}

/** Generic composed card skeleton — thumb + title + line + optional chips + optional actions. */
export function CardSkeleton({
  withThumb = true,
  chipCount = 0,
  actionCount = 0,
  className,
  ...props
}: CardSkeletonProps) {
  return (
    <ItemCard as="li" className={className} {...props}>
      <Stack size="sm">
        {withThumb ? <ThumbSkeleton /> : null}
        {chipCount > 0 ? (
          <TagRow>
            {Array.from({ length: chipCount }).map((_, i) => (
              <ChipSkeleton key={`card-skeleton-chip-${i}`} />
            ))}
          </TagRow>
        ) : null}
        <TitleSkeleton />
        <LineSkeleton short />
      </Stack>
      {actionCount > 0 ? (
        <ButtonRow>
          {Array.from({ length: actionCount }).map((_, i) => (
            <ButtonSkeleton key={`card-skeleton-btn-${i}`} />
          ))}
        </ButtonRow>
      ) : null}
    </ItemCard>
  )
}

interface PickerGridSkeletonProps {
  count?: number
  /** Minimum width (px) per cell — should match the real grid for layout stability. */
  minItemWidth?: number
}

export function PickerGridSkeleton({ count = 8, minItemWidth = 120 }: PickerGridSkeletonProps) {
  return (
    <List
      className="picker-grid"
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <li key={`picker-skeleton-${i}`}>
          <PickerCard as="div" className="picker-card--skeleton">
            <Stack size="sm">
              <ThumbSkeleton />
              <LineSkeleton short />
            </Stack>
          </PickerCard>
        </li>
      ))}
    </List>
  )
}
