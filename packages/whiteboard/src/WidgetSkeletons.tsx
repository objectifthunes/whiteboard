import type { HTMLAttributes } from 'react'
import { cn } from './cn'
import { ButtonRow } from './ButtonRow'
import { Inline } from './Inline'
import { ItemCard } from './ItemCard'
import { ItemList } from './ItemList'
import { List } from './List'
import { PickerCard } from './PickerCard'
import { SplitLayout } from './SplitLayout'
import { Stack } from './Stack'
import { TagRow } from './TagRow'
import { AvatarSkeleton, ButtonSkeleton, ChipSkeleton, InputSkeleton, LineSkeleton, SelectSkeleton, ThumbSkeleton, TitleSkeleton } from './Skeleton'

interface PanelFormSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  inputs?: number
  showButton?: boolean
}

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

export function StoryCardSkeleton() {
  return (
    <ItemCard>
      <Stack size="sm">
        <ThumbSkeleton />
        <Inline as="header">
          <ChipSkeleton />
          <ChipSkeleton />
        </Inline>
        <TitleSkeleton />
        <LineSkeleton short />
      </Stack>
    </ItemCard>
  )
}

export function UserCardSkeleton() {
  return (
    <ItemCard as="li">
      <SplitLayout variant="user">
        <AvatarSkeleton />
        <Stack size="sm">
          <TitleSkeleton />
          <LineSkeleton short />
        </Stack>
        <Stack size="sm">
          <ChipSkeleton />
          <SelectSkeleton />
        </Stack>
      </SplitLayout>
    </ItemCard>
  )
}

interface UserListSkeletonProps {
  count?: number
}

export function UserListSkeleton({ count = 3 }: UserListSkeletonProps) {
  return (
    <ItemList as="ul">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={`user-skeleton-${i}`} />
      ))}
    </ItemList>
  )
}

export function AssetCardSkeleton() {
  return (
    <ItemCard as="li">
      <Stack size="sm">
        <ThumbSkeleton />
        <TitleSkeleton />
        <TagRow>
          <ChipSkeleton />
          <ChipSkeleton />
        </TagRow>
      </Stack>
      <ButtonRow>
        <ButtonSkeleton />
        <ButtonSkeleton />
      </ButtonRow>
    </ItemCard>
  )
}

interface PickerGridSkeletonProps {
  count?: number
  gridClass: string
}

export function PickerGridSkeleton({ count = 8, gridClass }: PickerGridSkeletonProps) {
  return (
    <List className={cn('picker-grid', gridClass)}>
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
