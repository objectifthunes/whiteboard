import { createElement, type ElementType, type HTMLAttributes } from 'react'
import { cn } from './cn'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
}

interface CardTitleProps extends TypographyProps {
  clamp?: boolean
}

type MutedTextSize = 'xs' | 'sm' | 'md'

const mutedSizeClasses: Record<MutedTextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: '',
}

export function CardTitle({ as = 'p', clamp = false, className, ...props }: CardTitleProps) {
  return createElement(as, {
    className: cn('card-title', clamp && 'card-title--clamp', className),
    ...props,
  })
}

export function PageTitle({ as = 'h1', className, ...props }: TypographyProps) {
  return createElement(as, {
    className: cn('page-title', className),
    ...props,
  })
}

export function SectionTitle({ as = 'span', className, ...props }: TypographyProps) {
  return createElement(as, {
    className: cn('widget-section__title', className),
    ...props,
  })
}

export function SectionDescription({ as = 'p', className, ...props }: TypographyProps) {
  return createElement(as, {
    className: cn('widget-section__description', className),
    ...props,
  })
}

export function MutedText({ as = 'p', size = 'sm', className, ...props }: TypographyProps & { size?: MutedTextSize }) {
  return createElement(as, {
    className: cn(mutedSizeClasses[size], 'text-muted', className),
    ...props,
  })
}
