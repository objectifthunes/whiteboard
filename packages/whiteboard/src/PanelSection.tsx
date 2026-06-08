import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'
import { SectionDescription, SectionTitle } from './Typography'

interface PanelSectionProps extends HTMLAttributes<HTMLElement> {
  heading?: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export function PanelSection({ heading, description, actions, className, children, ...props }: PanelSectionProps) {
  return (
    <section className={cn('widget-section', className)} {...props}>
      {heading || actions ? (
        <header className={actions ? 'title-row' : undefined}>
          {heading ? <SectionTitle>{heading}</SectionTitle> : null}
          {actions}
        </header>
      ) : null}
      {description ? <SectionDescription>{description}</SectionDescription> : null}
      {children}
    </section>
  )
}
